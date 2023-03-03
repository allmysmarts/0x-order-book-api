import React, { useState, useMemo } from "react";

import { useTokens } from "../../Contexts/TokensContext";
import { useOrderbooks } from "../../Contexts/OrderbookContext";

function FillOrder() {
  const [pending, setPending] = useState(false);
  const [sellAmount, setSellAmount] = useState<number>(1);
  const [sellPrice, setSellPrice] = useState<number>(1);

  const buyAmount = useMemo(
    () => sellAmount * sellPrice,
    [sellAmount, sellPrice]
  );

  const { contracts, balances, allowances, loadBalances } = useTokens();

  const fillOrder = async (event: React.FormEvent) => {

  }

  return (
    <form className="border rounded p-4 my-2" onSubmit={fillOrder}>
      <div className="form-group">
        <div className="d-flex justify-content-between">
          <label htmlFor="sell-amount">You Sell</label>
          <span>Balance: {balances.MockUSDT || "-"}</span>
        </div>

        <div className="d-flex">
          <select className="form-control mr-2" id="sell-token">
            <option>MockUSDT</option>
          </select>

          <input
            type="number"
            className="form-control flex-grow-1"
            id="sell-amount"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.valueAsNumber)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="limit-price-input">MockUSDT Price</label>
        <div className="input-group">
          <input
            type="number"
            className="form-control"
            id="limit-price-input"
            placeholder="Price"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.valueAsNumber)}
          />
          <div className="input-group-append">
            <div className="input-group-text">TheRisk</div>
          </div>
        </div>
      </div>

      <hr />

      <div className="form-group">
        <div className="d-flex justify-content-between">
          <label htmlFor="receive-amount">You Receive</label>
          <span>Balance: {balances.TheRisk || "-"}</span>
        </div>

        <div className="d-flex">
          <select className="form-control mr-2" id="buy-token">
            <option>TheRisk</option>
          </select>

          <input
            type="number"
            className="form-control flex-grow-1"
            id="receive-amount"
            readOnly
            value={buyAmount}
          />
        </div>
      </div>

      <button
        className="btn btn-primary btn-block"
        type="submit"
        disabled={pending}
      >
        Fill Order
      </button>
    </form>
  );
}

export default FillOrder;
