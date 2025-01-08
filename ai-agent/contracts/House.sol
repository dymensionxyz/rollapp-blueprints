// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

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
contract House is Ownable {
    // Mapping to store the balance of each player
    mapping(address => uint256) private balances;

    // Tracks the total "active" balance – the balance used by users in the games.
    // The actual contract balance may be higher due to the owner's supply.
    // The owner can only withdraw the "inactive" balance: total - "active".
    uint256 public activeBalance;

    /**
     * @dev Constructor that sets the initial owner of the contract.
     * @param initialOwner The address of the initial owner.
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Allows the owner to deposit funds into the house.
     */
    function depositSupply() external payable onlyOwner {}

    /**
     * @dev Allows the owner to withdraw a specified amount from the contract.
     * @param amount The amount to withdraw.
     */
    function withdrawSupply(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance - activeBalance, "House: insufficient inactive balance");
        payable(msg.sender).transfer(amount);
    }

    /**
     * @dev Allows users to deposit funds into the house. The deposited amount
     * is added to their internal balance.
     */
    function deposit() external payable {
        balances[msg.sender] += msg.value;
        activeBalance += msg.value;
    }

    /**
     * @dev Allows users to withdraw their entire balance from the house. The
     * balance is reset to zero after withdrawal.
     */
    function withdraw() external {
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        activeBalance -= amount;
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
        require(address(this).balance >= activeBalance + amount, "House: insufficient balance");
        balances[user] += amount;
        activeBalance += amount;
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
        activeBalance -= amount;
    }

    /**
     * @dev Returns the balance of a specified user.
     * @param user The address of the user.
     * @return The balance of the user.
     */
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    /**
     * @dev Returns the total supply of the house.
     */
    function houseSupply() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Returns the total active balance of the house.
     */
    function houseActiveBalance() external view returns (uint256) {
        return activeBalance;
    }

    /**
     * @dev Fallback function to accept Ether. This function is called when
     * Ether is sent to the contract.
     */
    receive() external payable {
        balances[msg.sender] += msg.value;
        activeBalance += msg.value;
    }
}
