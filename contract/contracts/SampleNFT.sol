// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWrappedNFT.sol";

contract SampleNFT is ERC721URIStorage, IWrappedNft, Ownable {
    address public immutable bridge;
    constructor(address _bridge) ERC721("SimpleNFT", "SNFT") {
        bridge = _bridge;
    }

    function mint(
        address _to,
        uint256 _tokenId,
        string memory _tokenUri
    ) public {
        _safeMint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenUri);
    }

    function burn(uint256 _tokenId) public {
        _burn(_tokenId);
    }

    function getTokenURI(uint256 tokenId) public view virtual returns (string memory) {
        return tokenURI(tokenId);
    }

    modifier onlyInbox() {
      require(_msgSender() == bridge);
      _;
  }
}
