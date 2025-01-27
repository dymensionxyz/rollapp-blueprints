const { ethers } = require("hardhat");

async function main() {
    const aiGamblingAddr = "0x90C4E3e24E9337DbE43E061d762102b967553050";
    // owner address: 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
    [ owner ] = await ethers.getSigners();

    console.log(`Executing AIGambling contract with: AIAgent: ${owner.address}`);

    const AIGambling = await ethers.getContractAt("AIGamblingV1", aiGamblingAddr);

    const txOptions = {
        maxFeePerGas: ethers.parseUnits('30', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
    };

    try {
        const percentage = 15;
        const tx = await AIGambling.connect(owner).updateCommunityPoolPercentage(percentage, txOptions);

        const receipt = await tx.wait()
        console.log("Update community pool percentage. TX receipt: ", receipt);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exitCode = 1;
});
