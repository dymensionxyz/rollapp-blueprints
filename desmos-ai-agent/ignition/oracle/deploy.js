// Import ethers from Hardhat
const { ethers } = require("hardhat");

/**
 * Main function to deploy the AIOracle contract.
 * It performs the following steps:
 * 1. Retrieves the deployer account.
 * 2. Sets up deployment options for gas fees.
 * 3. Deploys the AIOracle contract with the deployer as the writer.
 * 4. Waits for the deployment to complete and logs the contract address.
 */
async function main() {
    // 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
    [ deployer ] = await ethers.getSigners();
    console.log("Deploying AIOracle contract with the account:", deployer.address);

    const deployOptions = {
        maxFeePerGas: ethers.parseUnits('30', 'gwei'), // Adjust as needed
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'), // Adjust as needed
    };

    try {
        const AIOracle = await ethers.getContractFactory("AIOracle", deployer);

        // Setup for RandomnessGenerator
        const ownerAddr = deployer.address; // assuming deployer is the owner for testing

        const aiOracle = await AIOracle.deploy(ownerAddr, deployOptions);

        await aiOracle.waitForDeployment();
        const address = await aiOracle.getAddress();
        // Output the address in a format that can be easily parsed
        console.log("AIOracle_address=" + address);
    } catch (error) {
        console.error("Error during AIOracle deployment:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Unhandled error:", error);
        process.exit(1);
    });
