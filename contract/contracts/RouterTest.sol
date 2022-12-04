// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@routerprotocol/router-crosstalk/contracts/RouterCrossTalk.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RouterTest is RouterCrossTalk, Ownable {

  string text;
  uint256 public nonce;
  mapping(uint256 => bytes32) public nonceToHash;

  struct RouterLinker {
    address _rSyncContract;
    uint8 _chainID;
    address _linkedContract;
  }

  constructor(address _genericHandler) RouterCrossTalk(_genericHandler){}

  function sendMessage(
        uint8 _chainID,
        uint256 _crossChainGasLimit,
        uint256 _crossChainGasPrice
    ) external returns (bool) {
        nonce = nonce + 1;
        bytes memory callData = abi.encode("Hello world");
        bytes4 _selector = bytes4(keccak256("setText(string)"));
        (bool success, bytes32 hash) = routerSend(
            _chainID,
            _selector,
            callData,
            _crossChainGasLimit,
            _crossChainGasPrice
        );
        nonceToHash[nonce] = hash;
        require(success == true, "unsuccessful");
        return success;
  }

  function setText(string memory _text) external {
    text = _text;
  }

  function _routerSyncHandler(bytes4 _selector, bytes memory _data)
    internal
    override
    returns (bool, bytes memory)
  {
    string memory _greeting = abi.decode(_data, (string));
    (bool success, bytes memory data) = address(this).call(
      abi.encodeWithSelector(_selector, _greeting)
    );
    return (success, data);
  }

  function MapContract(RouterLinker calldata linker) external {
        iRouterCrossTalk crossTalk = iRouterCrossTalk(linker._rSyncContract);
        require(
            msg.sender == crossTalk.fetchLinkSetter(),
            "Router Generic Handler : Only Link Setter can map contracts"
        );
        crossTalk.Link(linker._chainID, linker._linkedContract);
  }

  function setLinker ( address _linker ) external onlyOwner {
    // Calling the setLink function of the RouterCrossTalk Contract
    setLink(_linker);
  }

  function setFeesToken(address _feeToken) external onlyOwner {
    setFeeToken(_feeToken);
  }

  function _approveFees(address _feeToken, uint256 _value)
    external
    onlyOwner
  {
    approveFees(_feeToken, _value);
  }
}
