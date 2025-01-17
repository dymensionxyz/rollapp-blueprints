const { ethers } = require("hardhat");

async function main() {
    const aiGamblingAddr = "0xE609F3d60E6211316c912F997643C417F5Fe1b5d";
    // owner address: 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
    [ owner ] = await ethers.getSigners();

    console.log(`Executing AIGambling contract with: AIAgent: ${owner.address}`);

    const AIGambling = await ethers.getContractAt("AIGambling", aiGamblingAddr);

    const txOptions = {
        maxFeePerGas: ethers.parseUnits('30', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
    };

    try {
        const tx = await AIGambling.connect(owner).resolveBet(txOptions);

        const receipt = await tx.wait()
        console.log("Resolved bet. TX receipt: ", receipt);

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
