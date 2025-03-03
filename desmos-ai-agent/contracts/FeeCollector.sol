// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

abstract contract FeeCollector {
    address public dividendsCollectorAddress;

    function collectFee(uint256 fee) internal {
        payable(dividendsCollectorAddress).transfer(fee);
    }
}
