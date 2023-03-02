import React from "react";
import { useAccount, useDisconnect, useNetwork } from "wagmi";

function Header() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  return (
    <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
      <h5 className="my-0 mr-md-auto font-weight-normal">0x-Orderbook-API</h5>
      {isConnected && (
        <>
          <nav className="my-2 my-md-0 mr-md-3">
            <span className="p-2">{chain?.name}</span>
            <span className="p-2">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </nav>

          <button
            className="btn btn-outline-primary"
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}

export default Header;
