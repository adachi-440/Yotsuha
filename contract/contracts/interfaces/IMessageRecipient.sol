// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IMessageRecipient {
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _messageBody
    ) external;
}
