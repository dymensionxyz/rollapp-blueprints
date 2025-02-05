// Import ethers from Hardhat
const {ethers, upgrades} = require('hardhat');

async function main() {
    // 0x84ac82e5Ae41685D76021b909Db4f8E7C4bE279E
    [owner] = await ethers.getSigners();
    const aiGamblingAddr = "0x90C4E3e24E9337DbE43E061d762102b967553050";
    console.log("Upgrading AIGambling contract with the account:", owner.address);

    const deployOptions = {
        txOverrides: ethers.Overrides = {
            maxFeePerGas: ethers.parseUnits('300', 'gwei'),
            maxPriorityFeePerGas: ethers.parseUnits('100', 'gwei'),
        }
    };

    try {
        const AIGambling = await ethers.getContractFactory("AIGamblingV2", owner);
        const aiGambling = await upgrades.upgradeProxy(aiGamblingAddr, AIGambling, deployOptions);
        console.log("AIGambling upgraded: ", aiGambling.target);
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
