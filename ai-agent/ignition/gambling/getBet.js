const { ethers } = require("hardhat");

async function main() {
    const userAddr = "0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E";
    const aiGamblingAddr = "0xE609F3d60E6211316c912F997643C417F5Fe1b5d";
    // aiAgent address: 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
    // prompter address: 0x4781200f96791A81684b67D1777BC7Cc66EF5813
    [ aiAgent, prompter ] = await ethers.getSigners();

    console.log(`Executing AIGambling contract with: AIAgent: ${aiAgent.address}, Prompter: ${prompter.address}`);

    const AIGambling = await ethers.getContractAt("AIGamblingV1", aiGamblingAddr);

    const txOptions = {
        maxFeePerGas: ethers.parseUnits('30', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
    };

    try {
        // Check if prompter is whitelisted
        const bet = await AIGambling.bets(userAddr);
        console.log("Active bet: ", bet);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exitCode = 1;
});
