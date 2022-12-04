import { ethers, network } from "hardhat";
const TRUSTED_FORWARDER_GOERLI = "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792";

async function main() {
  // deploy Bridge Contract
  const CrossChainRouter = await ethers.getContractFactory("CrossChainRouterSample");

  const chainId = network.config.chainId;

  if (chainId === undefined) {
    throw new Error("chainId invalid");
  }

  // Goerli
  // const crossChainRouter = await CrossChainRouter.deploy("0x681b9C7155244b40F1b70CC65596d1C09e6feA3d");

  // Mumbai
  const crossChainRouter = await CrossChainRouter.deploy("0x830075B5b6BF18d1d94E0e1629301dfb932F7778");


  await crossChainRouter.deployed();
  console.log(`CrossChainRouterSample deployed to ${crossChainRouter.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
