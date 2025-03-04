use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Decimal, QuerierWrapper, StdResult};

#[cw_serde]
pub struct InstantiateMsg {
    pub config: Config,
}
#[cw_serde]
pub enum ExecuteMsg {
    UpdatePrices { prices: Vec<PriceUpdate> },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    /// Returns the full pair info, alongside its price and associated expiry.
    #[returns(QueryGetPairResponse)]
    GetPair { base: String, quote: String },
    /// Purely returns the price, failing if the price has expired.
    #[returns(QueryGetPriceResponse)]
    GetPrice { base: String, quote: String },
    /// GetClosestPrice returns the closest price with respect to the provided
    /// timestamp and duration window. This is used for historical price, since we are not
    /// guaranteed to have a price at the exact time it was requested we find the closest
    /// to it within the provided time_window_seconds bounds.
    /// Use with care since it is iterating and very large durations might query
    /// very old state.
    /// Assume updates from the oracle happen every X seconds, then the number of iteration
    /// objects is: 2 * time_window_seconds  / X.
    #[returns(QueryGetClosestPriceResponse)]
    GetClosestPrice {
        base: String,
        quote: String,
        time_unix_ms: u64,
        time_window_seconds: u64,
    },
    /// This is used to return the config.
    #[returns(Config)]
    Config {},
}

impl QueryMsg {
    pub fn get_price(
        querier: &QuerierWrapper,
        oracle: impl Into<String>,
        base: impl Into<String>,
        quote: impl Into<String>,
    ) -> StdResult<QueryGetPriceResponse> {
        querier.query_wasm_smart(
            oracle,
            &QueryMsg::GetPrice {
                base: base.into(),
                quote: quote.into(),
            },
        )
    }

    pub fn get_closest_price(
        querier: &QuerierWrapper,
        oracle: impl Into<String>,
        base: impl Into<String>,
        quote: impl Into<String>,
        time_unix_ms: u64,
        time_window_seconds: u64,
    ) -> StdResult<QueryGetClosestPriceResponse> {
        querier.query_wasm_smart(
            oracle,
            &QueryMsg::GetClosestPrice {
                base: base.into(),
                quote: quote.into(),
                time_unix_ms,
                time_window_seconds,
            },
        )
    }

    pub fn get_config(querier: &QuerierWrapper, oracle: impl Into<String>) -> StdResult<Config> {
        querier.query_wasm_smart(oracle, &QueryMsg::Config {})
    }
}

/// Defines the historical price
#[cw_serde]
pub struct HistoricalPrice {
    pub price: Decimal,
    pub time_unix_ms: u64,
}

#[cw_serde]
pub struct QueryGetClosestPriceResponse {
    /// If [`None`] no price was found for the given query.
    pub price: Option<HistoricalPrice>,
}

#[cw_serde]
pub struct QueryGetPairResponse {
    /// [`None`] means no pair data, might be the pair does not exist or was never updated.
    pub pair_data: Option<PairData>,
}

#[cw_serde]
pub struct PairData {
    /// Returns if the pair is inverse, which means it is virtual and derived from the inverse
    /// of base and quote (eg: BTC-USD -> USD-BTC).
    pub is_inverse: bool,
    /// Defines expiry and the price.
    /// If [`None`] it means the pair exists but the oracle did not provide a price for it yet.
    pub price_and_expiry: Option<LatestPrice>,
}

#[cw_serde]
pub struct PriceUpdate {
    pub base: String,
    pub quote: String,
    pub price: Decimal,
}
#[cw_serde]
pub struct LatestPrice {
    /// The price of the pair.
    pub price: Decimal,
    /// When the price expires.
    pub expiry_unix_ms: u64,
}
#[cw_serde]
pub struct Config {
    pub updater: Addr,
    pub price_expiry_seconds: u64,
    pub price_threshold_ratio: Decimal,
}

#[cw_serde]
pub struct QueryGetPriceResponse {
    /// If [`None`] no price exists.
    pub price: Option<Decimal>,
}
