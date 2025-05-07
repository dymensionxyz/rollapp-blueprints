#!/bin/bash

# Deploy AIOracle and capture its address
echo "Deploying AIOracle..."
AIORACLE_OUTPUT=$(npx hardhat run ignition/oracle/deploy.js --network localhost)
AIORACLE_ADDRESS=$(echo "$AIORACLE_OUTPUT" | grep "AIOracle_address=" | cut -d'=' -f2)

if [ -z "$AIORACLE_ADDRESS" ]; then
    echo "Error: Failed to get AIOracle address"
    exit 1
fi

echo "AIOracle deployed at: $AIORACLE_ADDRESS"

# Deploy AIGambling with the AIOracle address
echo "Deploying AIGambling..."
AIORACLE_ADDRESS=$AIORACLE_ADDRESS npx hardhat run ignition/gambling/deploy.js --network localhost 