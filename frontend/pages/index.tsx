import type { NextPage } from "next";
import { Text } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { Web3Button } from "@web3modal/react";

const Home: NextPage = () => {
  return (
    <div>
      <Web3Button />
      <Image
        height={630}
        width={1318}
        src="https://www.linkpicture.com/q/20221204-0526_38a9ad6917b6d2231600bef18f8bd97c.png"
      />
    </div>
  );
};

export default Home;
