const { ethers } = require("hardhat");

/**
 * Main function to execute the AIOracle contract interactions.
 * It performs the following steps:
 * 1. Retrieves the AIOracle contract instance.
 * 2. Checks if the prompter is whitelisted.
 * 3. If not whitelisted, whitelists the prompter.
 * 4. Submits a prompt to the AIOracle contract.
 * 5. Retrieves and logs the latest prompt ID.
 */
async function main() {
    const aiOracleAddr = "0x8B90561C4e88958d0EB32604E45b6A2f747C00d4";
    // aiAgent address: 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
    // prompter address: 0x4781200f96791A81684b67D1777BC7Cc66EF5813
    [ aiAgent, prompter ] = await ethers.getSigners();

    console.log(`Executing AIOracle contract with: AIAgent: ${aiAgent.address}, Prompter: ${prompter.address}`);

    const AIOracle = await ethers.getContractAt("AIOracle", aiOracleAddr);

    const txOptions = {
        maxFeePerGas: ethers.parseUnits('30', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
    };

    try {
        // Submit a prompt
        const promptTx = await AIOracle.connect(prompter).submitPrompt(["Generate a random number between 1 and 10"], txOptions);
        const receipt = await promptTx.wait();

        console.log("Prompt submitted. TX receipt: ", receipt);

        // Get the latest prompt ID
        const latestPromptID = await AIOracle.latestPromptId();
        console.log("Latest prompt ID: ", latestPromptID.toString());

    } catch (error) {
        console.error("Error:", error.message);
    }
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exitCode = 1;
});
