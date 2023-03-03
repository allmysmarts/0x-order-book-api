import React from "react";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { polygon } from "wagmi/chains"
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import { TokensProvider } from "./Contexts/TokensContext";
import { OrderbookProvider } from "./Contexts/OrderbookContext";
import Main from "./Components/Main";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [polygon],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY || "" }),
    publicProvider(),
  ]
);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});

function App() {
  return (
    <WagmiConfig client={client}>
      <TokensProvider>
        <OrderbookProvider>
          <Main />
        </OrderbookProvider>
      </TokensProvider>
    </WagmiConfig>
  );
}

export default App;
