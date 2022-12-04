import { ethers, network } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  // deploy Bridge Contract
  const RouterTest = await ethers.getContractFactory("RouterTest");

  const chainId = network.config.chainId;

  if (chainId === undefined) {
    throw new Error("chainId invalid");
  }

  const [handler, feeToken] = getAddresses(chainId)

  const routerTest = await RouterTest.deploy(handler);

  await routerTest.deployed();
  console.log(`Router deployed to ${routerTest.address}`);

  let tx = await routerTest.setLinker(owner.address);
  console.log('setting linker...')
  await tx.wait()

  tx = await routerTest.setFeesToken(feeToken);
  console.log('setting fee token...')
  await tx.wait()

}

const getAddresses = (chainId: number) => {
  if (chainId === 5) {
    // handler / WETH
    return ["0xDE1CC4c8a3026ad79BA6104333bED630B23210cd", "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"]
  } else {
    // handler / WMATIC
    return ["0x50EED4491Eb4634E0ef53751cF280417829Db45E", "0x6373c962DCFfc21465973150993E19F56d8640a4"]
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
