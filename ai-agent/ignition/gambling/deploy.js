// Import ethers from Hardhat
const { ethers } = require("hardhat");

async function main() {
    // 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
    [ deployer ] = await ethers.getSigners();
    const aiOracleAddr = "0xf7849A073015BA78135f372068c7eD9b65e1a3a1";
    console.log("Deploying contracts with the account:", deployer.address);

    const deployOptions = {
        maxFeePerGas: ethers.parseUnits('30', 'gwei'), // Adjust as needed
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'), // Adjust as needed
    };

    try {
        const AIGambling = await ethers.getContractFactory("AIGambling", deployer);

        // Setup for RandomnessGenerator
        const ownerAddr = deployer.address; // assuming deployer is the owner for testing

        const aiGambling = await AIGambling.deploy(ownerAddr, aiOracleAddr, deployOptions);

        await aiGambling.waitForDeployment();
        console.log("AIGambling deployed at:", aiGambling.target);
    } catch (error) {
        console.error("Error during AIGambling deployment:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Unhandled error:", error);
        process.exit(1);
    });
