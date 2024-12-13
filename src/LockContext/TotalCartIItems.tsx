"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

// Define the context value type
type CartItemsContextType = {
  totalQuantity: number;
  setTotalQuantity: Dispatch<SetStateAction<number>>;
};

// Create the context
export const CartItemsContext = createContext({} as CartItemsContextType);

export function CartItemsProvider({ children }: { children: ReactNode }) {
  const [totalQuantity, setTotalQuantity] = useState(0);

  return (
    <CartItemsContext.Provider value={{ totalQuantity, setTotalQuantity }}>
      {children}
    </CartItemsContext.Provider>
  );
}
