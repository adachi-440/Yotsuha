import { ethers, network } from "hardhat";
import { getAddresses } from "../utils/const";
const TRUSTED_FORWARDER_GOERLI = "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792";

async function main() {
  // deploy Bridge Contract
  const [owner] = await ethers.getSigners()
  const NFTBridge = await ethers.getContractFactory("NFTBridge");

  const chainId = network.config.chainId;

  if (chainId === undefined) {
    throw new Error("chainId invalid");
  }

  const [router, inbox, domain] = getAddresses(chainId)

  const nftBridge = await NFTBridge.deploy(router, domain, TRUSTED_FORWARDER_GOERLI);

  await nftBridge.deployed();
  console.log(`NFTBridge deployed to ${nftBridge.address}`);

  // deploy SampleNFT
  if (chainId !== 5) {
    const SampleNFT = await ethers.getContractFactory("SampleNFT");
    const sampleNFT = await SampleNFT.deploy("0x96B8a6B425661De7daD9f114e32DC77628FB3882")
    await sampleNFT.deployed();
    console.log(`deploy NFT: ${sampleNFT.address}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
