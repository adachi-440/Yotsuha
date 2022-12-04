import { ethers, network } from "hardhat";
// NOTE: Change contract according to chain | https://docs.biconomy.io/misc/contract-addresses
const TRUSTED_FORWARDER_GOERLI = "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792";

async function main() {
  // deploy Bridge Contract
  const ConnextTest = await ethers.getContractFactory("ConnextTest");

  const chainId = network.config.chainId;

  if (chainId === undefined) {
    throw new Error("chainId invalid");
  }

  // deploy goerli
  // const connextTest = await ConnextTest.deploy("0xb35937ce4fFB5f72E90eAD83c10D33097a4F18D2");
  // deploy polygon
  const connextTest = await ConnextTest.deploy("0xa2F2ed226d4569C8eC09c175DDEeF4d41Bab4627",TRUSTED_FORWARDER_GOERLI);

  await connextTest.deployed();
  console.log(`ConnextTest deployed to ${connextTest.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
