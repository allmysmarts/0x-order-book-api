import React from "react";
import { WagmiConfig, createClient, configureChains, goerli } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import { TokensProvider } from "./Contexts/TokensContext";
import Main from "./Components/Main";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [
    infuraProvider({ apiKey: process.env.REACT_APP_INFURA_ID || "" }),
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
        <Main />
      </TokensProvider>
    </WagmiConfig>
  );
}

export default App;
