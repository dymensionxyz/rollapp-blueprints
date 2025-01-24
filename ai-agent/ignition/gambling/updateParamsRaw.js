const {ethers} = require("hardhat");

async function main() {
    const aiGamblingAddr = "0x64EAE44a2d4746eCd4b34EE80bbe82B393d1679D";
    // 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
    [owner] = await ethers.getSigners();

    console.log(`Executing AIGambling contract with: ${owner.address}`);

    const AIGambling = await ethers.getContractAt("AIGamblingV1", aiGamblingAddr);

    const txOptions = {
        maxFeePerGas: ethers.parseUnits('30', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
    };

    try {
        let percentage = 10;
        const txData = await AIGambling.updateCommunityPoolPercentage.populateTransaction(percentage, txOptions);

        txData.gasLimit = ethers.provider.estimateGas({
            ...txData,
            from: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2', // x/gov address
        });
        txData.chainId = (await ethers.provider.getNetwork()).chainId;
        txData.nonce = await ethers.provider.getTransactionCount('0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2');

        txData.maxFeePerGas = 0x06fc23ac00
        txData.maxPriorityFeePerGas = 0x77359400
        txData.chainId = 0x04d2
        txData.gasLimit = 0x7530
        txData.nonce = 0x00

        console.log("Raw transaction data: ", txData);

        const properties = await ethers.resolveProperties(txData);
        console.log("Resolved transaction: ", properties);

        let sentTx = await ethers.provider.broadcastTransaction({
            ...properties,
            from: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
        })

        console.log("Expected Transaction Hash: ", sentTx);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exitCode = 1;
});
