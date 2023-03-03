import React from "react";
import { utils } from "ethers";
import { useOrderbooks } from "../../Contexts/OrderbookContext";
import { minimizeAddress } from "../../utils";

function OrderList() {
  const { orders, selectedOrderHash, selectOrder } = useOrderbooks();

  return (
    <section className="mt-2">
      <h2>Orders List</h2>
      <table className="table table-hover">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Maker</th>
            <th scope="col">Taker</th>
            <th scope="col">MakerToken</th>
            <th scope="col">TakerToken</th>
            <th scope="col">MakerAmount</th>
            <th scope="col">TakerAmount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, id) => (
            <tr
              key={order.order.salt.toString()}
              className={
                order?.metaData?.orderHash === selectedOrderHash
                  ? "table-active"
                  : ""
              }
              onClick={() => selectOrder(order.metaData?.orderHash)}
            >
              <th scope="row">{id + 1}</th>
              <td>{minimizeAddress(order.order.maker)}</td>
              <td>{minimizeAddress(order.order.taker)}</td>
              <td>{minimizeAddress(order.order.makerToken)}</td>
              <td>{minimizeAddress(order.order.takerToken)}</td>
              <td>{utils.formatEther(order.order.makerAmount)}</td>
              <td>{utils.formatEther(order.order.takerAmount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default OrderList;
