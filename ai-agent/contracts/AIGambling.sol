// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {AIOracle} from "./AIOracle.sol";
import {House} from "./House.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AIGambling
 * @dev A contract for placing bets and resolving them using an AI system.
 * Inherits from the House contract to manage balances and the AIOracle contract to interact with the AI.
 */
contract AIGambling is House {
    /**
     * @dev Structure to represent a bet. If bet exists, then it is active.
     * Active bet may or may not be resolved.
     * @param promptId The ID of the prompt associated with the bet.
     * @param amount The amount of the bet.
     * @param guessedNumber The number guessed by the user.
     * @param resolved Whether the bet has been resolved.
     * @param won Whether the bet was won.
     */
    struct Bet {
        uint64 promptId;
        uint256 amount;
        uint256 guessedNumber;
        uint256 correctNumber;
        bool resolved;
        bool won;
        bool active;
    }
    // Mapping to store active bets by user address
    mapping(address => Bet) public bets;
    // Mapping to store the history of bets by user address
    mapping(address => Bet[]) public history;

    event BetPlaced(address indexed user, uint256 betAmount, uint256 guessedNumber);
    event BetResult(address indexed user, uint256 guessedNumber, uint256 correctNumber, bool won, uint256 reward);

    // Instance of the AIOracle contract
    AIOracle private aiOracle;

    // Minimum bet amount
    uint256 public minBetAmount = 0.01 ether;

    // Maximum bet amount as a percentage of the house balance
    uint256 public maxBetAmountPercentage = 1;

    // House fee percentage on winnings
    uint256 public houseFeePercentage = 5;

    /**
     * @dev Structure to represent the game information.
     * @param houseSupply The total supply of the house.
     * @param houseActiveBalance The active balance of the house.
     * @param minBetAmount The minimum bet amount.
     * @param maxBetAmount The maximum bet amount.
     * @param maxBetAmountPercentage The maximum bet amount as a percentage of the house balance.
     * @param houseFeePercentage The house fee percentage on winnings.
     */
    struct GameInfo {
        uint256 houseSupply;
        uint256 houseActiveBalance;
        uint256 minBetAmount;
        uint256 maxBetAmount;
        uint256 maxBetAmountPercentage;
        uint256 houseFeePercentage;
    }

    // Constant prompt to be sent to the AI system
    string public constant PROMPT = "Generate a number between 1 and 10, inclusive";

    /**
     * @dev Constructor to initialize the contract with the initial owner and AIOracle address.
     * @param _initialOwner The address of the initial owner.
     * @param _aiOracle The address of the AIOracle contract.
     */
    constructor(address _initialOwner, address _aiOracle) House(_initialOwner) {
        require(_aiOracle != address(0), "Invalid AIOracle address");
        aiOracle = AIOracle(_aiOracle);
    }

    /**
     * @dev Function to place a bet. The user must send Ether with this transaction.
     * @param guessedNumber The number guessed by the user.
     */
    function placeBet(uint256 guessedNumber) external payable {
        require(bets[msg.sender].amount == 0 || bets[msg.sender].resolved, "Resolve your current bet first");
        require(msg.value >= minBetAmount, "Bet amount is too low");
        require(msg.value <= address(this).balance * maxBetAmountPercentage / 100, "Bet amount is too high");

        uint64 promptId = aiOracle.submitPrompt(PROMPT);

        bets[msg.sender] = Bet({
            promptId: promptId,
            amount: msg.value,
            guessedNumber: guessedNumber,
            correctNumber: 0,
            resolved: false,
            won: false,
            active: true
        });

        emit BetPlaced(msg.sender, msg.value, guessedNumber);
    }

    /**
     * @dev Function to resolve a bet. The user must call this function to resolve their bet.
     */
    function resolveBet() external {
        Bet memory bet = bets[msg.sender];
        require(!bet.resolved, "Bet already resolved");

        string memory correctNumberStr = aiOracle.getAnswer(bet.promptId);

        // TODO: Use OpenZeppelin's Strings.parseUint256 method after v5.2.0 is released.
        uint256 correctNumber = stringToUint(correctNumberStr);

        bet.resolved = true;
        bet.correctNumber = correctNumber;

        uint256 reward = 0;
        if (bet.guessedNumber == correctNumber) {
            // We generate a number between 1 and 10, inclusive. So the win chance is 1 of 10.
            // The reward multiplier is 10 minus the house fee percentage F.
            // So the reward is 10B - F, where B is a bet amount.
            reward = (10 * bet.amount * (100 - houseFeePercentage)) / 100;
            bet.won = true;
            addBalance(msg.sender, reward);
        }

        // Store the bet in the history and reset the active bet
        history[msg.sender].push(bet);
        delete bets[msg.sender];

        emit BetResult(msg.sender, bet.guessedNumber, correctNumber, bet.won, reward);
    }

    /**
     * @dev Internal function to convert a string to a uint256.
     * @param s The string to convert.
     * @return The converted uint256 value.
     */
    function stringToUint(string memory s) internal pure returns (uint256) {
        bytes memory b = bytes(s);
        uint256 result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            require(b[i] >= 0x30 && b[i] <= 0x39, "Invalid character in string");
            result = result * 10 + (uint256(uint8(b[i])) - 48);
        }
        return result;
    }

    /**
     * @dev Function to get the bet history of a user.
     * @param user The address of the user.
     * @return The bet history of the user.
     */
    function getBetHistory(address user) external view returns (Bet[] memory) {
        return history[user];
    }

    /**
     * @dev Function to get the game information.
     * @return The game information.
     */
    function getGameInfo() external view returns (GameInfo memory) {
        return GameInfo({
            houseSupply: address(this).balance,
            houseActiveBalance: activeBalance,
            minBetAmount: minBetAmount,
            maxBetAmount: address(this).balance * maxBetAmountPercentage / 100,
            maxBetAmountPercentage: maxBetAmountPercentage,
            houseFeePercentage: houseFeePercentage
        });
    }

    /**
     * @dev Function to update the minimum bet amount. Only callable by the owner.
     * @param newAmount The new minimum bet amount.
     */
    function updateMinBetAmount(uint256 newAmount) external onlyOwner {
        minBetAmount = newAmount;
    }

    /**
     * @dev Function to update the house fee percentage. Only callable by the owner.
     * @param newPercentage The new house fee percentage.
     */
    function updateHouseFeePercentage(uint256 newPercentage) external onlyOwner {
        houseFeePercentage = newPercentage;
    }
}