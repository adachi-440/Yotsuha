// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/ICrossChainRouter.sol";
import "./interfaces/IOutbox.sol";
import "./interfaces/IInterchainGasPaymaster.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnext.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";


contract CrossChainRouter is Ownable, ICrossChainRouter {

  address public constant CONNEXT_ASSET_FOR_NONE = address(0x0);
  uint256 public constant CONNEXT_AMOUNT_FOR_NONE = 0;

  // connext address
  address public immutable connext;

  // hyperlane address
  address public immutable outbox;
  address public immutable gasPaymaster;

  // receiver address
  mapping(uint32 => address) private receivers;

  constructor (address _connext, address _outbox, address _gasPaymaster) {
    connext = _connext;
    outbox = _outbox;
    gasPaymaster = _gasPaymaster;
  }

  function sendMessage(uint32 protocolId, uint32 dstChainId, uint256 relayerFee, address user, bytes memory callData) external {
    bytes memory data = encodeReceiver(callData, user);
    address receiver = receivers[dstChainId];

    if(protocolId == 1) {
      require(outbox != address(0x0), "Invalid protocol");
      _sendByHyperlane(dstChainId, data, receiver);
    } else if(protocolId == 2) {
      require(connext != address(0x0), "Invalid protocol");
      _sendByConnext(dstChainId, relayerFee, data, receiver);
    } else {
      require(outbox != address(0x0), "Invalid protocol");
      _sendByHyperlane(dstChainId, data, receiver);
    }
  }

  function _sendByHyperlane(uint32 dstChainId, bytes memory callData, address receiver) internal {
    console.log("sendByHyperlane dstChainId %s receiver %s", dstChainId, receiver);

    bytes32 recipient = addressToBytes32(receiver);
    uint32 destinationDomain = convertChainIdToHyperlaneDomain(dstChainId);
    IOutbox(outbox).dispatch(destinationDomain, recipient, callData);
  }

  function _sendByConnext(uint32 dstChainId, uint256 relayerFee, bytes memory callData, address receiver) internal {
    uint32 destinationDomain = convertChainIdToConnextDomain(dstChainId);
    IConnext(connext).xcall{value: relayerFee}(
        destinationDomain,
        receiver,
        CONNEXT_ASSET_FOR_NONE,
        _msgSender(),
        CONNEXT_AMOUNT_FOR_NONE,
        CONNEXT_AMOUNT_FOR_NONE,
        callData
      );
  }

  function setReceiver(address _receiver, uint32 _chainId) external onlyOwner {
    receivers[_chainId] = _receiver;
  }

  function getReceiver(uint32 _chainId) external view returns (address) {
    return receivers[_chainId];
  }

  function addressToBytes32(address _addr) internal pure returns (bytes32) {
    return bytes32(uint256(uint160(_addr)));
  }

  function convertChainIdToHyperlaneDomain(uint32 _dstChainId) internal pure returns (uint32) {
    if(_dstChainId == 5) {
      return _dstChainId;
    } else if(_dstChainId == 80001) {
      return _dstChainId;
    } else if(_dstChainId == 1287) {
      return 0x6d6f2d61;
    } else {
      return 0;
    }
  }

  function convertChainIdToConnextDomain(uint32 _dstChainId) internal pure returns (uint32) {
    if(_dstChainId == 5) {
      return 1735353714;
    } else if(_dstChainId == 80001) {
      return 9991;
    } else {
      return 0;
    }
  }

  function encodeReceiver(bytes memory callData, address user) internal pure returns (bytes memory) {
    bytes memory data = abi.encode(user, callData);
    return data;
  }
}
