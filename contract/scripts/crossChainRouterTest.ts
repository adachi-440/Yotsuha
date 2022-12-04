import { ethers, network } from "hardhat";

const SRC_CONTRACT = "0xf88F2e9126bF5af9a488c24cc3E3237158e0Fa87"
const DST_CONTRACT = "0xf0A4F7eA46BF0A10035cc327DD94b8cfFebEdF91"

async function main() {
  const crossChainRouter = await ethers.getContractAt("CrossChainRouterSample", SRC_CONTRACT);

  const chainId = network.config.chainId;

  if (chainId === undefined) {
    throw new Error("chainId invalid");
  }

  const callData = ethers.utils.defaultAbiCoder.encode(["string"], ["Hello World"]);
  console.log(callData)

  // const data = ethers.utils.defaultAbiCoder.encode(["address", "bytes"], [DST_CONTRACT, callData])

  // console.log(ethers.utils.defaultAbiCoder.decode(["address", "bytes"], data))

  const tx = await crossChainRouter.send(1, 80001, 0, DST_CONTRACT, { gasLimit: 2000000 });
  console.log('sending message...')
  const result = await tx.wait();
  console.log(result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
