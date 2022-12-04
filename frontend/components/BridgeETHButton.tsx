import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Button } from "@nextui-org/react";
import { Biconomy } from "@biconomy/mexa";
import React, { useEffect, useState } from "react";

import { ChainId, FeeQuote, GasLimit } from "@biconomy/core-types";
import { ethers } from "ethers";
import SocialLogin from "@biconomy/web3-auth";
import SmartAccount from "@biconomy/smart-account";
import { activeChainId } from "../utils/chainConfig";
import erc20ABI from "../abis/erc20.abi.json";
import fundMeABI from "../abis/fundMe.abi.json";
import stateChangeABI from "../abis/statechange.abi.json";
import contractABI from "../abis/contract.abi.json";
import { getContractAddress } from "ethers/lib/utils";
import { GOERLI_NFT_BRIDGE_ADDRESS } from "../utils/const";

let config = {
  contract: {
    address: GOERLI_NFT_BRIDGE_ADDRESS,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "_router",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "_domain",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "_trustedForwarder",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "uint32",
            name: "protocolId",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "destinationChainId",
            type: "uint32",
          },
          {
            internalType: "uint256",
            name: "gasFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "asset",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "address",
            name: "dstAsset",
            type: "address",
          },
        ],
        name: "bridge",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_inbox",
            type: "address",
          },
        ],
        name: "deployNFT",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "domain",
        outputs: [
          {
            internalType: "uint32",
            name: "",
            type: "uint32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getRouter",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getTrustedForwarder",
        outputs: [
          {
            internalType: "address",
            name: "forwarder",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "forwarder",
            type: "address",
          },
        ],
        name: "isTrustedForwarder",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "originalAssets",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "originalChainIds",
        outputs: [
          {
            internalType: "uint32",
            name: "",
            type: "uint32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "messageId",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "originChainId",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "originSender",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        name: "receiveMessage",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_router",
            type: "address",
          },
        ],
        name: "setRouter",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  },
  apiKey: {
    test: "cNWqZcoBb.4e4c0990-26a8-4a45-b98e-08101f754119",
    prod: "sCd7Ht3sK.e21885c4-5f31-469a-8e15-969e47ec7842",
  },
};

const BridgeETHButton: NextPage = () => {
  const SocialLoginDynamic = dynamic(
    () => import("../components/scw").then((res) => res.default),
    {
      ssr: false,
    }
  );

  function gaslessBridge() {}

  return (
    <div className={styles.container}>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <SocialLoginDynamic />
        </Suspense>
      </div>
    </div>
  );
};
export default BridgeETHButton;
