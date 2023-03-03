import React, { useState, useMemo } from "react";
import { useAccount, useSigner, useNetwork } from "wagmi";
import { Contract, utils, constants } from "ethers";
import { LimitOrder } from "@0x/protocol-utils";

import { getContractAddressesForChainOrThrow } from "@0x/contract-addresses";

import ExchangeProxyABI from "../../ABIs/ExchangeProxy.json";
import { useTokens } from "../../Contexts/TokensContext";
import { useOrderbooks } from "../../Contexts/OrderbookContext";

function FillOrder() {
  const [pending, setPending] = useState(false);
  const [sellAmount, setSellAmount] = useState<number>(1);

  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { address } = useAccount();

  const { contracts, balances, allowances, loadBalances } = useTokens();
  const { orders, loadOrders, selectedOrderHash } = useOrderbooks();

  const activeOrder = useMemo(
    () =>
      orders.find((order) => order.metaData.orderHash === selectedOrderHash),
    [orders, selectedOrderHash]
  );

  const sellPrice = useMemo(
    () =>
      activeOrder
        ? Number(utils.formatEther(activeOrder.order.makerAmount)) /
          Number(utils.formatEther(activeOrder.order.takerAmount))
        : 0,
    [activeOrder]
  );
  const buyAmount = useMemo(
    () => sellAmount * sellPrice,
    [sellAmount, sellPrice]
  );

  const fillOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    console.log("active order: ", activeOrder.metaData.orderHash);
    console.log("sell amount: ", sellAmount);

    if (
      !chain ||
      chain.unsupported ||
      !contracts["MockUSDT"] ||
      !signer ||
      !address
    ) {
      setPending(false);
      return;
    }

    const exchangeProxy = getContractAddressesForChainOrThrow(
      chain?.id
    ).exchangeProxy;

    if (parseInt(allowances["MockUSDT"]) < sellAmount) {
      try {
        const txn = await contracts["MockUSDT"]
          .connect(signer)
          .approve(exchangeProxy, constants.MaxUint256);
        await txn.wait();
      } catch (e) {
        console.log("Failed to approve MockUSDT.");
        setPending(false);
        return;
      }
    }

    const proxyContract = new Contract(
      exchangeProxy,
      ExchangeProxyABI.abi,
      signer
    );
    // get protocol fee multiplier
    const protocolFeeMultiplier =
      await proxyContract.getProtocolFeeMultiplier();
    console.log("ProtocolFeeMultiplier: ", protocolFeeMultiplier);

    try {
      // create limit order
      const limitOrder = new LimitOrder(activeOrder.order);
      const txn = await proxyContract.fillLimitOrder(
        limitOrder,
        activeOrder.order.signature,
        utils.parseEther(sellAmount.toString())
      );
      await txn.wait();
    } catch(e) {
      console.log("Failed to fill order.");
      setPending(false);
      return;
    }

    // refresh balances
    await loadBalances(address);
    await loadOrders();
    setPending(false);
  };

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
            readOnly
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
        disabled={pending || !selectedOrderHash}
      >
        Fill Order
      </button>
    </form>
  );
}

export default FillOrder;
