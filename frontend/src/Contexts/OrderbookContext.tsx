import React, {
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useNetwork } from "wagmi";
import axios from "axios";

import { ApiEndpoints, TokenAddresses } from "../Constants";

type OrderbookSlice = {
  orders: Array<any>;
  loadOrders: () => void;
  selectedOrderHash: string;
  selectOrder: (hash: string) => void;
};

export const OrderbookContext = React.createContext<OrderbookSlice>({
  orders: [],
  loadOrders: () => {},
  selectedOrderHash: "",
  selectOrder: (hash: string) => {},
});

export const useOrderbooks = () => {
  return useContext(OrderbookContext);
};

export const OrderbookProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Array<any>>([]);
  const [selectedOrderHash, setSelectedOrderHash] = useState("");

  const { chain } = useNetwork();

  const loadOrders = useCallback(async () => {
    if (!chain || chain.unsupported) return;

    try {
      const { data } = await axios.get(
        `${ApiEndpoints[chain.id.toString()]}/orderbook/v1`,
        {
          params: {
            baseToken: TokenAddresses[chain.id.toString()]["TheRisk"],
            quoteToken: TokenAddresses[chain.id.toString()]["MockUSDT"],
          },
        }
      );

      setOrders([...data.bids.records, ...data.asks.records]);
      console.log("Loaded open orders.", data.bids.records, data.asks.records);
    } catch (e) {
      console.log("Failed to load orders list.");
      return;
    }
  }, [chain?.id]);

  useEffect(() => {
    loadOrders();
  }, [chain?.id]);

  return (
    <OrderbookContext.Provider
      value={{
        orders,
        loadOrders,
        selectedOrderHash,
        selectOrder: setSelectedOrderHash,
      }}
    >
      {children}
    </OrderbookContext.Provider>
  );
};
