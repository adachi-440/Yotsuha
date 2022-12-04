import { ethers, network } from "hardhat";
import { getAddressesForCrossChainRoter } from "../utils/const";


/*
  NOTE: deploy step
  1. deploy CrossChainRouter
  2. set receivers
  3. deploy CrossChainRouterSample
  4. test CrossChainRouterSample
*/

async function main() {
  // deploy Bridge Contract
  const CrossChainRouter = await ethers.getContractFactory("CrossChainRouter");

  const chainId = network.config.chainId;

  if (chainId === undefined) {
    throw new Error("chainId invalid");
  }

  const [connext, outbox, gasPaymaster] = getAddressesForCrossChainRoter(chainId)

  const crossChainRouter = await CrossChainRouter.deploy(connext, outbox, gasPaymaster);

  await crossChainRouter.deployed();
  console.log(`CrossChainRouter deployed to ${crossChainRouter.address}`);

  const CrossChainReceiveAdapter = await ethers.getContractFactory("CrossChainReceiveAdapter");
  const receiver = await CrossChainReceiveAdapter.deploy();
  await receiver.deployed();
  console.log(`Receiver deployed to ${receiver.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
