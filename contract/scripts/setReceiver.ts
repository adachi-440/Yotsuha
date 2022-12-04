import { ethers, network } from "hardhat";

const SRC_CONTRACT = "0x96C106F735197e1B5027711189AC2bCa01eA3d78"
const RECEIVERS = [{ chainId: 5, address: "0xd2221Be425107B98bac0e0488a527640dC185D17" }, { chainId: 80001, address: "0x72E06B75b78A5E3652D2524fF1602ecb5427e19e" }, { chainId: 1287, address: "0x021f80ef75D1A3DE000a78C12124EDB24E6707c7" }]

async function main() {
  const router = await ethers.getContractAt("CrossChainRouter", SRC_CONTRACT);

  const chainId = network.config.chainId;

  if (chainId === undefined) {
    throw new Error("chainId invalid");
  }

  for (let index = 0; index < RECEIVERS.length; index++) {
    const receiver = RECEIVERS[index];
    if (chainId !== receiver.chainId) {
      const tx = await router.setReceiver(receiver.address, receiver.chainId, { gasLimit: 10000000 });
      console.log('setting  receiver...')
      await tx.wait()
      console.log('complete set');
      await sleep(1000)
    }
  }

  // const receiver = RECEIVERS[1];
  // const tx = await router.setReceiver(receiver.address, receiver.chainId);
  // console.log('setting  receiver...')
  // await tx.wait()
  // console.log('complete set');
  // await sleep(1000)
}

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
