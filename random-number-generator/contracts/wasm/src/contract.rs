use cosmwasm_std::{
    entry_point, to_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
    Storage, Uint64, 
};
use cw_storage_plus::{Item, Map};
use serde::{Deserialize, Serialize};

// --------------------------------------
// Data Structures
// --------------------------------------

/// An "Event" similar to the Solidity version.
#[derive(Serialize, Deserialize, Clone, PartialEq, Debug)]
pub struct Event {
    pub event_id: u64,
    pub event_type: u16,
    pub data: Binary,
}

/// Holds contract-wide configuration.
#[derive(Serialize, Deserialize, Clone, PartialEq, Debug)]
pub struct Config {
    pub event_buffer_size: u64,
    pub writer: Addr,
    pub next_randomness_id: u64,
}

/// InstantiateMsg: used when the contract is first deployed.
#[derive(Serialize, Deserialize, Clone, PartialEq, Debug)]
pub struct InstantiateMsg {
    /// Maximum number of events that can be stored per event type
    pub event_buffer_size: u64,
    /// The address allowed to post randomness
    pub writer: String,
}

/// ExecuteMsg: represents all possible execute functions.
#[derive(Serialize, Deserialize, Clone, PartialEq, Debug)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    /// Request randomness
    RequestRandomness {},

    /// Post or fulfill randomness
    PostRandomness { id: u64, randomness: u64 },
}

/// QueryMsg: represents all possible query functions.
#[derive(Serialize, Deserialize, Clone, PartialEq, Debug)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    /// Get posted randomness for a given ID
    GetRandomness { id: u64 },

    /// Get unprocessed randomness requests
    GetUnprocessedRandomness {},

    /// (Optional) For debugging: get all events for a specific event type
    GetEvents { event_type: u16 },
}

// The response types returned by queries:
#[derive(Serialize, Deserialize, Clone, PartialEq, Debug)]
pub struct RandomnessResponse {
    pub randomness: u64,
}

#[derive(Serialize, Deserialize, Clone, PartialEq, Debug)]
pub struct UnprocessedRandomness {
    pub randomness_id: u64,
}

#[derive(Serialize, Deserialize, Clone, PartialEq, Debug)]
pub struct UnprocessedRandomnessResponse {
    pub items: Vec<UnprocessedRandomness>,
}

#[derive(Serialize, Deserialize, Clone, PartialEq, Debug)]
pub struct EventsResponse {
    pub events: Vec<Event>,
}

// --------------------------------------
// Storage
// --------------------------------------

// Single config item
const CONFIG: Item<Config> = Item::new("config");

// Map from event_type -> Vec<Event>
const EVENTS: Map<u16, Vec<Event>> = Map::new("events");

// Index map: (event_type, event_id) -> index in the EVENTS vector
// This allows O(1) removal by swapping last element with the one to delete.
const EVENT_INDEX: Map<(u16, u64), usize> = Map::new("event_index");

// Store posted randomness: (randomness_id) -> randomness_value
const RANDOMNESS_JOBS: Map<u64, u64> = Map::new("randomness_jobs");

// --------------------------------------
// Instantiate
// --------------------------------------

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let writer_addr = deps.api.addr_validate(&msg.writer)?;

    let config = Config {
        event_buffer_size: msg.event_buffer_size,
        writer: writer_addr,
        next_randomness_id: 0,
    };
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("action", "instantiate")
        .add_attribute("owner", info.sender)
        .add_attribute("buffer_size", msg.event_buffer_size.to_string()))
}

// --------------------------------------
// Execute
// --------------------------------------

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::RequestRandomness {} => execute_request_randomness(deps, env, info),
        ExecuteMsg::PostRandomness { id, randomness } => {
            execute_post_randomness(deps, env, info, id, randomness)
        }
    }
}

fn execute_request_randomness(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
) -> StdResult<Response> {
    let mut config = CONFIG.load(deps.storage)?;

    // Increase the ID for the next request
    config.next_randomness_id += 1;
    let request_id = config.next_randomness_id;

    // Insert an event
    let event_data = to_binary(&request_id)?; // similar to abi.encode in Solidity
    insert_event(
        deps.storage,
        request_id,
        EventType::RandomnessRequested as u16,
        event_data,
    )?;

    // Save updated config
    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("action", "request_randomness")
        .add_attribute("request_id", request_id.to_string())
        .add_attribute("caller", info.sender))
}

fn execute_post_randomness(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    id: u64,
    randomness: u64,
) -> StdResult<Response> {
    let config = CONFIG.load(deps.storage)?;
    // Ensure only writer can post randomness
    if info.sender != config.writer {
        return Err(cosmwasm_std::StdError::generic_err("Only writer can post randomness"));
    }

    // Check that we have not posted randomness for this ID yet
    if RANDOMNESS_JOBS.may_load(deps.storage, id)?.is_some() {
        return Err(cosmwasm_std::StdError::generic_err("Randomness already posted"));
    }

    // Store the randomness
    RANDOMNESS_JOBS.save(deps.storage, id, &randomness)?;

    // Erase the corresponding event from the buffer
    // Notice that we use `id`, not config.next_randomness_id
    erase_event(
        deps.storage,
        id,
        EventType::RandomnessRequested as u16,
    )?;

    Ok(Response::new()
        .add_attribute("action", "post_randomness")
        .add_attribute("request_id", id.to_string())
        .add_attribute("randomness", randomness.to_string()))
}

// --------------------------------------
// Query
// --------------------------------------

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetRandomness { id } => to_binary(&query_randomness(deps, id)?),
        QueryMsg::GetUnprocessedRandomness {} => to_binary(&query_unprocessed(deps)?),
        QueryMsg::GetEvents { event_type } => to_binary(&query_events(deps, event_type)?),
    }
}

/// Return the posted randomness for a given request ID.
fn query_randomness(deps: Deps, id: u64) -> StdResult<RandomnessResponse> {
    let maybe_val = RANDOMNESS_JOBS.may_load(deps.storage, id)?;
    let val = maybe_val.ok_or_else(|| {
        cosmwasm_std::StdError::not_found("Randomness for this ID has not been posted yet.")
    })?;

    Ok(RandomnessResponse { randomness: val })
}

/// Return all unprocessed randomness IDs (those that are still in the event buffer).
fn query_unprocessed(deps: Deps) -> StdResult<UnprocessedRandomnessResponse> {
    let events = get_events(deps.storage, EventType::RandomnessRequested as u16)?;
    let mut items = Vec::with_capacity(events.len());
    for e in events {
        // e.data is a Binary that encodes a single u64
        let id: u64 = cosmwasm_std::from_binary(&e.data)?;
        items.push(UnprocessedRandomness { randomness_id: id });
    }

    Ok(UnprocessedRandomnessResponse { items })
}

/// Return all events of a specific type (debug or introspection).
fn query_events(deps: Deps, event_type: u16) -> StdResult<EventsResponse> {
    let events = get_events(deps.storage, event_type)?;
    Ok(EventsResponse { events })
}

// --------------------------------------
// "EventManager"-like internals
// --------------------------------------

/// A local enum for event types. Must match the old logic in solidity.
#[derive(Copy, Clone)]
pub enum EventType {
    RandomnessRequested = 0,
}

/// Insert event, checking buffer size and indexing it for O(1) removal.
fn insert_event(
    storage: &mut dyn Storage,
    event_id: u64,
    event_type: u16,
    data: Binary,
) -> StdResult<()> {
    let config = CONFIG.load(storage)?;

    // Load existing events for this type (or empty if none)
    let mut list = EVENTS.may_load(storage, event_type)?.unwrap_or_default();

    // Check buffer limit
    if (list.len() as u64) >= config.event_buffer_size {
        return Err(cosmwasm_std::StdError::generic_err("Event buffer is full"));
    }

    // Build new event
    let new_event = Event {
        event_id,
        event_type,
        data,
    };

    // Push to list, record index
    list.push(new_event.clone());
    let new_index = list.len() - 1;

    // Save the event list back
    EVENTS.save(storage, event_type, &list)?;

    // Save the index map
    EVENT_INDEX.save(storage, (event_type, event_id), &new_index)?;

    Ok(())
}

/// O(1) removal: swap-with-last then pop.
fn erase_event(storage: &mut dyn Storage, event_id: u64, event_type: u16) -> StdResult<()> {
    let mut list = EVENTS.may_load(storage, event_type)?.unwrap_or_default();

    // Find the index for (event_type, event_id)
    let idx = EVENT_INDEX
        .load(storage, (event_type, event_id))
        .map_err(|_| cosmwasm_std::StdError::generic_err("Event does not exist"))?;

    if idx >= list.len() {
        return Err(cosmwasm_std::StdError::generic_err(
            "Event index out of bounds",
        ));
    }

    // If idx is not the last element, swap the last in
    let last_index = list.len() - 1;
    if idx != last_index {
        let last_event = list[last_index].clone();
        list[idx] = last_event.clone();
        // Update the EVENT_INDEX for the swapped event
        EVENT_INDEX.save(storage, (event_type, last_event.event_id), &idx)?;
    }

    // Now pop the last
    list.pop();

    // Save updated list
    EVENTS.save(storage, event_type, &list)?;

    // Remove index entry for the removed event
    EVENT_INDEX.remove(storage, (event_type, event_id));

    Ok(())
}

/// Retrieve all events of a given type (similar to getEvents(...) in Solidity).
fn get_events(storage: &dyn Storage, event_type: u16) -> StdResult<Vec<Event>> {
    Ok(EVENTS.may_load(storage, event_type)?.unwrap_or_default())
}
