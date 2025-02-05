// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

abstract contract FeeCollector {
    address constant public feeCollectorAddress = 0xf1829676DB577682E944fc3493d451B67Ff3E29F;

    function collectFee(uint256 fee) internal {
        payable(feeCollectorAddress).transfer(fee);
    }
}
