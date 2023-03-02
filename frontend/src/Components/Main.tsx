import React from "react";
import { useAccount } from "wagmi";

import Header from "./Header";
import ConnectWallet from "./ConnectWallet";
import Trade from "./Trade";

function Main() {
  const { isConnected } = useAccount();

  return (
    <div className="App">
      <Header />
      {!isConnected ? <ConnectWallet /> : <Trade />}
    </div>
  );
}

export default Main;
