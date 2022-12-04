import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Button } from "@nextui-org/react";
import { useAccount } from "wagmi";

interface Props {
  result: number;
  result2: number;
  function: () => void;
}

const MintButton: NextPage<Props> = (props) => {
  const { address, connector, isConnected } = useAccount();
  //ここに関数を書く
  const hogehoge = async () => {
    console.log(address);
    //todo change mint_to_address
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "ffb135ba-5ffb-4c86-b7b6-08b74b917f06",
      },
      body: `{"chain":"goerli","name":"Test NFT","description":"Build with NFTPort!","file_url":"https://ipfs.io/ipfs/bafkreihrol3ndil4wwv52i32lp6t2nvocnlyym6emws2bh37il2yhprvlm","mint_to_address": ${address}}`,
    };

    alert("Minting...");
    fetch("https://api.nftport.xyz/v0/mints/easy/urls", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .then((response) => alert("Mint DONE!"))
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.container}>
      <Button onClick={hogehoge}>Mint test NFT</Button>
    </div>
  );
};
export default MintButton;
