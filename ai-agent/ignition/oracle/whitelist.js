const { ethers } = require("hardhat");

async function main() {
    const aiOracleAddr = "0xA62516c3c64e646C19167a85f6C20D945E085c8c";
    // aiGambling address:
    const aiGamblingAddr = "0xc50a0a381eff8051E8d841C3DAbc4AbE4d609592";
    [ aiAgent, prompter ] = await ethers.getSigners();

    console.log(`Executing AIOracle whitelisting with: AIAgent: ${aiAgent.address}, AIGambling: ${aiGamblingAddr}`);

    const AIOracle = await ethers.getContractAt("AIOracle", aiOracleAddr);

    const txOptions = {
        maxFeePerGas: ethers.parseUnits('30', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
    };

    try {
        const isWhitelisted = await AIOracle.isWhitelisted(aiGamblingAddr);

        if (!isWhitelisted) {
            console.log("Whitelisting prompter...");
            const whitelistTx = await AIOracle.connect(aiAgent).addWhitelisted(aiGamblingAddr, txOptions);
            await whitelistTx.wait();
        }

        console.log("AIGambling contract successfully whitelisted!");
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main().catch((error) => {
    console.error("Error in script execution:", error);
    process.exitCode = 1;
});
