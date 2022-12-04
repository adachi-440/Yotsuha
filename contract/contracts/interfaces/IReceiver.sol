// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IReceiver {
  function receiveMessage(bytes32 messageId, uint32 originChainId, address originSender, bytes memory callData) external;
}