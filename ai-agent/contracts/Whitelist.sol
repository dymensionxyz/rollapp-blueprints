// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Whitelist
 * @dev A contract that manages a whitelist of authorized accounts.
 * Only the owner can add or remove accounts from the whitelist.
 */
contract Whitelist is Ownable {
    mapping(address => bool) private whitelist;

    error WhitelistUnauthorizedAccount(address account);
    event AddWhitelisted(address indexed account);
    event RemoveWhitelisted(address indexed account);

    /**
     * @dev Constructor that sets the initial owner of the contract.
     * @param initialOwner The address of the initial owner.
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Modifier to make a function callable only by whitelisted accounts.
     */
    modifier onlyWhitelisted() {
        require(isWhitelisted(msg.sender), WhitelistUnauthorizedAccount(msg.sender));
        _;
    }

    /**
     * @dev Adds an account to the whitelist. Only callable by the owner.
     * @param _address The address to be added to the whitelist.
     */
    function addWhitelisted(address _address) public onlyOwner {
        whitelist[_address] = true;
        emit AddWhitelisted(_address);
    }

    /**
     * @dev Removes an account from the whitelist. Only callable by the owner.
     * @param _address The address to be removed from the whitelist.
     */
    function removeWhitelisted(address _address) public onlyOwner {
        whitelist[_address] = false;
        emit RemoveWhitelisted(_address);
    }

    /**
     * @dev Checks if an account is whitelisted.
     * @param _address The address to check.
     * @return True if the account is whitelisted, false otherwise.
     */
    function isWhitelisted(address _address) public view returns(bool) {
        return whitelist[_address];
    }
}