"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { CartItem } from "@/types/cartItem";
import { useCart as useCartHook, CartItemIdentifier } from "@/hooks/useCart";

interface CartContextType {
  cartItemCount: number;
  cartItems: CartItem[];
  addOrIncrement: (newItem: CartItem) => Promise<void>;
  incrementItem: (identifier: CartItemIdentifier) => Promise<void>;
  decrementItem: (identifier: CartItemIdentifier) => Promise<void>;
  removeItem: (identifier: CartItemIdentifier) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [user] = useAuthState(auth);
  const userId = user ? user.uid : null;

  const {
    items: cartItems,
    addOrIncrement,
    incrementItem,
    decrementItem,
    removeItem,
  } = useCartHook(userId);

  const cartItemCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItemCount,
        cartItems,
        addOrIncrement,
        incrementItem,
        decrementItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
