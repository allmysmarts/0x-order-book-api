import React, { useContext, ReactNode } from 'react'

type OrderbookSlice = {

}

export const OrderbookContext = React.createContext<OrderbookSlice>({

})

export const useOrderbooks = () => {
  return useContext(OrderbookContext)
}

export const OrderbookProvider = ({ children }: {children: ReactNode}) => {

}