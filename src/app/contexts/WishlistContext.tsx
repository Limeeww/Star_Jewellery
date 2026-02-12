"use client";

import React, { createContext, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useWishlist } from "@/hooks/useWishlist";

type WishlistContextType = ReturnType<typeof useWishlist>;

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [user] = useAuthState(auth);
  const userId = user?.uid ?? null;
  const wishlist = useWishlist(userId);

  return (
    <WishlistContext.Provider value={wishlist}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistCtx() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlistCtx must be inside WishlistProvider");
  return ctx;
}
