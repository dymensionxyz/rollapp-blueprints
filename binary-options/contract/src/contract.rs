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
    env: Env,
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

    let expiration = env.block.time.seconds() + config.expiration_period;

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
        expiration,
        bet_amount: msg.bet_amount.clone(),
        settled: false,
        outcome: None,
    };

    OPTIONS.save(deps.storage, option_counter, &option_info)?;

    Ok(Response::new()
        .add_attribute("action", "place_option")
        .add_attribute("option_id", option_counter.to_string())
        .add_attribute("strike_price", current_price.to_string())
        .add_attribute("expiration", expiration.to_string()))
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
    limit: Option<u64>,
) -> StdResult<ListOptionsResponse> {
    let limit = limit.unwrap_or(30) as usize;
    let start = start_after.map(Bound::exclusive);

    let options: Vec<OptionInfo> = OPTIONS
        .range(deps.storage, start, None, Order::Descending)
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
    use crate::oracle_api::QueryGetPriceResponse;
    use crate::state::{CONFIG, OPTION_COUNTER};
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{
        attr, coin, coins, from_binary, from_json, to_binary, Addr, ContractResult, Decimal,
        SystemError, SystemResult, WasmQuery,
    };
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
            expiration_period: 300, // 5 minutes
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
            expiration_period: 300, // 5 minutes
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
            expiration_period: 300,
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

    #[test]
    fn test_query_get_config() {
        // 1) Set up mock dependencies, environment, and info
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("owner", &[]);

        // 2) Instantiate the contract with a known config
        let init_config = Config {
            oracle_addr: Addr::unchecked("oracle_contract"),
            payout_multiplier: Decimal::percent(200), // e.g. 2.00 (200% or x2 payout)
            expiration_period: 300,
        };
        let _res = instantiate(deps.as_mut(), env.clone(), info, init_config.clone())
            .expect("instantiation should work");

        // 3) Verify the config was actually stored (optional but good practice)
        let stored_config = CONFIG.load(&deps.storage).unwrap();
        assert_eq!(
            stored_config.oracle_addr,
            Addr::unchecked("oracle_contract")
        );
        assert_eq!(stored_config.payout_multiplier, Decimal::percent(200));

        // 4) Query for the config
        let query_msg = QueryMsg::GetConfig {};
        let bin = query(deps.as_ref(), env, query_msg).unwrap();

        // 5) Decode the response into a Config struct
        let queried_config: Config = from_binary(&bin).unwrap();

        // 6) Verify the queried config matches what we stored
        assert_eq!(
            queried_config.oracle_addr,
            Addr::unchecked("oracle_contract")
        );
        assert_eq!(queried_config.payout_multiplier, Decimal::percent(200));
    }

    #[test]
    fn test_query_list_options() {
        // ---------------------------------------------------
        // 1) Set up mock environment
        // ---------------------------------------------------
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("owner", &[]);

        // Instantiate the contract with some config
        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle_contract"),
            payout_multiplier: Decimal::one(),
            expiration_period: 300,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        // Confirm config & option_counter
        let stored_config = CONFIG.load(&deps.storage).unwrap();
        assert_eq!(
            stored_config.oracle_addr,
            Addr::unchecked("oracle_contract")
        );
        assert_eq!(stored_config.payout_multiplier, Decimal::one());
        let initial_counter = OPTION_COUNTER.load(&deps.storage).unwrap();
        assert_eq!(initial_counter, 0);

        // ---------------------------------------------------
        // 2) Manually insert several OptionInfo entries
        // ---------------------------------------------------
        // We'll store 3 options with IDs: 1, 2, 3
        let option_infos = vec![
            OptionInfo {
                id: 1,
                owner: Addr::unchecked("playerA"),
                market: MarketPair {
                    base: "BTC".to_string(),
                    quote: "USD".to_string(),
                },
                direction: Direction::Up,
                strike_price: Decimal::from_str("30000").unwrap(),
                expiration: 1_700_000_000,
                bet_amount: Coin {
                    denom: "uatom".to_string(),
                    amount: 1_000_000u128.into(),
                },
                settled: false,
                outcome: None,
            },
            OptionInfo {
                id: 2,
                owner: Addr::unchecked("playerB"),
                market: MarketPair {
                    base: "ETH".to_string(),
                    quote: "USD".to_string(),
                },
                direction: Direction::Down,
                strike_price: Decimal::from_str("2000").unwrap(),
                expiration: 1_700_000_001,
                bet_amount: Coin {
                    denom: "uluna".to_string(),
                    amount: 500_000u128.into(),
                },
                settled: false,
                outcome: None,
            },
            OptionInfo {
                id: 3,
                owner: Addr::unchecked("playerC"),
                market: MarketPair {
                    base: "ATOM".to_string(),
                    quote: "USD".to_string(),
                },
                direction: Direction::Up,
                strike_price: Decimal::from_str("10").unwrap(),
                expiration: 1_700_000_002,
                bet_amount: Coin {
                    denom: "uatom".to_string(),
                    amount: 2_000_000u128.into(),
                },
                settled: false,
                outcome: None,
            },
        ];

        for opt in &option_infos {
            OPTIONS.save(&mut deps.storage, opt.id, opt).unwrap();
        }

        // ---------------------------------------------------
        // 3a) Query: ListOptions with no pagination
        // ---------------------------------------------------
        let list_msg = QueryMsg::ListOptions {
            start_after: None,
            limit: None, // defaults to 10
        };
        let bin = query(deps.as_ref(), env.clone(), list_msg).unwrap();
        let res: ListOptionsResponse = from_binary(&bin).unwrap();

        assert_eq!(res.options.len(), 3);
        // Options should come in ascending order by ID
        assert_eq!(res.options[0].id, 1);
        assert_eq!(res.options[1].id, 2);
        assert_eq!(res.options[2].id, 3);

        // ---------------------------------------------------
        // 3b) Query: limit = 2 (we should only get 2 results)
        // ---------------------------------------------------
        let list_msg = QueryMsg::ListOptions {
            start_after: None,
            limit: Some(2),
        };
        let bin = query(deps.as_ref(), env.clone(), list_msg).unwrap();
        let res: ListOptionsResponse = from_binary(&bin).unwrap();

        println!("{:?}", res.options);
        assert_eq!(res.options.len(), 2);
        assert_eq!(res.options[0].id, 1);
        assert_eq!(res.options[1].id, 2);

        // ---------------------------------------------------
        // 3c) Query: start_after = 1, no limit
        //    This means we skip ID 1 and get options 2 & 3
        // ---------------------------------------------------
        let list_msg = QueryMsg::ListOptions {
            start_after: Some(1),
            limit: None,
        };
        let bin = query(deps.as_ref(), env.clone(), list_msg).unwrap();
        let res: ListOptionsResponse = from_binary(&bin).unwrap();

        assert_eq!(res.options.len(), 2);
        assert_eq!(res.options[0].id, 2);
        assert_eq!(res.options[1].id, 3);

        // ---------------------------------------------------
        // 3d) Query: start_after = 2, limit = Some(1)
        //    This means skip ID 1,2 => first available is ID 3 => single result
        // ---------------------------------------------------
        let list_msg = QueryMsg::ListOptions {
            start_after: Some(2),
            limit: Some(1),
        };
        let bin = query(deps.as_ref(), env, list_msg).unwrap();
        let res: ListOptionsResponse = from_binary(&bin).unwrap();

        assert_eq!(res.options.len(), 1);
        assert_eq!(res.options[0].id, 3);
    }

    #[test]
    fn test_place_option_success() {
        // -------------------------------------------------------
        // 1) Set up environment
        // -------------------------------------------------------
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("trader1", &coins(1_000_000, "uatom")); // user sends 1 ATOM

        // -------------------------------------------------------
        // 2) Instantiate the contract with known config
        // -------------------------------------------------------
        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle_contract"),
            payout_multiplier: Decimal::from_str("1.5").unwrap(), // 1.50
            expiration_period: 300,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg.clone())
            .expect("instantiate should work");

        // Confirm config storage
        let stored_config = CONFIG.load(&deps.storage).unwrap();
        assert_eq!(
            stored_config.oracle_addr,
            Addr::unchecked("oracle_contract")
        );
        assert_eq!(
            stored_config.payout_multiplier,
            Decimal::from_str("1.5").unwrap()
        );

        // Initially, no options placed
        let counter = OPTION_COUNTER.load(&deps.storage).unwrap();
        assert_eq!(counter, 0);

        // -------------------------------------------------------
        // 3) Mock the oracle query => "GetPrice"
        // -------------------------------------------------------
        deps.querier.update_wasm(|query| match query {
            WasmQuery::Smart { contract_addr, msg } => {
                // Check that it's hitting our known oracle contract
                if contract_addr == "oracle_contract" {
                    // Decode the inbound query
                    let parsed: std::result::Result<OracleQueryMsg, _> = from_binary(msg);
                    if let Ok(OracleQueryMsg::GetPrice { base, quote }) = parsed {
                        // e.g. if the base="BTC" and quote="USD", we return some mocked price
                        // but let's do something dynamic just to show we recognized the query
                        if base == "BTC" && quote == "USD" {
                            let resp = QueryGetPriceResponse {
                                price: Some(Decimal::from_str("30000").unwrap()),
                            };
                            return SystemResult::Ok(ContractResult::Ok(to_binary(&resp).unwrap()));
                        } else if base == "ATOM" && quote == "USD" {
                            let resp = QueryGetPriceResponse {
                                price: Some(Decimal::from_str("10").unwrap()),
                            };
                            return SystemResult::Ok(ContractResult::Ok(to_binary(&resp).unwrap()));
                        }
                    }
                }
                // Fallback: not our oracle or unexpected query
                SystemResult::Err(SystemError::UnsupportedRequest {
                    kind: format!("{query:?}"),
                })
            }
            _ => SystemResult::Err(SystemError::UnsupportedRequest {
                kind: format!("{query:?}"),
            }),
        });

        // -------------------------------------------------------
        // 4) Build the message: "PlaceOption"
        // -------------------------------------------------------
        let place_msg = ExecuteMsg::PlaceOption(PlaceOptionMsg {
            direction: Direction::Up,             // e.g. call option
            bet_amount: coin(1_000_000, "uatom"), // must match info.funds
            market: MarketPair {
                base: "BTC".to_string(),
                quote: "USD".to_string(),
            },
        });

        // -------------------------------------------------------
        // 5) Execute the message
        // -------------------------------------------------------
        let res = execute(deps.as_mut(), env.clone(), info.clone(), place_msg).unwrap();

        // -------------------------------------------------------
        // 6) Check the response
        // -------------------------------------------------------
        // The response should have attributes for "place_option"
        // and the updated option_id & strike_price
        assert_eq!(res.attributes.len(), 4);
        assert_eq!(res.attributes[0].value, "place_option");
        // e.g. the newly assigned option ID should be "1" if it was previously 0
        let option_id = &res.attributes[1].value;
        assert_eq!(option_id, "1");
        // The strike_price from the oracle was "30000"
        let strike_price = &res.attributes[2].value;
        assert_eq!(strike_price, "30000");

        // Also check if the expiration was recorded in attributes
        let expiration_attr = &res.attributes[3].value;
        assert_eq!(expiration_attr, "1700000000");

        // -------------------------------------------------------
        // 7) Confirm that the new OptionInfo is stored
        // -------------------------------------------------------
        let new_counter = OPTION_COUNTER.load(&deps.storage).unwrap();
        assert_eq!(new_counter, 1); // incremented by 1
        let saved_option = OPTIONS.load(&deps.storage, 1).unwrap();

        assert_eq!(saved_option.id, 1);
        assert_eq!(saved_option.owner, Addr::unchecked("trader1"));
        assert_eq!(saved_option.direction, Direction::Up);
        assert_eq!(
            saved_option.strike_price,
            Decimal::from_str("30000").unwrap()
        );
        assert_eq!(saved_option.expiration, 1_700_000_000);
        assert!(!saved_option.settled);
        assert_eq!(saved_option.outcome, None);
        // Also check that the bet_amount matches
        assert_eq!(saved_option.bet_amount.denom, "uatom");
        assert_eq!(saved_option.bet_amount.amount.u128(), 1_000_000);
    }

    #[test]
    fn test_place_option_fail_multiple_coins() {
        // Trying to place an option with 2 different coins should fail
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("trader1", &vec![coin(1000, "uatom"), coin(500, "uluna")]);

        // Instantiate
        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle_contract"),
            payout_multiplier: Decimal::one(),
            expiration_period: 300,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        // Build ExecuteMsg
        let place_msg = ExecuteMsg::PlaceOption(PlaceOptionMsg {
            direction: Direction::Down,
            bet_amount: coin(1000, "uatom"),
            market: MarketPair {
                base: "BTC".to_string(),
                quote: "USD".to_string(),
            },
        });

        // Execute
        let err = execute(deps.as_mut(), env, info, place_msg).unwrap_err();
        match err {
            StdError::GenericErr { msg, .. } => {
                assert_eq!(msg, "Please, send exactly one coin")
            }
            e => panic!("unexpected error: {e}"),
        }
    }

    #[test]
    fn test_place_option_fail_wrong_amount() {
        // The user sends 500 but the bet_amount is 1000 => mismatch => should fail
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("trader2", &coins(500, "uatom")); // mismatch

        // Instantiate
        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle_contract"),
            payout_multiplier: Decimal::one(),
            expiration_period: 300,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        // Mock the oracle so we don't get an error from the price
        deps.querier.update_wasm(|query| match query {
            WasmQuery::Smart { .. } => {
                let resp = QueryGetPriceResponse {
                    price: Some(Decimal::one()),
                };
                SystemResult::Ok(ContractResult::Ok(to_binary(&resp).unwrap()))
            }
            _ => SystemResult::Err(SystemError::UnsupportedRequest {
                kind: format!("{query:?}"),
            }),
        });

        // Build ExecuteMsg
        let place_msg = ExecuteMsg::PlaceOption(PlaceOptionMsg {
            direction: Direction::Down,
            bet_amount: coin(1000, "uatom"), // we expected 1000
            market: MarketPair {
                base: "BTC".to_string(),
                quote: "USD".to_string(),
            },
        });

        // Execute
        let err = execute(deps.as_mut(), env, info, place_msg).unwrap_err();
        match err {
            StdError::GenericErr { msg, .. } => {
                assert_eq!(msg, "Please, send the correct amount and denom")
            }
            e => panic!("unexpected error: {e}"),
        }
    }

    #[test]
    fn test_place_option_fail_wrong_denom() {
        // The user sends uatom but the bet_amount is uluna => mismatch => should fail
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("trader2", &coins(1000, "uatom"));

        // Instantiate
        let config_msg = Config {
            oracle_addr: Addr::unchecked("oracle_contract"),
            payout_multiplier: Decimal::one(),
            expiration_period: 300,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config_msg).unwrap();

        // Mock the oracle
        deps.querier.update_wasm(|query| match query {
            WasmQuery::Smart { .. } => {
                let resp = QueryGetPriceResponse {
                    price: Some(Decimal::one()),
                };
                SystemResult::Ok(ContractResult::Ok(to_binary(&resp).unwrap()))
            }
            _ => SystemResult::Err(SystemError::UnsupportedRequest {
                kind: format!("{query:?}"),
            }),
        });

        // Build ExecuteMsg with mismatch denom
        let place_msg = ExecuteMsg::PlaceOption(PlaceOptionMsg {
            direction: Direction::Up,
            bet_amount: coin(1000, "uluna"),
            market: MarketPair {
                base: "BTC".to_string(),
                quote: "USD".to_string(),
            },
        });

        // Execute
        let err = execute(deps.as_mut(), env, info, place_msg).unwrap_err();
        match err {
            StdError::GenericErr { msg, .. } => {
                assert_eq!(msg, "Please, send the correct amount and denom")
            }
            e => panic!("unexpected error: {e}"),
        }
    }

    #[test]
    fn test_settle_option_not_expired() {
        // -------------------------------------------------------------------
        // 1) Setup
        // -------------------------------------------------------------------
        let mut deps = mock_dependencies();
        let mut env = mock_env();
        let info = mock_info("owner", &[]);

        // Instantiate
        let config = Config {
            oracle_addr: Addr::unchecked("oracle_contract"),
            payout_multiplier: Decimal::one(),
            expiration_period: 300,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config).unwrap();

        // Insert one option that expires in the future (not expired)
        let option_id = 1u64;
        let future_expiration = env.block.time.seconds() + 1000; // not expired
        let option_info = OptionInfo {
            id: option_id,
            owner: Addr::unchecked("trader"),
            market: MarketPair {
                base: "BTC".into(),
                quote: "USD".into(),
            },
            direction: Direction::Up,
            strike_price: Decimal::from_str("30000").unwrap(),
            expiration: future_expiration,
            bet_amount: coin(1_000_000, "uatom"),
            settled: false,
            outcome: None,
        };
        OPTIONS
            .save(&mut deps.storage, option_id, &option_info)
            .unwrap();
        OPTION_COUNTER.save(&mut deps.storage, &option_id).unwrap();

        // -------------------------------------------------------------------
        // 2) Attempt to settle the option => Should fail (not expired yet)
        // -------------------------------------------------------------------
        let settle_msg = ExecuteMsg::SettleOption { option_id };
        let err = execute(deps.as_mut(), env.clone(), info.clone(), settle_msg).unwrap_err();

        match err {
            StdError::GenericErr { msg, .. } => {
                assert_eq!(msg, "This option has not expired yet");
            }
            _ => panic!("unexpected error"),
        }
    }

    #[test]
    fn test_settle_option_already_settled() {
        // -------------------------------------------------------------------
        // 1) Setup
        // -------------------------------------------------------------------
        let mut deps = mock_dependencies();
        let mut env = mock_env();
        let info = mock_info("owner", &[]);

        // Instantiate
        let config = Config {
            oracle_addr: Addr::unchecked("oracle_contract"),
            payout_multiplier: Decimal::one(),
            expiration_period: 300,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config).unwrap();

        // Insert an option that is *already settled*
        let option_id = 2u64;
        let past_expiration = env.block.time.seconds() - 1000; // definitely expired
        let option_info = OptionInfo {
            id: option_id,
            owner: Addr::unchecked("trader"),
            market: MarketPair {
                base: "BTC".into(),
                quote: "USD".into(),
            },
            direction: Direction::Up,
            strike_price: Decimal::from_str("30000").unwrap(),
            expiration: past_expiration,
            bet_amount: coin(1_000_000, "uatom"),
            settled: true, // already settled
            outcome: Some(true),
        };
        OPTIONS
            .save(&mut deps.storage, option_id, &option_info)
            .unwrap();
        OPTION_COUNTER.save(&mut deps.storage, &option_id).unwrap();

        // -------------------------------------------------------------------
        // 2) Attempt to settle again => Should fail (already settled)
        // -------------------------------------------------------------------
        let settle_msg = ExecuteMsg::SettleOption { option_id };
        let err = execute(deps.as_mut(), env.clone(), info.clone(), settle_msg).unwrap_err();

        match err {
            StdError::GenericErr { msg, .. } => {
                assert_eq!(msg, "This option has already been settled");
            }
            _ => panic!("unexpected error"),
        }
    }

    #[test]
    fn test_settle_option_win_scenario() {
        // -------------------------------------------------------------------
        // 1) Setup + store an option that is expired
        // -------------------------------------------------------------------
        let mut deps = mock_dependencies();
        let mut env = mock_env();
        let info = mock_info("owner", &[]);

        // Instantiate
        let config = Config {
            oracle_addr: Addr::unchecked("oracle_contract"),
            payout_multiplier: Decimal::from_str("1.5").unwrap(), // e.g. 1.50
            expiration_period: 300,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config).unwrap();

        // Create an option that expired in the past, so it's eligible for settlement
        let option_id = 10u64;
        let past_expiration = env.block.time.seconds() - 1; // 1 second in the past => expired
        let option_info = OptionInfo {
            id: option_id,
            owner: Addr::unchecked("winner"),
            market: MarketPair {
                base: "BTC".into(),
                quote: "USD".into(),
            },
            direction: Direction::Up, // user wins if final price > strike_price
            strike_price: Decimal::from_str("30000").unwrap(),
            expiration: past_expiration,
            bet_amount: coin(1_000_000, "uatom"),
            settled: false,
            outcome: None,
        };
        OPTIONS
            .save(&mut deps.storage, option_id, &option_info)
            .unwrap();
        OPTION_COUNTER.save(&mut deps.storage, &option_id).unwrap();

        // -------------------------------------------------------------------
        // 2) Mock the oracle => final price is 31,000 => user should win
        // -------------------------------------------------------------------
        deps.querier.update_wasm(|query| match query {
            WasmQuery::Smart { contract_addr, msg } => {
                if contract_addr == "oracle_contract" {
                    if let Ok(OracleQueryMsg::GetPrice { base, quote }) = from_binary(msg) {
                        if base == "BTC" && quote == "USD" {
                            let resp = QueryGetPriceResponse {
                                price: Some(Decimal::from_str("31000").unwrap()),
                            };
                            return SystemResult::Ok(ContractResult::Ok(to_binary(&resp).unwrap()));
                        }
                    }
                }
                SystemResult::Err(SystemError::UnsupportedRequest {
                    kind: format!("{query:?}"),
                })
            }
            _ => SystemResult::Err(SystemError::UnsupportedRequest {
                kind: format!("{query:?}"),
            }),
        });

        // -------------------------------------------------------------------
        // 3) Execute "SettleOption"
        // -------------------------------------------------------------------
        let settle_msg = ExecuteMsg::SettleOption { option_id };
        let res = execute(deps.as_mut(), env.clone(), info.clone(), settle_msg).unwrap();

        // -------------------------------------------------------------------
        // 4) Check the Response
        // -------------------------------------------------------------------
        // Expect a BankMsg::Send -> user "winner" with payout = bet * payout_multiplier
        // Bet = 1_000_000, multiplier = 1.5 => payout = 1_500_000
        let expected_payout = 1_500_000u128;
        assert_eq!(
            res.messages[0].msg,
            cosmwasm_std::CosmosMsg::Bank(BankMsg::Send {
                to_address: "winner".to_string(),
                amount: vec![coin(expected_payout, "uatom")],
            })
        );

        // Check attributes
        // "action" => "settle_option"
        // "option_id" => 10
        // "result" => "won"
        // "payout" => "1500000"
        assert_eq!(res.attributes.len(), 4);
        assert_eq!(res.attributes[0], attr("action", "settle_option"));
        assert_eq!(res.attributes[1], attr("option_id", "10"));
        assert_eq!(res.attributes[2], attr("result", "won"));
        assert_eq!(res.attributes[3], attr("payout", "1500000"));

        // -------------------------------------------------------------------
        // 5) Confirm storage was updated => outcome & settled
        // -------------------------------------------------------------------
        let updated_option = OPTIONS.load(&deps.storage, option_id).unwrap();
        assert!(updated_option.settled);
        assert_eq!(updated_option.outcome, Some(true)); // user won
    }

    #[test]
    fn test_settle_option_lost_scenario() {
        // -------------------------------------------------------------------
        // 1) Setup + store an option
        // -------------------------------------------------------------------
        let mut deps = mock_dependencies();
        let mut env = mock_env();
        let info = mock_info("owner", &[]);

        // Instantiate
        let config = Config {
            oracle_addr: Addr::unchecked("oracle_contract"),
            payout_multiplier: Decimal::from_str("2").unwrap(), // x2, irrelevant if lost
            expiration_period: 300,
        };
        instantiate(deps.as_mut(), env.clone(), info.clone(), config).unwrap();

        // Create an option that expired in the past => eligible for settlement
        let option_id = 100u64;
        let past_expiration = env.block.time.seconds() - 50;
        let option_info = OptionInfo {
            id: option_id,
            owner: Addr::unchecked("loser"),
            market: MarketPair {
                base: "ETH".into(),
                quote: "USD".into(),
            },
            direction: Direction::Up, // user wins if final price > strike_price
            strike_price: Decimal::from_str("2000").unwrap(),
            expiration: past_expiration,
            bet_amount: coin(2000, "uluna"),
            settled: false,
            outcome: None,
        };
        OPTIONS
            .save(&mut deps.storage, option_id, &option_info)
            .unwrap();
        OPTION_COUNTER.save(&mut deps.storage, &option_id).unwrap();

        // -------------------------------------------------------------------
        // 2) Mock the oracle => final price is 1500 => user should lose
        // -------------------------------------------------------------------
        deps.querier.update_wasm(|query| match query {
            WasmQuery::Smart { contract_addr, msg } => {
                if contract_addr == "oracle_contract" {
                    if let Ok(OracleQueryMsg::GetPrice { base, quote }) = from_binary(msg) {
                        if base == "ETH" && quote == "USD" {
                            let resp = QueryGetPriceResponse {
                                price: Some(Decimal::from_str("1500").unwrap()),
                            };
                            return SystemResult::Ok(ContractResult::Ok(to_binary(&resp).unwrap()));
                        }
                    }
                }
                SystemResult::Err(SystemError::UnsupportedRequest {
                    kind: format!("{query:?}"),
                })
            }
            _ => SystemResult::Err(SystemError::UnsupportedRequest {
                kind: format!("{query:?}"),
            }),
        });

        // -------------------------------------------------------------------
        // 3) Execute "SettleOption"
        // -------------------------------------------------------------------
        let settle_msg = ExecuteMsg::SettleOption { option_id };
        let res = execute(deps.as_mut(), env.clone(), info.clone(), settle_msg).unwrap();

        // -------------------------------------------------------------------
        // 4) Check the Response
        // -------------------------------------------------------------------
        // The user should lose, so no BankMsg::Send is expected
        assert_eq!(res.messages.len(), 0);

        // Check attributes
        // "action" => "settle_option"
        // "option_id" => "100"
        // "result" => "lost"
        assert_eq!(res.attributes.len(), 3);
        assert_eq!(res.attributes[0], attr("action", "settle_option"));
        assert_eq!(res.attributes[1], attr("option_id", "100"));
        assert_eq!(res.attributes[2], attr("result", "lost"));

        // -------------------------------------------------------------------
        // 5) Confirm storage was updated => outcome & settled
        // -------------------------------------------------------------------
        let updated_option = OPTIONS.load(&deps.storage, option_id).unwrap();
        assert!(updated_option.settled);
        assert_eq!(updated_option.outcome, Some(false)); // user lost
    }
}
