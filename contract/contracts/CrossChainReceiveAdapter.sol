// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IMessageRecipient.sol";
import "./interfaces/ICrossChainRouter.sol";
import "./interfaces/IReceiver.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import {IXReceiver} from "@connext/nxtp-contracts/contracts/core/connext/interfaces/IXReceiver.sol";

contract CrossChainReceiveAdapter is IMessageRecipient, IXReceiver {

  // Hyperlane
  function handle(
    uint32 _origin,
    bytes32 _sender,
    bytes memory _message
  ) external {
    // format data
    address sender = bytes32ToAddress(_sender);
    (address receiver, bytes memory callData) = decodeReceiver(_message);
    IReceiver(receiver).receiveMessage(_sender, convertHyperlaneDomainToChainId(_origin), sender, callData);
  }

  // Connext
  function xReceive(
    bytes32 _transferId,
    uint256 _amount,
    address _asset,
    address _originSender,
    uint32 _origin,
    bytes memory _callData
  ) external returns (bytes memory) {
    // format data
    (address receiver, bytes memory callData) = decodeReceiver(_callData);
    IReceiver(receiver).receiveMessage(_transferId, convertConnextDomainToChainId(_origin), _originSender, callData);
  }

  // Router

  function bytes32ToAddress(bytes32 _buf) internal pure returns (address) {
      return address(uint160(uint256(_buf)));
  }

  function convertHyperlaneDomainToChainId(uint32 _domain) internal pure returns (uint32) {
    if(_domain == 5) {
      return _domain;
    } else if(_domain == 80001) {
      return _domain;
    } else if(_domain == 0x6d6f2d61) {
      return 1287;
    } else {
      return 0;
    }
  }

  function convertConnextDomainToChainId(uint32 _domain) internal pure returns (uint32) {
    if(_domain == 1735353714) {
      return 5;
    } else if(_domain == 9991) {
      return 80001;
    } else {
      return 0;
    }
  }

  function decodeReceiver(bytes memory callData) internal pure returns (address, bytes memory) {
    (address receiver, bytes memory data) = abi.decode(callData, (address, bytes));
    return (receiver, data);
  }
}
