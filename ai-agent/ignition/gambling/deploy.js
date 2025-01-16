// Import ethers from Hardhat
const { ethers } = require("hardhat");

async function main() {
    // 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
    [ owner ] = await ethers.getSigners();
    const aiOracleAddr = "0x813c3A4CC989000FA93bdB0183618EAcef2d193b";
    console.log("Deploying AIGambling contract with the account:", owner.address);

    const deployOptions = {
        maxFeePerGas: ethers.parseUnits('30', 'gwei'), // Adjust as needed
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'), // Adjust as needed
    };

    try {
        const AIGambling = await ethers.getContractFactory("AIGambling", owner);

        const ownerAddr = owner.address; // deployer is the owner

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
