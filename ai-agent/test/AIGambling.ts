import { expect } from "chai";
import { ethers } from "hardhat";

describe("AIGambling", function () {
    let aiGambling: any;
    let aiOracle: any;
    let owner: any;
    let user: any;

    // Fixture to deploy and set up the contract
    async function deployAIOracleFixture() {
        const [owner1, prompter1, prompter2] = await ethers.getSigners();

        const AIOracle = await ethers.getContractFactory("AIOracle");
        aiOracle = await AIOracle.deploy(owner1.address);
        user = prompter1;
        owner = owner1;

        return { aiOracle, owner1, prompter1, prompter2 };
    }

    beforeEach(async function () {
        const { aiOracle, owner1, prompter1, prompter2 } = await deployAIOracleFixture();

        const AIGamblingFactory = await ethers.getContractFactory("AIGambling");
        const aiOracleAddr = await aiOracle.getAddress()
        aiGambling = await AIGamblingFactory.deploy(owner.address, aiOracleAddr);

        const aiGamblingAddr = await aiGambling.getAddress()

        await expect(aiOracle.connect(owner).addWhitelisted(aiGamblingAddr))
            .to.emit(aiOracle, "AddWhitelisted")
            .withArgs(aiGamblingAddr);

        expect(aiOracleAddr).to.properAddress;
    });

    async function depositHouse() {
        const aiGamblingAddr = await aiGambling.getAddress()
        const txData = {
            to: await aiGamblingAddr,
            value: ethers.parseEther("10.0") // Sending 1 ether as initial balance
        }

        // Send some initial balance to the aiGambling contract
        const tx =  await owner.sendTransaction(txData);
        await tx.wait();
    }

    it("should place a bet", async function () {
        const betAmount = ethers.parseEther("0.1");
        const guessedNumber = 5;

        // Fund the house with 10 ETH
        await depositHouse();

        await expect(aiGambling.connect(user).placeBet(guessedNumber, { value: betAmount }))
            .to.emit(aiGambling, "BetPlaced")
            .withArgs(user.address, betAmount, guessedNumber);

        const bet = await aiGambling.bets(user.address);
        expect(bet.amount).to.equal(betAmount);
        expect(bet.guessedNumber).to.equal(guessedNumber);
        expect(bet.resolved).to.be.false;
    });

    it("should not allow pricey bets", async function () {
        // Fund the house with 10 ETH
        await depositHouse();

        // The bet is 2% of the house balance. However, the house fee is 1%.
        const betAmount = ethers.parseEther("0.2");
        const guessedNumber = 5;

        await expect(aiGambling.connect(user).placeBet(guessedNumber, { value: betAmount }))
            .to.be.revertedWith("Bet amount is too high")

        const bet = await aiGambling.bets(user.address);
        expect(bet.amount).to.equal(0);
        expect(bet.guessedNumber).to.equal(0);
        expect(bet.resolved).to.be.false;
    });

    it("should resolve a bet correctly", async function () {
        const betAmount = ethers.parseEther("0.1");
        const guessedNumber = 5;

        // Fund the house with 10 ETH
        await depositHouse();

        await aiGambling.connect(user).placeBet(guessedNumber, { value: betAmount });

        // Submit the answer using the real AIOracle contract
        const promptId = (await aiGambling.bets(user.address)).promptId;
        await aiOracle.connect(owner).submitAnswer(promptId, "5");

        await expect(aiGambling.connect(user).resolveBet())
            .to.emit(aiGambling, "BetResult")
            .withArgs(user.address, guessedNumber, 5, true, ethers.parseEther("0.95"));

        const bet = await aiGambling.bets(user.address);
        expect(bet.resolved).to.be.true;
        expect(bet.won).to.be.true;

        const userBalance = await aiGambling.getBalance(user.address);
        expect(userBalance).to.equal(ethers.parseEther("0.95"));

        const wTx = await aiGambling.connect(user).withdraw()
        await wTx.wait()

        const userBalanceAfterWithdraw = await aiGambling.getBalance(user.address);
        expect(userBalanceAfterWithdraw).to.equal(0);
    });

    it("should resolve an unlucky bet correctly", async function () {
        const betAmount = ethers.parseEther("0.1");
        const guessedNumber = 5;

        // Fund the house with 10 ETH
        await depositHouse();

        await aiGambling.connect(user).placeBet(guessedNumber, { value: betAmount });

        // Submit the answer using the real AIOracle contract
        const promptId = (await aiGambling.bets(user.address)).promptId;
        await aiOracle.connect(owner).submitAnswer(promptId, "6");

        await expect(aiGambling.connect(user).resolveBet())
            .to.emit(aiGambling, "BetResult")
            .withArgs(user.address, guessedNumber, 6, false, ethers.parseEther("0"));

        const bet = await aiGambling.bets(user.address);
        expect(bet.resolved).to.be.true;
        expect(bet.won).to.be.false;

        const userBalance = await aiGambling.getBalance(user.address);
        expect(userBalance).to.equal(ethers.parseEther("0"));

        const wTx = await aiGambling.connect(user).withdraw()
        await wTx.wait()

        const userBalanceAfterWithdraw = await aiGambling.getBalance(user.address);
        expect(userBalanceAfterWithdraw).to.equal(0);
    });

    it("should update minimum bet amount", async function () {
        const newMinBetAmount = ethers.parseEther("0.05");
        await aiGambling.connect(owner).updateMinBetAmount(newMinBetAmount);

        expect(await aiGambling.minBetAmount()).to.equal(newMinBetAmount);
    });

    it("should update house fee percentage", async function () {
        const newHouseFeePercentage = 7;
        await aiGambling.connect(owner).updateHouseFeePercentage(newHouseFeePercentage);

        expect(await aiGambling.houseFeePercentage()).to.equal(newHouseFeePercentage);
    });

    it("should not allow non-owner to update settings", async function () {
        const newMinBetAmount = ethers.parseEther("0.05");
        await expect(aiGambling.connect(user).updateMinBetAmount(newMinBetAmount)).to.be.revertedWithCustomError(aiOracle, "OwnableUnauthorizedAccount");

        const newHouseFeePercentage = 7;
        await expect(aiGambling.connect(user).updateHouseFeePercentage(newHouseFeePercentage)).to.be.revertedWithCustomError(aiOracle, "OwnableUnauthorizedAccount");
    });
});