// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IReceiver.sol";
import "./interfaces/ICrossChainRouter.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract CrossChainRouterSample is IReceiver {
  address public router;

  event Receive(bytes32 messageId, uint32 originChainId, address originSender);

  constructor(address _router) {
    router = _router;
  }

  function send(uint32 protocolId, uint32 dstChainId, uint256 relayerFee, address user) public {
    bytes memory callData = abi.encode("Hello World");
    ICrossChainRouter(router).sendMessage(protocolId, dstChainId, relayerFee, user, callData);
  }

  function receiveMessage(bytes32 messageId, uint32 originChainId, address originSender, bytes memory callData) public {
    // string memory text = abi.decode(callData, (string));
    emit Receive(messageId, originChainId, originSender);
  }
}
