"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useCartItems } from "../utils/cartUtils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import { CartItem } from "../types/cartItem";

interface CartContextType {
  cartItemCount: number;
  cartItems: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [user] = useAuthState(auth);
  const cartItems = useCartItems(user ? user.uid : null);
  const cartItemCount = cartItems?.length || 0;

  return (
      <CartContext.Provider value={{ cartItemCount, cartItems }}>
        {children}
      </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
