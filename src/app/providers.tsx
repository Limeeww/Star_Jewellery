"use client";

import React from "react";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import Loading from "./components/Loading/Loading";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContent";
import { WishlistProvider } from "./contexts/WishlistContext";
import StripeProvider from "./components/StripeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAnonymousAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthProvider user={user} loading={loading}>
      <StripeProvider>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </StripeProvider>
    </AuthProvider>
  );
}
