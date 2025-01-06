use cosmwasm_std::{entry_point, to_json_binary, BankMsg, Binary, Coin, Deps, DepsMut, Env, MessageInfo, Order, Response, StdError, StdResult, Uint128};
use cw_storage_plus::Bound;
use crate::msg::{Config, Direction, ExecuteMsg, ListOptionsResponse, OptionInfo, PlaceOptionMsg, QueryMsg};
use crate::state::{CONFIG, OPTIONS, OPTION_COUNTER};

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: Config,
) -> StdResult<Response> {
    CONFIG.save(deps.storage, &msg)?;

    OPTION_COUNTER.save(deps.storage, &0u64)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender.to_string())
        .add_attribute("oracle_addr", msg.oracle_addr.to_string())
        .add_attribute("payout_multiplier", msg.payout_multiplier.to_string()))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::PlaceOption(msg_place) => {
            execute_place_option(deps, env, info, msg_place)
        }
        ExecuteMsg::SettleOption { option_id } => {
            execute_settle_option(deps, env, info, option_id)
        }
    }
}

fn execute_place_option(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: PlaceOptionMsg,
) -> StdResult<Response> {
    if info.funds.len() != 1 {
        return Err(StdError::generic_err("Please, send exactly one coin"));
    }

    let sent_coin = &info.funds[0];

    if sent_coin.amount != msg.bet_amount.amount || sent_coin.denom != msg.bet_amount.denom {
        return Err(StdError::generic_err("Please, send the correct amount and denom"));
    }

    let current_price = 1000u128;

    let mut option_counter = OPTION_COUNTER.load(deps.storage)?;
    option_counter += 1;
    OPTION_COUNTER.save(deps.storage, &option_counter)?;

    let option_info = OptionInfo {
        id: option_counter,
        owner: info.sender.clone(),
        direction: msg.direction,
        strike_price: current_price,
        expiration: msg.expiration,
        bet_amount: msg.bet_amount.clone(),
        settled: false,
        outcome: None,
    };

    OPTIONS.save(deps.storage, option_counter, &option_info)?;

    Ok(Response::new()
        .add_attribute("action", "place_option")
        .add_attribute("option_id", option_counter.to_string())
        .add_attribute("strike_price", current_price.to_string())
        .add_attribute("expiration", msg.expiration.to_string()))
}

fn execute_settle_option(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    option_id: u64,
) -> StdResult<Response> {
    let mut option = OPTIONS.load(deps.storage, option_id)?;
    if option.settled {
        return Err(StdError::generic_err("This option has already been settled"));
    }

    let current_time = env.block.time.seconds();
    if current_time < option.expiration {
        return Err(StdError::generic_err("This option has not expired yet"));
    }

    let config = CONFIG.load(deps.storage)?;

    let current_price = 1200u128;

    let is_call = matches!(option.direction, Direction::Up);
    let did_win = if is_call {
        current_price > option.strike_price
    } else {
        current_price < option.strike_price
    };

    option.settled = true;
    option.outcome = Some(did_win);

    OPTIONS.save(deps.storage, option_id, &option)?;

    if did_win {
        let payout_amount = option
            .bet_amount
            .amount
            .checked_mul(Uint128::from(config.payout_multiplier as u128))
            .map_err(|_| StdError::generic_err("Overflow when calculating payout"))?
            / Uint128::from(100u128);

        let send_msg = BankMsg::Send {
            to_address: option.owner.to_string(),
            amount: vec![Coin {
                denom: option.bet_amount.denom.clone(),
                amount: payout_amount,
            }],
        };

        Ok(Response::new()
            .add_message(send_msg)
            .add_attribute("action", "settle_option")
            .add_attribute("option_id", option_id.to_string())
            .add_attribute("result", "won")
            .add_attribute("payout", payout_amount.to_string()))
    } else {
        Ok(Response::new()
            .add_attribute("action", "settle_option")
            .add_attribute("option_id", option_id.to_string())
            .add_attribute("result", "lost"))
    }
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetOption { option_id } => to_json_binary(&query_option(deps, option_id)?),
        QueryMsg::ListOptions { start_after, limit } => {
            to_json_binary(&query_list_options(deps, start_after, limit)?)
        }
        QueryMsg::GetConfig {} => to_json_binary(
            &query_config(deps)?
        ),
    }
}

fn query_option(deps: Deps, option_id: u64) -> StdResult<OptionInfo> {
    let opt = OPTIONS.load(deps.storage, option_id)?;
    Ok(opt)
}

fn query_list_options(
    deps: Deps,
    start_after: Option<u64>,
    limit: Option<u32>,
) -> StdResult<ListOptionsResponse> {
    let limit = limit.unwrap_or(10) as usize;
    let start_key = start_after.map(|id| id + 1);
    let start = start_key.map(Bound::exclusive);

    let options: Vec<OptionInfo> = OPTIONS
        .range(deps.storage, start, None, Order::Ascending)
        .take(limit)
        .map(|res| {
            let (_key, option_info) = res?;
            Ok(option_info)
        })
        .collect::<StdResult<Vec<OptionInfo>>>()?;

    Ok(ListOptionsResponse { options })
}

fn query_config(deps: Deps) -> StdResult<Config> {
    let cfg = CONFIG.load(deps.storage)?;
    Ok(cfg)
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_json, Addr, Attribute, BankMsg, Timestamp, Uint128};

    use crate::msg::{Config, Direction, ExecuteMsg, PlaceOptionMsg, QueryMsg, OptionInfo, ListOptionsResponse};

    #[test]
    fn test_instantiate() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &[]);

        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle"),
            payout_multiplier: 200,
        };

        let res = instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        assert_eq!(res.attributes.len(), 4);
        assert_eq!(res.attributes[0], Attribute::new("method", "instantiate"));
        assert_eq!(res.attributes[1], Attribute::new("owner", "creator"));
        assert_eq!(res.attributes[2], Attribute::new("oracle_addr", "oracle"));
        assert_eq!(res.attributes[3], Attribute::new("payout_multiplier", "200"));
    }

    fn query_config_helper(deps: &Deps) -> Config {
        let bin = query(*deps, mock_env(), QueryMsg::GetConfig {}).unwrap();
        from_json::<Config>(&bin).unwrap()
    }

    #[test]
    fn test_query_config() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("creator", &[]);

        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle"),
            payout_multiplier: 250,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        let config = query_config_helper(&deps.as_ref());
        assert_eq!(config.oracle_addr, Addr::unchecked("oracle"));
        assert_eq!(config.payout_multiplier, 250);
    }

    #[test]
    fn test_place_option_success() {
        let mut deps = mock_dependencies();

        let env = mock_env();
        let info = mock_info("creator", &[]);
        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle"),
            payout_multiplier: 200,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        let option_msg = PlaceOptionMsg {
            direction: Direction::Up,
            expiration: 1_700_000_000, // tiempo simulado
            bet_amount: coins(100, "token")[0].clone(),
        };

        let info_user = mock_info("alice", &coins(100, "token"));
        let res = execute(
            deps.as_mut(),
            env.clone(),
            info_user.clone(),
            ExecuteMsg::PlaceOption(option_msg.clone()),
        )
            .unwrap();

        assert_eq!(res.attributes.len(), 4);
        assert_eq!(res.attributes[0], Attribute::new("action", "place_option"));

        assert_eq!(res.attributes[1].value, "1");
        assert_eq!(res.attributes[2], Attribute::new("strike_price", "1000"));
        assert_eq!(res.attributes[3], Attribute::new("expiration", "1700000000"));

        let bin_opt = query(deps.as_ref(), env.clone(), QueryMsg::GetOption { option_id: 1 }).unwrap();
        let opt_info: OptionInfo = from_json(&bin_opt).unwrap();
        assert_eq!(opt_info.id, 1);
        assert_eq!(opt_info.owner, Addr::unchecked("alice"));
        assert_eq!(opt_info.direction, Direction::Up);
        assert_eq!(opt_info.strike_price, 1000);
        assert_eq!(opt_info.expiration, 1_700_000_000);
        assert_eq!(opt_info.bet_amount.amount, Uint128::new(100));
        assert_eq!(opt_info.bet_amount.denom, "token");
        assert_eq!(opt_info.settled, false);
        assert_eq!(opt_info.outcome, None);
    }

    #[test]
    fn test_place_option_incorrect_funds() {
        let mut deps = mock_dependencies();

        let env = mock_env();
        let info = mock_info("creator", &[]);
        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle"),
            payout_multiplier: 200,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        let option_msg = PlaceOptionMsg {
            direction: Direction::Up,
            expiration: 1_700_000_000,
            bet_amount: coins(100, "token")[0].clone(),
        };
        let info_user = mock_info("alice", &[
            Coin { denom: "token".into(), amount: Uint128::new(100) },
            Coin { denom: "other".into(), amount: Uint128::new(50) },
        ]);

        let err = execute(
            deps.as_mut(),
            env.clone(),
            info_user.clone(),
            ExecuteMsg::PlaceOption(option_msg.clone()),
        )
            .unwrap_err();
        assert_eq!(err.to_string(), "Generic error: Please, send exactly one coin");

        let info_user2 = mock_info("alice", &coins(200, "token")); // enviamos 200 en lugar de 100
        let err2 = execute(
            deps.as_mut(),
            env.clone(),
            info_user2,
            ExecuteMsg::PlaceOption(option_msg.clone()),
        )
            .unwrap_err();
        assert_eq!(
            err2.to_string(),
            "Generic error: Please, send the correct amount and denom"
        );
    }

    #[test]
    fn test_settle_option_win() {
        let mut deps = mock_dependencies();

        let env = mock_env();
        let info = mock_info("creator", &[]);
        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle"),
            payout_multiplier: 200, // payout = bet_amount * 200/100 = x2
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        let place_msg = PlaceOptionMsg {
            direction: Direction::Up,
            expiration: 1_700_000_000,
            bet_amount: coins(100, "token")[0].clone(),
        };
        let info_user = mock_info("alice", &coins(100, "token"));
        execute(
            deps.as_mut(),
            env.clone(),
            info_user.clone(),
            ExecuteMsg::PlaceOption(place_msg.clone()),
        )
            .unwrap();

        let mut env_expired = mock_env();
        env_expired.block.time = Timestamp::from_seconds(1_700_000_001); // > expiration

        let settle_res = execute(
            deps.as_mut(),
            env_expired.clone(),
            info_user.clone(),
            ExecuteMsg::SettleOption { option_id: 1 },
        )
            .unwrap();

        assert_eq!(settle_res.attributes.len(), 4);
        assert_eq!(settle_res.attributes[0], Attribute::new("action", "settle_option"));
        assert_eq!(settle_res.attributes[1], Attribute::new("option_id", "1"));
        assert_eq!(settle_res.attributes[2], Attribute::new("result", "won"));
        assert_eq!(settle_res.attributes[3], Attribute::new("payout", "200"));

        assert_eq!(settle_res.messages.len(), 1);
        let msg_send = settle_res.messages[0].msg.clone();
        if let cosmwasm_std::CosmosMsg::Bank(BankMsg::Send { to_address, amount }) = msg_send {
            assert_eq!(to_address, "alice");
            assert_eq!(amount[0].denom, "token");
            assert_eq!(amount[0].amount, Uint128::new(200));
        } else {
            panic!("Expected BankMsg::Send");
        }

        let bin_opt = query(
            deps.as_ref(),
            env_expired.clone(),
            QueryMsg::GetOption { option_id: 1 },
        )
            .unwrap();
        let opt_info: OptionInfo = from_json(&bin_opt).unwrap();
        assert!(opt_info.settled);
        assert_eq!(opt_info.outcome, Some(true));
    }

    #[test]
    fn test_settle_option_lost() {
        let mut deps = mock_dependencies();

        // 1) Instanciamos
        let env = mock_env();
        let info = mock_info("creator", &[]);
        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle"),
            payout_multiplier: 200,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        let place_msg = PlaceOptionMsg {
            direction: Direction::Down,
            expiration: 1_700_000_000,
            bet_amount: coins(100, "token")[0].clone(),
        };
        let info_user = mock_info("bob", &coins(100, "token"));
        execute(
            deps.as_mut(),
            env.clone(),
            info_user.clone(),
            ExecuteMsg::PlaceOption(place_msg.clone()),
        )
            .unwrap();

        let mut env_expired = mock_env();
        env_expired.block.time = Timestamp::from_seconds(1_700_000_001); // > expiration

        let settle_res = execute(
            deps.as_mut(),
            env_expired.clone(),
            info_user.clone(),
            ExecuteMsg::SettleOption { option_id: 1 },
        )
            .unwrap();

        assert_eq!(settle_res.attributes.len(), 3);
        assert_eq!(settle_res.attributes[0], Attribute::new("action", "settle_option"));
        assert_eq!(settle_res.attributes[1], Attribute::new("option_id", "1"));
        assert_eq!(settle_res.attributes[2], Attribute::new("result", "lost"));

        assert!(settle_res.messages.is_empty());

        let bin_opt = query(
            deps.as_ref(),
            env_expired.clone(),
            QueryMsg::GetOption { option_id: 1 },
        )
            .unwrap();
        let opt_info: OptionInfo = from_json(&bin_opt).unwrap();
        assert!(opt_info.settled);
        assert_eq!(opt_info.outcome, Some(false));
    }

    #[test]
    fn test_settle_option_not_expired() {
        let mut deps = mock_dependencies();

        let env = mock_env();
        let info = mock_info("creator", &[]);

        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle"),
            payout_multiplier: 200,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        let place_msg = PlaceOptionMsg {
            direction: Direction::Up,
            expiration: 1_700_000_000,
            bet_amount: coins(100, "token")[0].clone(),
        };
        let info_user = mock_info("alice", &coins(100, "token"));
        execute(
            deps.as_mut(),
            env.clone(),
            info_user.clone(),
            ExecuteMsg::PlaceOption(place_msg),
        )
            .unwrap();

        let settle_err = execute(
            deps.as_mut(),
            env.clone(),
            info_user.clone(),
            ExecuteMsg::SettleOption { option_id: 1 },
        )
            .unwrap_err();

        assert_eq!(
            settle_err.to_string(),
            "Generic error: This option has not expired yet"
        );
    }

    #[test]
    fn test_list_options_query() {
        let mut deps = mock_dependencies();

        let env = mock_env();
        let info = mock_info("creator", &[]);

        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle"),
            payout_multiplier: 200,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        let msg1 = PlaceOptionMsg {
            direction: Direction::Up,
            expiration: 12345,
            bet_amount: coins(50, "token")[0].clone(),
        };
        execute(
            deps.as_mut(),
            env.clone(),
            mock_info("alice", &coins(50, "token")),
            ExecuteMsg::PlaceOption(msg1),
        )
            .unwrap();

        let msg2 = PlaceOptionMsg {
            direction: Direction::Down,
            expiration: 99999,
            bet_amount: coins(100, "token")[0].clone(),
        };
        execute(
            deps.as_mut(),
            env.clone(),
            mock_info("bob", &coins(100, "token")),
            ExecuteMsg::PlaceOption(msg2),
        )
            .unwrap();

        let bin_options = query(
            deps.as_ref(),
            env.clone(),
            QueryMsg::ListOptions {
                start_after: None,
                limit: None,
            },
        )
            .unwrap();
        let list: ListOptionsResponse = from_json(&bin_options).unwrap();
        assert_eq!(list.options.len(), 2);
        assert_eq!(list.options[0].id, 1);
        assert_eq!(list.options[0].owner, Addr::unchecked("alice"));
        assert_eq!(list.options[1].id, 2);
        assert_eq!(list.options[1].owner, Addr::unchecked("bob"));
    }
}
