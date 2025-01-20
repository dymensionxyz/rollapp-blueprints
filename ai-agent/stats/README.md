# AI Gambling RollApp Indexer

## Useful commands

Deploy the AI Gambling contract to the local network
```bash
npx hardhat run ignition/gambling/deploy.js --network localhost
```

Deposit supply to the AI Gambling contract
```bash
npx hardhat run ignition/gambling/depositSupply.js --network localhost
```

Generate the ABI for the AI Gambling contract
```bash
solc @openzeppelin/=$(pwd)/node_modules/@openzeppelin/ --abi contracts/AIGambling.sol -o build --overwrite
```

Generate the Go binding for the AI Gambling contract
```bash
abigen --abi build/AIGambling.abi --pkg main --type AIGambling --out stats/AIGambling.sol.go
```