// Import ethers from Hardhat
const {ethers, upgrades} = require('hardhat');

async function main() {
    // 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
    [owner] = await ethers.getSigners();
    const aiOracleAddr = "0xe07b29560776ba4Cfbe0BbF8537C847907909D09";
    console.log("Deploying AIGambling contract with the account:", owner.address);

    const deployOptions = {
        initializer: 'initialize',
        txOverrides: ethers.Overrides = {
            maxFeePerGas: ethers.parseUnits('300', 'gwei'),
            maxPriorityFeePerGas: ethers.parseUnits('100', 'gwei'),
        }
    };

    try {
        const AIGambling = await ethers.getContractFactory("AIGambling", owner);
        const aiGambling = await upgrades.deployProxy(AIGambling, [owner.address, aiOracleAddr], deployOptions);
        await aiGambling.waitForDeployment();
        console.log("AIGambling deployed at:", aiGambling.target);
    } catch (error) {
        console.error("Error during AIGambling deployment:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Unhandled error:", error);
        process.exit(1);
    });
