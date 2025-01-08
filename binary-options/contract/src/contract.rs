use crate::msg::{
    Config, Direction, ExecuteMsg, ListOptionsResponse, OptionInfo, PlaceOptionMsg, QueryMsg,
};
use crate::oracle_api::QueryMsg as OracleQueryMsg;
use crate::state::{CONFIG, OPTIONS, OPTION_COUNTER};
use cosmwasm_std::{
    entry_point, to_json_binary, BankMsg, Binary, Coin, Deps, DepsMut, Env, MessageInfo, Order,
    Response, StdError, StdResult,
};
use cw_storage_plus::Bound;

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
pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> StdResult<Response> {
    match msg {
        ExecuteMsg::PlaceOption(msg_place) => execute_place_option(deps, env, info, msg_place),
        ExecuteMsg::SettleOption { option_id } => execute_settle_option(deps, env, info, option_id),
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
        return Err(StdError::generic_err(
            "Please, send the correct amount and denom",
        ));
    }

    let config = CONFIG.load(deps.storage)?;

    let current_price = OracleQueryMsg::get_price(
        &deps.querier,
        &config.oracle_addr,
        &msg.market.base,
        &msg.market.quote,
    )?
    .price
    .ok_or(StdError::generic_err("Price is required"))?;

    let mut option_counter = OPTION_COUNTER.load(deps.storage)?;
    option_counter += 1;
    OPTION_COUNTER.save(deps.storage, &option_counter)?;

    let option_info = OptionInfo {
        id: option_counter,
        owner: info.sender.clone(),
        market: msg.market,
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
        return Err(StdError::generic_err(
            "This option has already been settled",
        ));
    }

    let current_time = env.block.time.seconds();
    if current_time < option.expiration {
        return Err(StdError::generic_err("This option has not expired yet"));
    }

    let config = CONFIG.load(deps.storage)?;

    let current_price = OracleQueryMsg::get_price(
        &deps.querier,
        &config.oracle_addr,
        &option.market.base,
        &option.market.quote,
    )?
    .price
    .ok_or(StdError::generic_err("Price is required"))?;

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
        let payout_amount = option.bet_amount.amount * config.payout_multiplier;
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
        QueryMsg::GetConfig {} => to_json_binary(&query_config(deps)?),
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
    use crate::contract::instantiate;
    use crate::msg::{Config, MarketPair};
    use crate::state::{CONFIG, OPTION_COUNTER};
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{from_binary, from_json, Addr, Decimal};
    use std::str::FromStr;

    #[test]
    fn test_instantiate_works() {
        // Prepare mock dependencies and environment
        let mut deps = mock_dependencies();
        let env = mock_env();

        // We'll simulate the instantiator with address "owner"
        let info = mock_info("owner", &[]);

        // Build the Config that the contract requires
        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle_contract"),
            payout_multiplier: Decimal::percent(150), // e.g. 1.5x payout
        };

        // Call instantiate
        let res = instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg.clone())
            .expect("instantiation should succeed");

        // Make sure the Response attributes match what we expect
        assert_eq!(res.attributes.len(), 4);
        assert_eq!(res.attributes[0].key, "method");
        assert_eq!(res.attributes[0].value, "instantiate");
        assert_eq!(res.attributes[1].key, "owner");
        assert_eq!(res.attributes[1].value, "owner");
        assert_eq!(res.attributes[2].key, "oracle_addr");
        assert_eq!(res.attributes[2].value, "oracle_contract");
        assert_eq!(res.attributes[3].key, "payout_multiplier");
        // The decimal->string conversion might differ depending on input;
        // adjust as needed (e.g. "1.5" or "150%" etc.)
        assert_eq!(res.attributes[3].value, "1.5");

        // Now let's verify the data was stored properly

        // 1. CONFIG must match what was passed in.
        let stored_config = CONFIG.load(&deps.storage).unwrap();
        assert_eq!(stored_config.oracle_addr, config_msg.oracle_addr);
        assert_eq!(
            stored_config.payout_multiplier,
            config_msg.payout_multiplier
        );

        // 2. OPTION_COUNTER should be 0 on fresh instantiation
        let stored_counter = OPTION_COUNTER.load(&deps.storage).unwrap();
        assert_eq!(stored_counter, 0u64);
    }

    #[test]
    fn test_query_get_option_success() {
        // ------------------------------------------
        // 1) Set up
        // ------------------------------------------
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("owner", &[]);

        // Instantiate the contract with some config
        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle_contract"),
            payout_multiplier: Decimal::percent(150), // e.g., 1.50
        };
        let _res = instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        // Verify the config & option_counter were stored
        let stored_config = CONFIG.load(&deps.storage).unwrap();
        assert_eq!(
            stored_config.oracle_addr,
            Addr::unchecked("oracle_contract")
        );
        assert_eq!(stored_config.payout_multiplier, Decimal::percent(150));

        let counter = OPTION_COUNTER.load(&deps.storage).unwrap();
        assert_eq!(counter, 0);

        // ------------------------------------------
        // 2) Manually insert an OptionInfo into the store
        //    (Simulate an option that was placed earlier)
        // ------------------------------------------
        let option_id = 42u64;
        let option_info = OptionInfo {
            id: option_id,
            owner: Addr::unchecked("player123"),
            market: MarketPair {
                base: "BTC".to_string(),
                quote: "USD".to_string(),
            },
            direction: Direction::Up,
            strike_price: Decimal::from_str("30000").unwrap(),
            expiration: 1_700_000_000, // some future timestamp
            bet_amount: Coin {
                denom: "uatom".to_string(),
                amount: 1_000_000u128.into(),
            },
            settled: false,
            outcome: None,
        };
        OPTIONS
            .save(&mut deps.storage, option_id, &option_info)
            .unwrap();

        // ------------------------------------------
        // 3) Query the contract for that OptionInfo
        // ------------------------------------------
        let query_msg = QueryMsg::GetOption { option_id };
        let bin = query(deps.as_ref(), env.clone(), query_msg).unwrap();
        let queried_option: OptionInfo = from_json(&bin).unwrap();

        // ------------------------------------------
        // 4) Verify results
        // ------------------------------------------
        assert_eq!(queried_option.id, option_id);
        assert_eq!(queried_option.owner, Addr::unchecked("player123"));
        assert_eq!(queried_option.market.base, "BTC");
        assert_eq!(queried_option.market.quote, "USD");
        assert_eq!(queried_option.direction, Direction::Up);
        assert_eq!(
            queried_option.strike_price,
            Decimal::from_str("30000").unwrap()
        );
        assert_eq!(queried_option.expiration, 1_700_000_000);
        assert_eq!(queried_option.bet_amount.denom, "uatom");
        assert_eq!(queried_option.bet_amount.amount.u128(), 1_000_000u128);
        assert!(!queried_option.settled);
        assert_eq!(queried_option.outcome, None);
    }

    #[test]
    fn test_query_get_option_not_found() {
        // ------------------------------------------
        // 1) Set up
        // ------------------------------------------
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("owner", &[]);

        // Instantiate the contract
        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle_contract"),
            payout_multiplier: Decimal::one(),
        };
        let _res = instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        // ------------------------------------------
        // 2) Attempt to query an option_id that doesn't exist
        // ------------------------------------------
        let non_existent_id = 9999u64;
        let query_msg = QueryMsg::GetOption {
            option_id: non_existent_id,
        };

        // The `OPTIONS.load(...)` call in `query_option` will fail with an error if not found
        let err = query(deps.as_ref(), env, query_msg).unwrap_err();

        // ------------------------------------------
        // 3) Verify we got the expected error
        // ------------------------------------------
        match err {
            StdError::NotFound { .. } => {
                // This is the expected error when the key does not exist in the map
            }
            e => panic!("Unexpected error: {e}"),
        }
    }
}
