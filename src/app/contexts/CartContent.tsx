"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import type { CartItem } from "@/types/cartItem";
import { useCart as useCartHook, CartItemIdentifier } from "@/hooks/useCart";

interface CartContextType {
  cartItems: CartItem[];
  cartItemCount: number;
  addOrIncrement: (newItem: CartItem) => Promise<void>;
  incrementItem: (identifier: CartItemIdentifier) => Promise<void>;
  decrementItem: (identifier: CartItemIdentifier) => Promise<void>;
  removeItem: (identifier: CartItemIdentifier) => Promise<void>;
  added: boolean;
  clearAdded: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [user] = useAuthState(auth);
  const userId = user && !user.isAnonymous ? user.uid : null;

  const {
    items: cartItems,
    addOrIncrement: baseAddOrIncrement,
    incrementItem,
    decrementItem,
    removeItem,
  } = useCartHook(userId);

  const [added, setAdded] = useState(false);

  const cartItemCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  const addOrIncrement = async (newItem: CartItem) => {
    await baseAddOrIncrement(newItem);
    setAdded(true);
  };

  const clearAdded = () => {
    setAdded(false);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        addOrIncrement,
        incrementItem,
        decrementItem,
        removeItem,
        added,
        clearAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCartContext must be used within <CartProvider>");
  }
  return ctx;
}
