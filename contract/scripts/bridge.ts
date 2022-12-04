import { ethers } from "hardhat";

const GOERLI_NFT_BRIDGE_ADDRESS = "0x79e99a3Ef76E7c05EFcb0EDEaE4bb2322Cb33f94";
const MUMBAI_NFT_BRIDGE_ADDRESS = "0x9eE5222838411D69b24114F5Cc7f3045cff5B0Fa";
const MOONBASE_NFT_BRIDGE_ADDRESS = "0x1DC42E9Fbf9EE5Ce1A19fF304256e048358E2E6c"
const GOERLI_NFT_ADDRESS = "0xb91876637e407b75Fc5da1a81114Db68F4851932";
const MUMBAI_NFT_ADDRESS = "0x96C106F735197e1B5027711189AC2bCa01eA3d78";
const MOONBASE_NFT_ADDRESS = "0x82B99Fd37956720bFF7EdAfB7CA2137018A15635";
const TOKEN_ID = 5567; // 5568

// NFT mint → Goerli to Mumbai
// NFT burn → Mumbai to Goerli
async function main() {
  const [owner] = await ethers.getSigners();
  const srcChain = await owner.getChainId();

  const [srcNFTbridgeAddress, dstNFTbridgeAddress, srcNFTAddress, dstNFTAddress, dstChain]: [string, string, string, string, number | string] = getContractData(srcChain)

  const nftBridge = await ethers.getContractAt("NFTBridge", srcNFTbridgeAddress);

  const targetNFT = new ethers.Contract(
    srcNFTAddress,
    [
      "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
      "function approve(address to, uint256 tokenId) public",
      "function getTokenURI(uint256 tokenId) public view returns (string memory)",
      "function ownerOf(uint256 tokenId) public view returns (address)",
      "function setApprovalForAll(address operator, bool _approved) public"
    ],
    owner
  );

  // const r = await targetNFT.getTokenURI(TOKEN_ID);
  // console.log(r)

  const token_id = TOKEN_ID;

  // let estimation = await targetNFT.estimateGas.approve(srcNFTbridgeAddress, token_id);
  // console.log(ethers.utils.formatEther(estimation))

  // const approveTx = await targetNFT.setApprovalForAll(srcNFTbridgeAddress, token_id);
  // console.log('approving...')
  // await approveTx.wait();
  // console.log('complete approve')

  // const r = await nftBridge.originalChainIds(srcNFTAddress);
  // console.log(r)
  const r = await nftBridge.originalChainIds(srcNFTAddress)

  console.log(r)

  // const tx = await nftBridge.bridge(1, dstChain, 0, token_id, srcNFTAddress, dstNFTbridgeAddress, dstNFTAddress, { gasLimit: 2000000 });
  // console.log('sending message...')
  // const result = await tx.wait();
  // console.log(result);
}

const getContractData = (chainId: number): [string, string, string, string, number] => {
  if (chainId === 5) {
    return [GOERLI_NFT_BRIDGE_ADDRESS, MOONBASE_NFT_BRIDGE_ADDRESS, GOERLI_NFT_ADDRESS, MOONBASE_NFT_ADDRESS, 1287]
  } else if (chainId === 80001) {
    return [MUMBAI_NFT_BRIDGE_ADDRESS, GOERLI_NFT_BRIDGE_ADDRESS, MUMBAI_NFT_ADDRESS, GOERLI_NFT_ADDRESS, 5]
  } else {
    return [MOONBASE_NFT_BRIDGE_ADDRESS, GOERLI_NFT_BRIDGE_ADDRESS, MOONBASE_NFT_ADDRESS, GOERLI_NFT_ADDRESS, 5]
  }
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
