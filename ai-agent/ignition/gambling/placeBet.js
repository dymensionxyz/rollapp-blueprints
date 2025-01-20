const { ethers } = require("hardhat");

async function main() {
    const aiGamblingAddr = "0xEAcA423bF35A0C41d80d37Dc89C87C47baceE4FF";
    // owner address: 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
    [ owner ] = await ethers.getSigners();

    console.log(`Executing AIGambling contract with: AIAgent: ${owner.address}`);

    const AIGambling = await ethers.getContractAt("AIGambling", aiGamblingAddr);

    const txOptions = {
        value: ethers.parseEther("0.2"),
        maxFeePerGas: ethers.parseUnits('30', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
    };

    try {
        let guessed = 5;
        const tx = await AIGambling.placeBet(guessed, '', txOptions);

        const receipt = await tx.wait()
        console.log("Bet placed. TX receipt: ", receipt);

        const balance = await AIGambling.balances(owner.address)
        console.log("Current House balance for AIAgent: ", balance);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exitCode = 1;
});
