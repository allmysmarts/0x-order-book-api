import React from "react";
import { useConnect } from "wagmi";

function ConnectWallet() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <div className="container d-flex justify-content-center">
      <form className="border rounded p-4 my-2">
        <h2>Connect your wallet</h2>

        <div className="d-flex flex-column justify-content-center align-items-center mt-3">
          {connectors.map((connector) => (
            <button
              className="btn btn-primary"
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                ' (connecting)'}
            </button>
          ))}

          {error && <div>{error.message}</div>}
        </div>
      </form>
    </div>
  );
}

export default ConnectWallet;
