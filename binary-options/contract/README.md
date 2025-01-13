# CosmWasm Options Contract

This repository contains a simple CosmWasm smart contract that allows users to place and settle binary options (up or down) on a given price. It demonstrates:

- Contract initialization with configuration.
- Placing an option position by sending funds.
- Settling an option after expiration.

Below you will find instructions for installing Rust (and the appropriate tooling), building the contract, running tests, generating schemas, and deploying the contract on a CosmWasm-compatible blockchain.

## Prerequisites

1. **Rust & Cargo**
    - Install Rust (and Cargo) with [rustup](https://rustup.rs/).
    - Make sure you’re running Rust stable:
      ```bash
      rustup default stable
      rustup update
      ```
2. **wasm32-unknown-unknown target**
    - Add the wasm32-unknown-unknown target:
      ```bash
      rustup target add wasm32-unknown-unknown
      ```
3. **Cargo Generate (optional)**
    - If you want to create new CosmWasm projects, installing [`cargo-generate`](https://github.com/cargo-generate/cargo-generate) is helpful.
4. **CosmWasm tools**
    - For local development, you can use [`wasmd`](https://github.com/CosmWasm/wasmd). Installation instructions can be found in the wasmd repo.

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your_username/cosmwasm-options-contract.git
cd cosmwasm-options-contract
```


### 2. Build the Contract

```bash
cargo wasm
```

This command compiles the contract into the Wasm format. It will produce an unoptimized .wasm file in target/wasm32-unknown-unknown/debug/.

### 3. Optimize the Wasm (Highly Recommended)

Optimize the built Wasm for production (and for chain upload size limits) by using the [rust-optimizer](https://github.com/CosmWasm/optimizer) script:

```bash
docker run --rm -v "$(pwd)":/code \
--mount type=volume,source="$(basename "$(pwd)")_cache",target=/target \
--mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
cosmwasm/rust-optimizer:0.15.0
```


### 4. Run Tests

```bash
cargo test
```

### 5. Generate JSON Schemas (Optional)

To generate JSON schemas (for messages, queries, responses, etc.):

```bash
cargo schema
```

This outputs .json schema files in the schema/ directory.

## Deployment

Below is a generic guide to deploying the contract to a CosmWasm-compatible chain (e.g., a local wasmd or a testnet/mainnet).

### 1. Start or Connect to a Node
   Local Node: If you are using a local wasmd environment, ensure it’s running and configured.
   Testnet or Mainnet: Make sure your CLI is configured to point to the correct node/RPC.

### 2. Upload (Store) the Contract
   First, you’ll store the optimized Wasm code on the chain:

```bash
rollapp-wasm tx wasm store artifacts/binary_options.wasm \
--from rol-user \
--gas auto \
--gas-adjustment 1.9 \
--fees 3791065000000000awsm
```

After the transaction is included, look for the "code_id" in the logs (e.g., code_id: 5). You’ll need that code_id to instantiate the contract.

### 3. Instantiate the Contract

Next, instantiate the contract with your desired configuration parameters. For example:

```bash
wasmd tx wasm instantiate <CODE_ID> \
'{
"oracle_addr":"oracle",
"payout_multiplier":200
}' \
--label "options-contract" \
--from <YOUR_KEY_NAME> \
--gas auto \
--gas-adjustment 1.9 \
--gas-prices 0.025stake \
-y
```

Replace:

- <CODE_ID> with the code_id from the store step.
- oracle_addr with a valid address or any other parameters you need.
- payout_multiplier with the desired multiplier.
 
After successful instantiation, the logs will show a "contract_address", which you will use for future queries and executions.

### 4. Interacting with the Contract
   #### Placing an Option
   ```bash
   wasmd tx wasm execute <CONTRACT_ADDRESS> \
   '{
   "place_option": {
   "direction": "Up",
   "expiration": 1700000000,
   "bet_amount": {
   "denom": "token",
   "amount": "100"
   }
   }
   }' \
   --amount 100token \
   --from <YOUR_KEY_NAME> \
   --gas auto \
   --gas-adjustment 1.9 \
   --gas-prices 0.025stake \
   -y
   ```

   - <CONTRACT_ADDRESS> is the address of the instantiated contract.
   - --amount 100token must match the bet_amount in the message.
   - 
   #### Settling an Option
   ```bash
   wasmd tx wasm execute <CONTRACT_ADDRESS> \
   '{
   "settle_option": {
   "option_id": 1
   }
   }' \
   --from <YOUR_KEY_NAME> \
   --gas auto \
   --gas-adjustment 1.9 \
   --gas-prices 0.025stake \
   -y
   ```
   #### Querying an Option

   ```bash
   wasmd query wasm contract-state smart <CONTRACT_ADDRESS> \
   '{
   "get_option": {
   "option_id": 1
   }
   }'
   ```

   #### Listing Options
   ```bash
   wasmd query wasm contract-state smart <CONTRACT_ADDRESS> \
   '{
   "list_options": {
   "start_after": null,
   "limit": 10
   }
   }'
   ```

   #### Getting Config
   ```bash
   wasmd query wasm contract-state smart <CONTRACT_ADDRESS> \
   '{
   "get_config": {}
   }'
    ```
