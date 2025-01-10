const { ethers } = require("hardhat");

async function main() {
    const aiGamblingAddr = "0x50afEF9b35ac8Fa7D7395ff7acdb78C49E71dc3b";
    // owner address: 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
    [ owner ] = await ethers.getSigners();

    console.log(`Executing AIGambling contract with: AIAgent: ${owner.address}`);

    const AIGambling = await ethers.getContractAt("AIGambling", aiGamblingAddr);

    const txOptions = {
        value: ethers.parseEther("100.0"),
        maxFeePerGas: ethers.parseUnits('30', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
    };

    try {
        const tx = await AIGambling.connect(owner).depositSupply(txOptions);
        const receipt = await tx.wait()

        console.log("Supply deposited. TX receipt: ", receipt);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exitCode = 1;
});
