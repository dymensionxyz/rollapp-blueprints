const { ethers } = require("hardhat");

async function main() {
    const userAddr = "0x298dBe840E365705b7A56471d42F6eAa912b58c1";
    const aiGamblingAddr = "0x190e4F5fc52c29F657842Ec77251A765612CBe23";
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
        const bet = await AIGambling.history(userAddr, );
        console.log("Bets history: ", bet);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exitCode = 1;
});
