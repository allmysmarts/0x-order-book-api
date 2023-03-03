import React, { useState, useCallback, useMemo } from "react";
import { useAccount, useSigner, useNetwork } from "wagmi";
import { utils as etherUtils, constants as etherConstants } from "ethers";
import { LimitOrder } from "@0x/protocol-utils";
import { BigNumber } from "@0x/utils";
import { getContractAddressesForChainOrThrow } from "@0x/contract-addresses";

import { ApiEndpoints, TokenAddresses } from "../../Constants";
import axios from "axios";

import { useTokens } from "../../Contexts/TokensContext";

function CreateOrder() {
  const [pending, setPending] = useState(false);
  const [sellAmount, setSellAmount] = useState<number>(1);
  const [sellPrice, setSellPrice] = useState<number>(1);
  const [expiresIn, setExpiresIn] = useState<number>(24);

  const buyAmount = useMemo(
    () => sellAmount * sellPrice,
    [sellAmount, sellPrice]
  );

  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { address } = useAccount();

  const { contracts, balances, allowances, loadBalances } = useTokens();

  const createOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    if (
      !chain ||
      chain.unsupported ||
      !contracts["TheRisk"] ||
      !signer ||
      !address
    ) {
      setPending(false);
      return;
    }

    const exchangeProxy = getContractAddressesForChainOrThrow(
      chain?.id
    ).exchangeProxy;
    // check allowance to exchangeProxy, and if insufficient then approve
    if (parseInt(allowances["TheRisk"]) < sellAmount) {
      try {
        const txn = await contracts["TheRisk"]
          .connect(signer)
          .approve(exchangeProxy, etherConstants.MaxUint256);
        await txn.wait();
      } catch (e) {
        console.log("Failed to approve TheRisk.");
        setPending(false);
        return;
      }
      await loadBalances(address);
    }

    // create limit order
    const order = new LimitOrder({
      makerToken: TokenAddresses[chain.id.toString()]["TheRisk"],
      takerToken: TokenAddresses[chain.id.toString()]["MockUSDT"],
      makerAmount: new BigNumber(
        etherUtils.parseEther(sellAmount.toString()).toString()
      ), // WEI unit
      takerAmount: new BigNumber(
        etherUtils.parseEther(buyAmount.toString()).toString()
      ), // WEI unit
      maker: address,
      sender: etherConstants.AddressZero,
      expiry: new BigNumber(
        Math.floor(Date.now() / 1000) + expiresIn * 60 * 60
      ),
      salt: new BigNumber(Date.now()),
      chainId: chain.id,
      verifyingContract: exchangeProxy,
    });
    const orderHash = order.getHash();
    console.log("OrderHash: ", orderHash);

    try {
      // Get signature
      const rawSignature = await signer.signMessage(
        etherUtils.arrayify(orderHash)
      );
      const { v, r, s } = etherUtils.splitSignature(rawSignature);
      const signature = {
        v,
        r,
        s,
        signatureType: 3,
      };
      console.log("Signature: ", signature);
      const signedOrder = { ...order, signature };

      // submit order
      const resp = await axios.post(
        `${ApiEndpoints[chain.id.toString()]}/orderbook/v1/order`,
        signedOrder
      );
      console.log("Response: ", resp.status);
      console.log("ResponseData: ", resp.data);
    } catch (e) {
      console.log("Failed to sign and transmit order.");
      setPending(false);
      return;
    }

    setPending(false);
  };

  return (
    <form className="border rounded p-4 my-2" onSubmit={createOrder}>
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
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.valueAsNumber)}
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
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.valueAsNumber)}
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
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.valueAsNumber)}
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
            value={buyAmount}
          />
        </div>
      </div>

      <button
        className="btn btn-primary btn-block"
        type="submit"
        disabled={pending}
      >
        Create Order
      </button>
    </form>
  );
}

export default CreateOrder;
