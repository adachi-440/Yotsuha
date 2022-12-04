import type { NextPage } from "next";
import Head from "next/head";
import { Image } from "@nextui-org/react";
import styles from "../styles/NFTimage.module.css";
import { Button } from "@nextui-org/react";
import React from "react";

interface Props {
  result: number;
  result2: number;
  function: () => void;
}
interface NFTData {
  name: string;
  description: string;
  tokenId: string;
  imageURL: string;
}

const NFTimage: NextPage<Props> = (props) => {
  //ここに関数を書く
  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://my-api.com/endpoint");
      const data: NFTData = await response.json();
      setData(data);
    }
    fetchData();
  }, []);

  const hogehoge = async () => {};

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        {" "}
        <Image
          width={300}
          height={200}
          src="https://flxt.tmsimg.com/assets/p10963451_i_h9_aa.jpg"
          alt="Default Image"
          objectFit="cover"
        />
      </div>
    </div>
  );
};
export default NFTimage;

function setData(data: any) {
  throw new Error("Function not implemented.");
}
