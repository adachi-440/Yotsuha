import { Signature, Signer } from "ethers";
import { ethers, network } from "hardhat";

const SRC_CONTRACT = "0x37e55037DcCB1a7441d4CEA28D9ff1c749A2d325"
const DST_CONTRACT = "0x174E80B573EE2318152B04eDcD49dd4b327f7CC6"


async function main() {
  const connextTest = await ethers.getContractAt("ConnextTest", SRC_CONTRACT);

  const chainId = network.config.chainId;

  if (chainId === undefined) {
    throw new Error("chainId invalid");
  }

  const tx = await connextTest.xCall(9991, DST_CONTRACT, 0, 0, { gasLimit: 2000000 });
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
