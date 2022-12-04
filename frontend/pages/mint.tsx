import React from "react";
import Head from "next/head";
import { Text, Spacer, Container, Button } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import styles from "../styles/MintPage.module.css";
import Header from "../components/Header";
import MintButton from "../components/MintButton";
import { Web3Button } from "@web3modal/react";

const MintPage = () => {
  return (
    <div>
      <Web3Button />
      <div className={styles.image}>
        {" "}
        <Image
          width={320}
          height={320}
          src="https://www.linkpicture.com/q/yotuha.png"
          alt="Default Image"
          objectFit="cover"
        />
      </div>
      <div className={styles.mintbutton}>
        <MintButton
          result={0}
          result2={0}
          function={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
};

export default MintPage;
