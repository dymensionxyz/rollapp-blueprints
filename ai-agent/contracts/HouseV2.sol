// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {FeeCollector} from "./FeeCollector.sol";
import {Governance} from "./Governance.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * @title House
 * @dev A contract that represents a casino house. It holds the funds and
 * manages the balances of the players. Users can deposit and withdraw funds
 * from the house, which will change their internal balances.
 *
 * House is the base contract for all games in the casino. It provides the
 * basic functionality for managing earnings. Derived contracts could use
 * internal functions {addBalance} and {reduceBalance} to manage the balances
 * of the players.
 */
contract HouseV2 is OwnableUpgradeable, Governance {
    // Minimum bet amount
    uint256 public minBetAmount;

    // Maximum bet amount as a percentage of the house balance
    uint256 public maxBetAmountPercentage;

    // House fee percentage on winnings
    uint256 public houseFeePercentage;

    // Community pool percentage on winnings
    uint256 public communityPoolPercentage;

    // Mapping to store the balance of each player
    mapping(address => uint256) public balances;

    // Tracks the withdrawal balance – the balance the users might immediately
    // withdraw. The actual contract balance may be higher. The owner can only
    // withdraw the non-withdrawal balance: total - withdrawal.
    uint256 public withdrawalBalance;

    /**
     * @dev Initializes the contract setting the initial owner.
     * @param _initialOwner The address of the initial owner.
     */
    function __House_init(address _initialOwner) public initializer {
        OwnableUpgradeable.__Ownable_init(_initialOwner);

        minBetAmount = 0.01 ether;
        maxBetAmountPercentage = 1;
        houseFeePercentage = 5;
        communityPoolPercentage = 10;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    /**
     * @dev Allows the owner to deposit funds into the house.
     */
    function depositSupply() external payable {}

    /**
     * @dev Allows the owner to withdraw a specified amount from the contract.
     * @param amount The amount to withdraw.
     * @param receiver The address to receive the funds.
     */
    function withdrawSupply(uint256 amount, address receiver) external onlyOwner {
        require(amount <= activeBalance(), "House: insufficient non-withdrawal balance");
        payable(receiver).transfer(amount);
    }

    /**
     * @dev Allows users to deposit funds into the house. The deposited amount
     * is added to their internal balance.
     */
    function deposit() external payable {
        balances[msg.sender] += msg.value;
        withdrawalBalance += msg.value;
    }

    /**
     * @dev Allows users to withdraw their entire balance from the house. The
     * balance is reset to zero after withdrawal.
     */
    function withdraw() external {
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        withdrawalBalance -= amount;
        payable(msg.sender).transfer(amount);
    }

    /**
     * @dev Internal function to add a specified amount to a user's balance.
     * The function may be used by derived contracts to manage the balances of
     * the players.
     * @param user The address of the user.
     * @param amount The amount to add.
     */
    function addBalance(address user, uint256 amount) internal {
        require(address(this).balance >= withdrawalBalance + amount, "House: insufficient supply");
        balances[user] += amount;
        withdrawalBalance += amount;
    }

    /**
     * @dev Fallback function to accept Ether. This function is called when
     * Ether is sent to the contract.
     */
    receive() external payable {
        balances[msg.sender] += msg.value;
        withdrawalBalance += msg.value;
    }

    /**
     * @dev Internal function to reduce a specified amount from a user's balance.
     * The function may be used by derived contracts to manage the balances of
     * the players.
     * @param user The address of the user.
     * @param amount The amount to reduce.
     */
    function reduceBalance(address user, uint256 amount) internal {
        require(balances[user] >= amount, "House: insufficient balance");
        balances[user] -= amount;
        withdrawalBalance -= amount;
    }

    /**
     * @dev Returns the total active balance of the house.
     * @return The active balance.
     */
    function activeBalance() internal view returns (uint256) {
        return address(this).balance - withdrawalBalance;
    }

    /**
     * @dev Function to estimate the community fee based on the amount. The function temporarily
     * returns 0, as the community fee is not implemented yet.
     * @return The community fee.
     */
    function estimateCommunityFee(uint256 /*amount*/) public pure returns (uint256) {
        return 0; // currently no community fee
    }

    /**
     * @dev Function to calculate the maximum bet amount based on the house balance and the percentage.
     * @return The maximum bet amount.
     */
    function maxBetAmount() internal view returns (uint256) {
        return activeBalance() * maxBetAmountPercentage / 100;
    }

    /**
     * @dev Function to update the minimum bet amount. Only callable by the owner.
     * @param newAmount The new minimum bet amount.
     */
    function updateMinBetAmount(uint256 newAmount) external onlyGovernance {
        minBetAmount = newAmount;
    }

    /**
     * @dev Function to update the maximum bet amount percentage. Only callable by the owner.
     * @param newPercentage The new maximum bet amount percentage.
     */
    function updateMaxBetAmountPercentage(uint256 newPercentage) external onlyGovernance {
        maxBetAmountPercentage = newPercentage;
    }

    /**
     * @dev Function to update the house fee percentage. Only callable by the owner.
     * @param newPercentage The new house fee percentage.
     */
    function updateHouseFeePercentage(uint256 newPercentage) external onlyGovernance {
        houseFeePercentage = newPercentage;
    }

    /**
     * @dev Function to update the community pool percentage. Only callable by the owner.
     * @param newPercentage The new community pool percentage.
     */
    function updateCommunityPoolPercentage(uint256 newPercentage) external onlyGovernance {
        communityPoolPercentage = newPercentage;
    }
}
