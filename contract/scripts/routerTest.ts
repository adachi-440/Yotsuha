import { ethers, network } from "hardhat";
import { RouterTest } from "../typechain-types";

const SRC_CONTRACT = "0x70f135Ee911e1a3c3fd4F82315F896a808a61362"
const DST_CONTRACT = "0x4dc0d58fa313C30Dabba80ad3c1DC8F04DfB37AE"

// NOTE: it doesn't work
async function main() {
  const routerTest = await ethers.getContractAt("RouterTest", SRC_CONTRACT);

  const chainId = network.config.chainId;

  if (chainId === undefined) {
    throw new Error("chainId invalid");
  }

  let tx;

  // WETH
  tx = await routerTest._approveFees("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", "1000000000000000000000000", {
    gasLimit: 2000000,
  });
  console.log('approving...')
  await tx.wait()

  tx = await routerTest.sendMessage(1, 100000, 50000000000
    , { gasLimit: 2000000 });
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
