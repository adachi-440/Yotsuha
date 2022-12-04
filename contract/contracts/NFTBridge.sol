// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IOutbox.sol";
import "./interfaces/IInterchainGasPaymaster.sol";
import "./interfaces/IWrappedNFT.sol";
import "./interfaces/IReceiver.sol";
import "./interfaces/ICrossChainRouter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@opengsn/contracts/src/ERC2771Recipient.sol";
import "./SampleNFT.sol";

contract NFTBridge is IReceiver, Ownable, ERC2771Recipient {

  mapping(address => uint32) public originalChainIds;
  mapping(address => address) public originalAssets;

  // address public immutable outbox;
  // address public immutable inbox;
  // address public immutable gasPaymaster;
  address private router;
  uint32 public immutable domain;


  constructor(address _router, uint32 _domain, address _trustedForwarder){
    // outbox = _outbox;
    // inbox = _inbox;
    router = _router;
    domain = _domain;
    _setTrustedForwarder(_trustedForwarder);
  }

  function bridge(uint32 protocolId, uint32 destinationChainId, uint256 gasFee, uint256 tokenId, address asset, address to, address dstAsset) external {
    address currentHolder = _msgSender();

    uint32 originalChainid;
    string memory tokenURI;
    if(originalChainIds[asset] == 0) {
      // lock NFT
      IERC721Metadata(asset).transferFrom(currentHolder, address(this), tokenId);
      originalChainid = uint32(block.chainid);
      tokenURI = IERC721Metadata(asset).tokenURI(tokenId);
    } else {
      // burn NFT
      IWrappedNft(asset).burn(tokenId);
      originalChainid = originalChainIds[asset];
      tokenURI = "";
    }
    ICrossChainRouter(router).sendMessage(protocolId, destinationChainId, gasFee, to, abi.encode(tokenURI, tokenId, originalChainid, currentHolder, dstAsset));
  }

  function receiveMessage(bytes32 messageId, uint32 originChainId, address originSender, bytes memory callData) external {
      (string memory tokenURI, uint256 tokenId, uint32 originalChainid, address currentHolder, address asset) = abi.decode(callData, (string, uint256, uint32, address, address));
      if(originalChainid != convertChainId(domain)) {
        // mint NFT
        originalChainIds[asset] = originalChainid;
        IWrappedNft(asset).mint(currentHolder, tokenId, tokenURI);
      } else {
        // unlock NFT
        IERC721Metadata(asset).safeTransferFrom(address(this), currentHolder, tokenId);
      }
  }

  function deployNFT(address _inbox) external onlyOwner returns (address){
    return address(new SampleNFT(address(this)));
  }

  function addressToBytes32(address _addr) internal pure returns (bytes32) {
    return bytes32(uint256(uint160(_addr)));
  }

  function bytes32ToAddress(bytes32 _buf) internal pure returns (address) {
      return address(uint160(uint256(_buf)));
  }

  function setRouter(address _router) external onlyOwner {
    router = _router;
  }

  function getRouter() external view returns (address) {
    return router;
  }

  function convertChainId(uint32 _domain) internal pure returns (uint32) {
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

  function _msgSender() internal view virtual override(ERC2771Recipient,Context) returns (address sender) {
        if (isTrustedForwarder(msg.sender)) {
            // The assembly code is more direct than the Solidity version using `abi.decode`.
            /// @solidity memory-safe-assembly
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        } else {
            return super._msgSender();
        }
    }

    function _msgData() internal view virtual override(ERC2771Recipient,Context) returns (bytes calldata) {
        if (isTrustedForwarder(msg.sender)) {
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }

  // modifier onlyInbox() {
  //     require(_msgSender() == inbox);
  //     _;
  // }
}
