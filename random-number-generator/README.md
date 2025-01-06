# Example of the local Rollapp : RandomGenerator

In this guide we will deploy a simple Randomness Number Generator (RNG).

## Step 1: Deploying EVM-rollapp  

Follow [the default instruction](https://github.com/dymensionxyz/rollapp-evm) steps.

## Step 2: Transfering tokens 

To deploy RNG contract you need some gas.
So the first thing, that we need to do is to find out deploy account address

```sh
npx hardhat run scripts/deploy_rng.js --network localhost
```

You will get message like. It states that the specified account does not have enough tokens to deploy the contract.

```
Deploying contracts with the account: 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
Error during RandomnessGenerator deployment: ....
```

We will fund this account with some tokens. First, we need to decode the hex address to the bech32 format.

```sh
rollapp-evm debug addr 84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
```
```
Address: [132 172 130 229 174 65 104 93 118 2 27 144 157 180 248 231 196 190 39 158]
Address (hex): 84AC82E5AE41685D76021B909DB4F8E7C4BE279E
Bech32 Acc: ethm1sjkg9edwg9596aszrwgfmd8culztufu7pjganj
Bech32 Val: ethmvaloper1sjkg9edwg9596aszrwgfmd8culztufu7wzz3t0
```

`Bech32 Acc` is the address that we need to fund. After, find an account that has some tokens and transfer them to the deploy account. To check all your existing account run the following command:

```sh
rollapp-evm keys list --keyring-backend test
```
```
- address: ethm1qrvpx00nrkfa2ldg2y53mvnqm9xjy27j37erja
  name: rol-user
  pubkey: '{"@type":"/ethermint.crypto.v1.ethsecp256k1.PubKey","key":"AwvXxZLMNcTYYkLWRa2Kw0hinTGDttT6tlVoXbDO71Ir"}'
  type: local
```

If you deploy the RollApp using [the default instruction](https://github.com/dymensionxyz/rollapp-evm), you will have an account with the name `rol-user`. This account has some tokens. To transfer tokens from this account to the deploy account, run the following command:  

```
rollapp-evm tx bank send ethm1qrvpx00nrkfa2ldg2y53mvnqm9xjy27j37erja ethm1sjkg9edwg9596aszrwgfmd8culztufu7pjganj 99949999999999600000000000arax --gas auto --gas-prices 1000000000arax --gas-adjustment 1.3 --keyring-backend test
```

## Step 3: Deploying the RNG contract

```sh
npx hardhat run scripts/deploy_rng.js --network localhost
```

This script will print the address of the deployed contract. 

```
Deploying contracts with the account: 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
RandomnessGenerator deployed at: 0x676E400d0200Ac8f3903A3CDC7cc3feaF21004d0
```

## Step 3: Deploying RNG Agent + RNG Service 

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

## Step 4: Enjoy the playground

Replace `const randomnessGeneratorAddress = "0x676E400d0200Ac8f3903A3CDC7cc3feaF21004d0"` line from `scripts/playground.js` with the address of the deployed contract and enjoy the playground by running the following command:

```
npx hardhat run scripts/playground.js --network localhost
```
