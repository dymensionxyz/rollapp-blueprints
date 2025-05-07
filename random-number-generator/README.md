# Random Number Generator (RNG) RollApp

Welcome to the **Random Number Generator (RNG) RollApp**! This guide will walk you through deploying a simple RNG on RollApp EVM.

## Table of Contents

- [Random Number Generator (RNG) RollApp](#random-number-generator-rng-rollapp)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Step 1: Deploying EVM RollApp](#step-1-deploying-evm-rollapp)
  - [Step 2: Transferring Tokens](#step-2-transferring-tokens)
  - [Step 3: Deploying the RNG Contract](#step-3-deploying-the-rng-contract)
  - [Step 4: Deploying RNG Agent and Service](#step-4-deploying-rng-agent-and-service)
  - [Step 5: Execute the Playground](#step-5-execute-the-playground)
  - [Troubleshooting](#troubleshooting)
  - [Additional Resources](#additional-resources)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [Hardhat](https://hardhat.org/)
- [RollApp EVM](https://github.com/dymensionxyz/rollapp-evm)
- [Git](https://git-scm.com/)

## Step 1: Deploying EVM RollApp

Use [roller](https://docs.dymension.xyz/launch/quickstart#roller-installation) to setup a [local RollApp EVM](https://docs.dymension.xyz/launch/quickstart#run-a-rollapp).

## Step 2: Transferring Tokens

To deploy the RNG contract, you need sufficient gas. Follow these steps to fund your deploy account (or simply use [roller](https://docs.dymension.xyz/launch/integrate/rng-oracle)):

1. **Identify the Deploy Account Address**

   Run the deployment script to identify the deploy account:

   ```sh
   npx hardhat run scripts/deploy_rng.js --network localhost
   ```

   **Expected Output:**
   ```plaintext
   Deploying contracts with the account: 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
   Error during RandomnessGenerator deployment: ....
   ```

2. **Decode the Hex Address to Bech32 Format**

   Use the following command to convert the hex address:

   ```sh
   rollapp-evm debug addr 84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
   ```

   **Expected Output:**
   ```plaintext
   Address: [132 172 130 229 174 65 104 93 118 2 27 144 157 180 248 231 196 190 39 158]
   Address (hex): 84AC82E5AE41685D76021B909DB4F8E7C4BE279E
   Bech32 Acc: ethm1sjkg9edwg9596aszrwgfmd8culztufu7pjganj
   Bech32 Val: ethmvaloper1sjkg9edwg9596aszrwgfmd8culztufu7wzz3t0
   ```

   - **Bech32 Account (`Bech32 Acc`)**: The address you need to fund (`ethm1sjkg9edwg9596aszrwgfmd8culztufu7pjganj`).

3. **List Existing Accounts**

   To view all test accounts, run:

   ```sh
   rollapp-evm keys list --keyring-backend test
   ```

   **Expected Output:**
   ```plaintext
   - address: ethm1qrvpx00nrkfa2ldg2y53mvnqm9xjy27j37erja
     name: rol-user
     pubkey: '{"@type":"/ethermint.crypto.v1.ethsecp256k1.PubKey","key":"AwvXxZLMNcTYYkLWRa2Kw0hinTGDttT6tlVoXbDO71Ir"}'
     type: local
   ```

4. **Transfer Tokens to Deploy Account**

   Transfer tokens from a funded account to the deploy account, e.g:

   ```sh
   rollapp-evm tx bank send ethm1qrvpx00nrkfa2ldg2y53mvnqm9xjy27j37erja ethm1sjkg9edwg9596aszrwgfmd8culztufu7pjganj 99949999999999600000000000arax --gas auto --gas-prices 1000000000arax --gas-adjustment 1.3 --keyring-backend test
   ```

## Step 3: Deploying the RNG Contract

With the deploy account funded, deploy the RNG contract:

```sh
npx hardhat run scripts/deploy_rng.js --network localhost
```

This script will print the address of the deployed contract. 

```
Deploying contracts with the account: 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
RandomnessGenerator deployed at: 0x676E400d0200Ac8f3903A3CDC7cc3feaF21004d0
```

## Step 4: Deploying RNG Agent and Service 

Go to the home directory of the agent (default is `~/.rollapp-agent/config/config.json`) and modify the `contract_address` field in the `config.json` file: put the address of the deployed contract that you got in the previous step.

```
...
 "contract_address": "0x676E400d0200Ac8f3903A3CDC7cc3feaF21004d0"
...
```

Then, launch the backend

```
./scripts/launch_backend.sh
```

## Step 5: Execute the Playground

Update the `scripts/playground.js` file by replacing the following line with the address of the deployed contract:

```javascript:scripts/playground.js
const randomnessGeneratorAddress = "0xYourDeployedContractAddress"
```

After updating the contract address, run the playground using the following command:

```sh
npx hardhat run scripts/playground.js --network localhost
```

## Troubleshooting

- **Insufficient Tokens Error:**
  If you encounter an error stating that the deploy account lacks sufficient tokens, ensure you've completed [Step 2: Transferring Tokens](#step-2-transferring-tokens) correctly.

- **Deployment Failures:**
  Verify that the RollApp EVM is running and that your network configurations are correct.

- **Configuration Issues:**
  Ensure that the `config.json` file has the correct contract address and that the backend script has execution permissions.

## Additional Resources

- [RollApp EVM GitHub Repository](https://github.com/dymensionxyz/rollapp-evm)
- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [Bech32 Encoding Guide](https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki)

---

Feel free to contribute or raise issues on the [GitHub repository](https://github.com/your-repo/random-number-generator).
