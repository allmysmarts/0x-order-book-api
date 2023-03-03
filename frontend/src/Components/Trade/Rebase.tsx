import React, { useState } from "react";
import { useAccount, useNetwork, useSigner } from "wagmi";

import { useTokens } from "../../Contexts/TokensContext";

function Rebase() {
  const [pending, setPending] = useState(false);
  const [rebaseFactor, setRebaseFactor] = useState(0);

  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { contracts, loadBalances } = useTokens();

  const performRebase = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !chain ||
      chain.unsupported ||
      !signer ||
      !contracts["TheRisk"] ||
      !address ||
      !rebaseFactor
    ) {
      return;
    }
    setPending(true);
    try {
      const txn = await contracts["TheRisk"].connect(signer).rebase(rebaseFactor);
      await txn.wait();
      setRebaseFactor(0);
    } catch (e) {
      console.log("Failed to rebase TheRisk.");
    }

    await loadBalances(address);
    setPending(false);
  };

  return (
    <form className="border rounded p-4 my-2" onSubmit={performRebase}>
      <div className="form-group">
        <label htmlFor="rebase-factor">Rebase Factor (%)</label>
        <input
          type="number"
          className="form-control"
          id="rebase-factor"
          aria-describedby="rebase-factor-help"
          value={rebaseFactor}
          onChange={(e) => setRebaseFactor(e.target.valueAsNumber)}
        />
        <small id="rebase-factor-help" className="form-text text-muted">
          All holders balances will be {rebaseFactor > 0 ? "decreased" : "increased"}.
        </small>
      </div>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={pending || !rebaseFactor}
      >
        Rebase
      </button>
    </form>
  );
}

export default Rebase;
