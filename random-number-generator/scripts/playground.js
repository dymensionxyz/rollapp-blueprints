const { ethers } = require("hardhat");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  

async function main() {
    const randomnessGeneratorAddress = "0x676E400d0200Ac8f3903A3CDC7cc3feaF21004d0";

    const randomnessGenerator = await ethers.getContractAt("RandomnessGenerator", randomnessGeneratorAddress);

    // Fetch the current gas price dynamically
    const { maxFeePerGas, maxPriorityFeePerGas } = await ethers.provider.getFeeData();

    // Ensure the gas fees are sufficient
    const MIN_FEE = 1041500000000; // Use the minimum fee reported in the error message
    const adjustedMaxFeePerGas = 104150000000000
    const adjustedMaxPriorityFeePerGas = 104150000000000

    const deployOptions = {
        maxFeePerGas: adjustedMaxFeePerGas,
        maxPriorityFeePerGas: adjustedMaxPriorityFeePerGas,
    };

    try {
        // Example: Request Randomness
        const tx1 = await randomnessGenerator.requestRandomness(deployOptions);
        console.log("Randomness request sent. TX hash:", tx1.hash.toString());
        await tx1.wait();

	    const randID = await randomnessGenerator.randomnessId() 
        console.log("Rand ID of the request: ", randID)

        console.log("Waiting request 11 seconds to be processed")
        await sleep(11000);

        const tx2 = await randomnessGenerator.getRandomness(randID)
        console.log("generated: ", tx2.toString())
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exitCode = 1;
});
