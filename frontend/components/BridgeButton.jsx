import { Button } from "@nextui-org/react";
import { ethers } from "ethers";
import { NextPage } from "next";
import { getContractData } from "../utils/const";
import { erc721ABI, useConnect, useContract, useSigner } from "wagmi";
import bridgeABI from "../abis/contract.abi.json";

const BridgeButton = () => {
  const { data: signer, isError, isLoading } = useSigner();

  const bridge = async (tokenId) => {
    const [srcBridge, srcNFT] = getContractData(5);
    const [dstBridge, dstNFT] = getContractData(80001);

    const contract = useContract({
      address: srcNFT,
      abi: erc721ABI,
      signerOrProvider: signer,
    });

    const bridgeContract = useContract({
      address: srcBridge,
      abi: bridgeABI,
      signerOrProvider: signer,
    });

    let tx = await contract?.approve(srcBridge, tokenId);
    await tx?.wait();

    tx = await bridgeContract?.bridge(1, 80001, srcNFT, dstBridge, dstNFT);
  };
  return (
    <>
      <Button onClick={() => bridge(5)}>Bridge</Button>
    </>
  );
};

export default BridgeButton;
