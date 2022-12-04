// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ICrossChainRouter {
  function sendMessage(uint32 protocolId, uint32 dstChainId, uint256 relayerFee, address user, bytes memory callData) external;
}