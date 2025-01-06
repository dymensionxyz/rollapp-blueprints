use cw_storage_plus::{Item, Map};
use crate::msg::{Config, OptionInfo};

pub const CONFIG: Item<Config> = Item::new("config");
pub const OPTIONS: Map<u64, OptionInfo> = Map::new("options");
pub const OPTION_COUNTER: Item<u64> = Item::new("option_counter");

