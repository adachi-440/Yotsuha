// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


interface IWrappedNft {
  function mint(address to, uint256 tokenId, string memory tokenURI) external;
  function burn(uint256 tokenId) external;
  function getTokenURI(uint256 tokenId) external view returns (string memory);
}
