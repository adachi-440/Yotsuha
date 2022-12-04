// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IOutbox {
    function dispatch(
        uint32 _destinationDomain,
        bytes32 _recipientAddress,
        bytes calldata _messageBody
    ) external returns (uint256);
}
