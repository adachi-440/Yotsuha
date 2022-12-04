// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IInterchainGasPaymaster {
  function payGasFor(
      address _outbox,
      uint256 _messageId,
      uint32 _destinationDomain
  ) external payable;
}
