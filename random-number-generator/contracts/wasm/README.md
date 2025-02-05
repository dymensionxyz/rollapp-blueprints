# Randomness Manager (CosmWasm)

This repository contains a single CosmWasm smart contract that demonstrates two core functionalities:

1. An **in-contract event manager** that stores and manages custom “events” (rather than relying entirely on off-chain logs).
2. A **randomness request/fulfillment mechanism**, where users can request randomness and a designated “writer” (e.g., an oracle) can post the random values on-chain.

> **Note**: This example is based on [CosmWasm](https://docs.cosmwasm.com/). If you’re new to CosmWasm or Rust, don’t worry—this README walks through how to build, deploy, and interact with the contract on a chain that supports CosmWasm.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Build & Compilation](#build--compilation)
4. [Deployment](#deployment)
5. [Instantiation](#instantiation)
6. [Execution](#execution)
7. [Querying](#querying)
8. [Contract Flow](#contract-flow)
9. [Further Reading](#further-reading)

---

## Overview

This contract addresses two main problems:

1. **Event Management**:  
   Storing custom events (requests, triggers, etc.) on-chain in a way that’s easy to query and manage. 
   - Each event has an ID, a type, and arbitrary `bytes`-like data (in CosmWasm, `Binary`).
   - A ring buffer or “bounded buffer” enforces a maximum number of events per type (configured at instantiation).

2. **Randomness Flow**:
   - Users can submit requests for randomness.
   - Each request is stored as an event (type = `RandomnessRequested`) with a unique ID.
   - A designated writer (the “oracle”) later posts the randomness, fulfilling the request and removing the event from the unprocessed queue.

---

## Prerequisites

- **Rust & Cargo**: Install [Rust](https://www.rust-lang.org/tools/install) (version 1.60+ recommended).
- **wasm32-unknown-unknown Target**:  
  ```bash
  rustup target add wasm32-unknown-unknown
  ```
- **CosmWasm Dev Tools** (optional, but recommended):
  - [cosmwasm-std](https://crates.io/crates/cosmwasm-std), [cw-storage-plus](https://crates.io/crates/cw-storage-plus), etc. 
  - The project `Cargo.toml` already references these.
- A **local or testnet chain** that supports CosmWasm. For example:
  - [wasmd](https://github.com/CosmWasm/wasmd) locally.
  - [Juno testnet](https://docs.junonetwork.io/testnet) or any other Cosmos chain with CosmWasm enabled.
  - A Dymension RollApp chain if it supports CosmWasm.

---

## Build & Compilation

1. **Clone** this repository (or copy the contract’s code into your own project structure).
2. **Build** the contract optimized for deployment:

   ```bash
   cargo build --release --target wasm32-unknown-unknown
   ```

   This produces a `.wasm` file, typically in `target/wasm32-unknown-unknown/release/`. 

   For a smaller/optimized build, you can also use [cargo run-script optimizer](https://github.com/CosmWasm/rust-optimizer) or a Docker-based build:

   ```bash
   docker run --rm -v "$(pwd)":/code \
       --mount type=volume,source="cosmwasm_cache",target=/code/target \
       cosmwasm/rust-optimizer:0.12.13
   ```
   This outputs an optimized `.wasm` file in the `artifacts/` folder.

---

## Deployment

Assuming you have a local or remote chain that supports CosmWasm, you generally:

1. **Store** the `.wasm` file on the chain, which returns a code ID.
2. **Instantiate** the contract using that code ID, specifying initial parameters.

The CLI commands differ slightly depending on the chain. Here’s a generic example using `wasmd`:

```bash
# Example: store the contract
wasmd tx wasm store artifacts/my_randomness_contract.wasm \
  --from <your-key> \
  --gas auto --gas-adjustment 1.9 \
  -y

# The command returns a code_id in the logs, e.g. code_id: 3
```

---

## Instantiation

Once you have the `code_id`, instantiate the contract with parameters:

- **`event_buffer_size`**: The maximum number of events per event type.
- **`writer`**: The address allowed to post randomness.

**Example**:

```bash
wasmd tx wasm instantiate <code_id> \
  '{"event_buffer_size": 100, "writer": "wasm1..." }' \
  --from <your-key> \
  --label "RandomnessContract" \
  --gas auto --gas-adjustment 1.9 \
  -y
```

This returns a **contract address**. Let’s call it `contract_addr`.

---

## Execution

There are two main execution (transaction) messages:

1. **`RequestRandomness {}`**  
   - A user calls this to request randomness.
   - The contract increments an internal “next ID,” stores an event, and logs the new request ID in the response.

   **CLI Example**:
   ```bash
   wasmd tx wasm execute <contract_addr> \
     '{"request_randomness": {}}' \
     --from <your-key> \
     --gas auto --gas-adjustment 1.9 \
     -y
   ```
   You’ll see an event or log output with a `request_id`.

2. **`PostRandomness { id, randomness }`**  
   - The designated writer calls this to fulfill the randomness request.  
   - This removes the unprocessed event from the contract’s buffer and stores the randomness on-chain.

   **CLI Example**:
   ```bash
   wasmd tx wasm execute <contract_addr> \
     '{"post_randomness": {"id": 1, "randomness": 123456}}' \
     --from <writer-key> \
     --gas auto --gas-adjustment 1.9 \
     -y
   ```
   This will fail if:
   - You’re **not** calling from the `writer` address specified at instantiation.
   - The randomness has already been posted for that request ID.
   - No such event is found in the buffer.

---

## Querying

The contract exposes three query (read-only) messages:

1. **`GetRandomness { id }`**  
   Retrieves the randomness posted for a given `id`.
   - If none is posted yet, the query fails with an error.

   ```bash
   wasmd query wasm contract-state smart <contract_addr> \
     '{"get_randomness": {"id": 1}}'
   ```

   A successful response looks like:
   ```json
   {
     "randomness": 123456
   }
   ```

2. **`GetUnprocessedRandomness {}`**  
   Returns an array of all pending randomness requests (those that haven’t yet been fulfilled).

   ```bash
   wasmd query wasm contract-state smart <contract_addr> \
     '{"get_unprocessed_randomness": {}}'
   ```

   Example response:
   ```json
   {
     "items": [
       { "randomness_id": 2 },
       { "randomness_id": 3 }
     ]
   }
   ```

3. **`GetEvents { event_type }`**  
   Debug helper that returns all raw `Event` structures of a specific type.  
   - In this example, `RandomnessRequested` is event type `0`.

   ```bash
   wasmd query wasm contract-state smart <contract_addr> \
     '{"get_events": {"event_type": 0}}'
   ```

---

## Contract Flow

A typical flow looks like this:

1. **User** calls `RequestRandomness`.
   - The contract increments an internal counter (e.g., from 0 to 1).
   - It stores an “unprocessed” event with ID = 1.
2. **User** or **Another** address queries `GetUnprocessedRandomness` to see that ID `1` is pending.
3. **The Oracle / Writer** calls `PostRandomness { id: 1, randomness: 99999 }`.
   - The contract verifies the caller is the writer.
   - It stores the randomness in the on-chain `RANDOMNESS_JOBS`.
   - It removes the “unprocessed” event for ID `1`.
4. **User** calls `GetRandomness { id: 1 }`.
   - The contract returns `99999`.

At each step, you can query the chain to verify state changes.

---

## Further Reading

- **CosmWasm Docs**: <https://docs.cosmwasm.com/>
- **CosmWasm by Example**: <https://github.com/CosmWasm/cosmwasm-examples>
- **Smart Contract Testing**: Consider using [cargo test] with [cosmwasm-vm](https://docs.cosmwasm.com/docs/1.0/getting-started/testing) to write unit/integration tests in Rust.

**Happy hacking!** Feel free to modify this contract to suit your needs—like adding multiple event types, adding fee logic, or building more complex logic around posted randomness. If you have any questions, open an issue or reach out to the CosmWasm community.