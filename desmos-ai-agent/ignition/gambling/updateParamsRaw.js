const {ethers} = require("hardhat");

async function main() {
    const aiGamblingAddr = "0x90C4E3e24E9337DbE43E061d762102b967553050";
    // 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
    const [ owner ] = await ethers.getSigners();

    console.log(`Executing AIGambling contract with: ${owner.address}`);

    const AIGambling = await ethers.getContractAt("AIGamblingV1", aiGamblingAddr);

    // const txOptions = {
    //     maxFeePerGas: ethers.parseUnits('30', 'gwei'),
    //     maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
    // };

    try {
        let percentage = 10;
        const txData = await AIGambling.connect(owner).updateCommunityPoolPercentage.populateTransaction(percentage);

        txData.onBehalf = '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2'; // x/gov address
        txData.chainId = (await ethers.provider.getNetwork()).chainId;
        txData.nonce = await owner.getNonce();
        txData.gasLimit = ethers.provider.estimateGas({
            ...txData,
            from: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2', // emulate x/gov call
        });

        console.log("Raw transaction data: ", txData);

        const signedTx = await owner.signTransaction({
            ...txData,
            from: '0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E', // x/gov address
        });

        console.log("Signed Transaction: ", signedTx);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exitCode = 1;
});
