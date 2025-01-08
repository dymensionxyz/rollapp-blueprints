use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Coin, Decimal};

#[cw_serde]
pub struct MarketPair {
    pub base: String,
    pub quote: String,
}

#[cw_serde]
pub enum Direction {
    Up,
    Down,
}

#[cw_serde]
pub struct PlaceOptionMsg {
    pub direction: Direction,
    pub expiration: u64,
    pub bet_amount: Coin,
    pub market: MarketPair,
}

#[cw_serde]
pub enum ExecuteMsg {
    PlaceOption(PlaceOptionMsg),
    SettleOption { option_id: u64 },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(OptionInfo)]
    GetOption { option_id: u64 },
    #[returns(ListOptionsResponse)]
    ListOptions {
        start_after: Option<u64>,
        limit: Option<u64>,
    },
    #[returns(Config)]
    GetConfig {},
}

#[cw_serde]
pub struct OptionInfo {
    pub id: u64,
    pub owner: Addr,
    pub market: MarketPair,
    pub direction: Direction,
    pub strike_price: Decimal,
    pub expiration: u64,
    pub bet_amount: Coin,
    pub settled: bool,
    pub outcome: Option<bool>, // true = ganó, false = perdió
}

#[cw_serde]
pub struct ListOptionsResponse {
    pub options: Vec<OptionInfo>,
}

#[cw_serde]
pub struct Config {
    pub oracle_addr: Addr,
    pub payout_multiplier: Decimal,
}

