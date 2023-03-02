import React from "react";
import { useTokens } from "../../Contexts/TokensContext";

function CreateOrder() {
  const { balances } = useTokens();

  return (
    <form className="border rounded p-4 my-2">
      <div className="form-group">
        <div className="d-flex justify-content-between">
          <label htmlFor="sell-amount">You Sell</label>
          <span>Balance: {balances.TheRisk || "-"}</span>
        </div>

        <div className="d-flex">
          <select className="form-control mr-2" id="sell-token">
            <option>TheRisk</option>
          </select>

          <input
            type="number"
            className="form-control flex-grow-1"
            id="sell-amount"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="limit-price-input">TheRisk Price</label>
        <div className="input-group">
          <input
            type="number"
            className="form-control"
            id="limit-price-input"
            placeholder="Price"
          />
          <div className="input-group-append">
            <div className="input-group-text">mockUSDT</div>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="expires-period-input">Expires In</label>
        <div className="input-group">
          <input
            type="number"
            className="form-control"
            id="expires-period-input"
            placeholder="Price"
          />
          <div className="input-group-append">
            <div className="input-group-text">Hour</div>
          </div>
        </div>
      </div>

      <hr />

      <div className="form-group">
        <div className="d-flex justify-content-between">
          <label htmlFor="receive-amount">You Receive</label>
          <span>Balance: {balances.MockUSDT || "-"}</span>
        </div>

        <div className="d-flex">
          <select className="form-control mr-2" id="buy-token">
            <option>mockUSDT</option>
          </select>

          <input
            type="number"
            className="form-control flex-grow-1"
            id="receive-amount"
            readOnly
          />
        </div>
      </div>

      <button className="btn btn-primary btn-block">Create Order</button>
    </form>
  );
}

export default CreateOrder;
