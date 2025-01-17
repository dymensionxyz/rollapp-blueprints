// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

abstract contract Governance {
    address constant public govAddress = 0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2;

    modifier onlyGovernance() {
        require(msg.sender == govAddress, "Governance: caller is not the governance");
        _;
    }
}
