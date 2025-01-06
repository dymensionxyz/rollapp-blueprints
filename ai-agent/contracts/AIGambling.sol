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
     * @dev Structure to represent a bet.
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
        bool resolved;
        bool won;
    }
    // Mapping to store bets by user address
    mapping(address => Bet) public bets;

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
            resolved: false,
            won: false
        });

        emit BetPlaced(msg.sender, msg.value, guessedNumber);
    }

    /**
     * @dev Function to resolve a bet. The user must call this function to resolve their bet.
     */
    function resolveBet() external {
        Bet storage bet = bets[msg.sender];
        require(!bet.resolved, "Bet already resolved");

        string memory correctNumberStr = aiOracle.getAnswer(bet.promptId);

        // TODO: Use OpenZeppelin's Strings.parseUint256 method after v5.2.0 is released.
        uint256 correctNumber = stringToUint(correctNumberStr);

        bet.resolved = true;

        if (bet.guessedNumber == correctNumber) {
            // Calculate the reward based on the bet amount and house fee percentage
            uint256 reward = (10 * bet.amount * (100 - houseFeePercentage)) / 100;
            bet.won = true;
            addBalance(msg.sender, reward);
            emit BetResult(msg.sender, bet.guessedNumber, correctNumber, true, reward);
        } else {
            emit BetResult(msg.sender, bet.guessedNumber, correctNumber, false, 0);
        }
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