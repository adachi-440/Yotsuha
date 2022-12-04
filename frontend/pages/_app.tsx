import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";

import { Web3Modal } from "@web3modal/react";

import {
  Chain,
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi";

const moonbaseChain: Chain = {
  id: 1287,
  name: "Moonbase Alpha",
  network: "moonbase-alphanet",
  nativeCurrency: {
    decimals: 18,
    name: "Moonbase",
    symbol: "DEV",
  },
  rpcUrls: {
    default: "https://rpc.api.moonbase.moonbeam.network",
  },
  blockExplorers: {
    default: { name: "moonscan", url: "https://moonbase.moonscan.io/" },
  },
  testnet: true,
};

const chains = [chain.goerli, chain.polygonMumbai, moonbaseChain];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "c13230bdeda8ef025c25dc3b6c03e873" }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

// 2. Call `createTheme` and pass your custom values

const darkTheme = createTheme({
  type: "dark",
  theme: {},
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        dark: darkTheme.className,
      }}
    >
      <NextUIProvider>
        {" "}
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
        <Web3Modal
          projectId="c13230bdeda8ef025c25dc3b6c03e873"
          ethereumClient={ethereumClient}
        />
      </NextUIProvider>
    </NextThemesProvider>
  );
}

export default MyApp;
