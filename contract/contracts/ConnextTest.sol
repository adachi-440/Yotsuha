// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnext.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IXReceiver.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract ConnextTest is IXReceiver{
  address public connext;

  address public constant CONNEXT_ASSET_FOR_NONE = address(0x0);
  uint256 public constant CONNEXT_AMOUNT_FOR_NONE = 0;

  event ConnextTest(bytes32 transferId, string text);

  constructor(address _connext) {
    connext = _connext;
  }

  function xCall(uint32 destination, address recipient, uint256 relayerFee, uint256 slippage) external payable returns(bytes32){
    bytes memory callData = abi.encode("Hello world");

    return IConnext(connext).xcall{value: relayerFee}(
        destination,
        recipient,
        CONNEXT_ASSET_FOR_NONE,
        msg.sender,
        CONNEXT_AMOUNT_FOR_NONE,
        slippage,
        callData
      );
  }

  function xReceive(
    bytes32 _transferId,
    uint256 _amount,
    address _asset,
    address _originSender,
    uint32 _origin,
    bytes memory _callData
  ) external returns (bytes memory) {
    string memory text = abi.decode(_callData, (string));
    emit ConnextTest(_transferId, text);
  }
}
