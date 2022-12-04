import React from "react";
import Head from "next/head";
import { Text, Spacer, Container, Button, Card } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import styles from "../styles/BridgePage.module.css";
import Header from "../components/Header";
import MintButton from "../components/MintButton";
import { Radio } from "@nextui-org/react";
import { Dropdown } from "@nextui-org/react";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import BridgeButton from "../components/BridgeButton";
import BridgeETHButton from "../components/BridgeETHButton";
import { Web3Button } from "@web3modal/react";

const MintPage = () => {
  const [selected, setSelected] = React.useState<any>(new Set(["goerli"]));

  const selectedValue = React.useMemo(
    () => Array.from(selected).join(", ").replaceAll("_", " "),
    [selected]
  );

  const lightTheme = createTheme({
    type: "light",
    theme: {
      // optional
    },
  });

  const darkTheme = createTheme({
    type: "dark",
    theme: {
      // optional
    },
  });

  return (
    <div className={styles.maincard}>
      <Web3Button />
      <Card variant="bordered" css={{ mw: "800px" }}>
        <Card.Body>
          <div className={styles.cardcontens}>
            <div>
              <Image
                height={200}
                width={200}
                src="https://cdn.botanica-media.jp/images/production/posts/eyecatches/000/001/464/original.jpg"
              />
              <Text>NFT Name</Text>
              <Text>Discrioption</Text>
            </div>
            <Card>
              <Card.Body>
                <Text>Source chain (from)</Text>

                <div className={styles.srcchain}>
                  <div className={styles.srcchaintext}>Goerli</div>
                </div>

                <Text>Destination Chain(to)</Text>
                <Dropdown>
                  <Dropdown.Button
                    flat
                    color="primary"
                    css={{ tt: "capitalize" }}
                  >
                    {selectedValue}
                  </Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Single selection actions"
                    color="primary"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={selected}
                    onSelectionChange={setSelected}
                  >
                    <Dropdown.Item key="goerli">Goerli</Dropdown.Item>
                    <Dropdown.Item key="mombai">Mumbai</Dropdown.Item>
                    <Dropdown.Item key="moonbeam">Moonbeam</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Radio.Group
                  orientation="horizontal"
                  label="Options"
                  defaultValue="auto"
                >
                  <Radio size="sm" value="auto">
                    auto
                  </Radio>
                  <Radio size="sm" value="manual" isDisabled>
                    manual
                  </Radio>
                </Radio.Group>
                <div className={styles.bubu}>
                  <BridgeButton />
                </div>
              </Card.Body>
            </Card>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MintPage;
