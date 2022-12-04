import styles from "../styles/Home.module.css";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import SocialLogin from "@biconomy/web3-auth";
import SmartAccount from "@biconomy/smart-account";
import contractABI from "../abis/contract.abi.json";
import erc721ABI from "../abis/erc721.abi.json";
import { Button } from "@nextui-org/react";
import {
  GOERLI_NFT_ADDRESS,
  GOERLI_NFT_BRIDGE_ADDRESS,
  MUMBAI_NFT_ADDRESS,
  MUMBAI_NFT_BRIDGE_ADDRESS,
} from "../utils/const";

const Home = () => {
  const bridgeAddress = GOERLI_NFT_BRIDGE_ADDRESS;
  const [provider, setProvider] = useState<any>();
  const [account, setAccount] = useState<string>();
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);
  const [scwAddress, setScwAddress] = useState("");
  const [scwLoading, setScwLoading] = useState(false);
  const [socialLoginSDK, setSocialLoginSDK] = useState<SocialLogin | null>(
    null
  );

  const connectWeb3 = useCallback(async () => {
    if (typeof window === "undefined") return;
    console.log("socialLoginSDK", socialLoginSDK);
    if (socialLoginSDK?.provider) {
      const web3Provider = new ethers.providers.Web3Provider(
        socialLoginSDK.provider
      );
      setProvider(web3Provider);
      const accounts = await web3Provider.listAccounts();
      setAccount(accounts[0]);
      return;
    }
    if (socialLoginSDK) {
      socialLoginSDK.showWallet();
      return socialLoginSDK;
    }
    const sdk = new SocialLogin();
    await sdk.init(ethers.utils.hexValue(80001));
    setSocialLoginSDK(sdk);
    sdk.showConnectModal();
    sdk.showWallet();
    return socialLoginSDK;
  }, [socialLoginSDK]);

  // if wallet already connected close widget
  useEffect(() => {
    console.log("hidelwallet");
    if (socialLoginSDK && socialLoginSDK.provider) {
      socialLoginSDK.hideWallet();
    }
  }, [account, socialLoginSDK]);

  // after metamask login -> get provider event
  useEffect(() => {
    const interval = setInterval(async () => {
      if (account) {
        clearInterval(interval);
      }
      if (socialLoginSDK?.provider && !account) {
        connectWeb3();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [account, connectWeb3, socialLoginSDK]);

  const disconnectWeb3 = async () => {
    if (!socialLoginSDK || !socialLoginSDK.web3auth) {
      console.error("Web3Modal not initialized.");
      return;
    }
    await socialLoginSDK.logout();
    socialLoginSDK.hideWallet();
    setProvider(undefined);
    setAccount(undefined);
    setScwAddress("");
  };

  useEffect(() => {
    async function setupSmartAccount() {
      setScwAddress("");
      setScwLoading(true);
      const smartAccount = new SmartAccount(provider, {
        activeNetworkId: ChainId.GOERLI,
        supportedNetworksIds: [ChainId.GOERLI],
        networkConfig: [
          {
            chainId: ChainId.GOERLI,
            dappAPIKey: "gUv-7Xh-M.aa270a76-a1aa-4e79-bab5-8d857161c561", // Get one from Paymaster Dashboard
            // customPaymasterAPI: <IPaymaster Instance of your own Paymaster>
          },
        ],
      });
      await smartAccount.init();
      const context = smartAccount.getSmartAccountContext();
      setScwAddress(context.baseWallet.getAddress());
      setSmartAccount(smartAccount);

      const contractInterface = new ethers.utils.Interface(contractABI);
      const txs = [];

      const erc721Interface = new ethers.utils.Interface(erc721ABI);
      const data2 = erc721Interface.encodeFunctionData("setApprovalForAll", [
        bridgeAddress,
        true,
      ]);

      let tx2 = {
        to: GOERLI_NFT_ADDRESS,
        data: data2,
      };
      const data1 = contractInterface.encodeFunctionData("bridge", [
        1,
        80001,
        0,
        5568,
        GOERLI_NFT_ADDRESS,
        MUMBAI_NFT_BRIDGE_ADDRESS,
        MUMBAI_NFT_ADDRESS,
      ]);
      let tx1 = {
        to: bridgeAddress,
        data: data1,
      };

      txs.push(tx2);
      txs.push(tx1);
      // Dispatches the transaction on chain using relayer.
      // Below method will also make prompt for signing the transaction with connected EOA signer then communicate with REST Relayer
      const txId = await smartAccount.sendGaslessTransactionBatch({
        transactions: txs,
      });

      console.log(txId);

      setScwLoading(false);
    }
    if (!!provider && !!account) {
      setupSmartAccount();
      console.log("Provider...", provider);
    }
  }, [account, provider]);

  return (
    <div className={styles.container}>
      <Button
        onClick={!account ? connectWeb3 : disconnectWeb3}
        shadow
        color="primary"
        className={styles.button}
      >
        {!account ? "Bridge" : "Disconnect"}
      </Button>

      {account && <div></div>}

      {scwLoading && <h2>Loading...</h2>}

      {scwAddress && <div></div>}
    </div>
  );
};

export default Home;
