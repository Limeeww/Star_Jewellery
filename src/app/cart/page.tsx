"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useForm } from "react-hook-form";
import Link from "next/link";

import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import CartItemComponent from "@/app/components/CartItem/CartItemComponent";
import OrderSummary from "@/app/cart/components/OrderSummary";
import RecentlyViewed from "@/app/components/RecentlyViewed/RecentlyViewed";
import GiftOptions from "@/app/cart/components/GiftOptions";

import { GiftOptionsForm } from "@/app/types/order";
import { Product } from "@/app/types/product";
import Notification from "../components/MessageHandling/Notification";

import {
  getTotalCount,
  getSubtotal,
  getShippingCost,
  getGiftOptionsTotal,
  getTotal,
  useCartItems,
} from "@/app/utils/cartUtils";
import {
  incrementQuantity,
  decrementQuantity,
  removeItem,
} from "@/app/utils/cartActions";
import { useNotification } from "../utils/useNotification";

export default function CartPage() {
  const [user, loading] = useAuthState(auth);
  const isLoggedIn = !!user && !loading;
  const { notify, notification, clearNotification } = useNotification();

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const cartItems = useCartItems(user ? user.uid : null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      if (stored) setRecentlyViewed(JSON.parse(stored));
    } catch (e) {
      notify({
        type: "error",
        message: `Error loading recently viewed products, ${e}`,
      });
    }
  }, [notify]);

  const { register, watch } = useForm<GiftOptionsForm>({
    defaultValues: {
      giftPackaging: false,
      giftMessage: false,
      giftReceipt: false,
    },
  });
  const giftOptionsValues = {
    giftPackaging: watch("giftPackaging"),
    giftMessage: watch("giftMessage"),
    giftReceipt: watch("giftReceipt"),
  };

  const totalCount = getTotalCount(cartItems);
  const subtotal = getSubtotal(cartItems);
  const shipping = getShippingCost(subtotal);
  const giftOptionsTotal = getGiftOptionsTotal(giftOptionsValues);
  const total = getTotal(subtotal, shipping, giftOptionsTotal);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in to view your cart.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />

      {notification && (
        <Notification {...notification} onClose={clearNotification} />
      )}

      <main
        className="min-h-screen bg-gray-50 p-4 text-gray-800 mt-10"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <div className="container mx-auto">
          <h1
            className="text-4xl mb-6 mt-10 text-center"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Cart ({totalCount} {totalCount > 1 ? "Items" : "Item"})
          </h1>

          {cartItems.length === 0 ? (
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600">Your cart is currently empty.</p>
              <Link
                href="/"
                className="inline-block mt-2 text-sm underline text-gray-700 hover:text-black transition-colors"
              >
                Return to shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <CartItemComponent
                    key={`${item.productId}-${item.size}-${item.insert}-${item.materialColor}`}
                    item={item}
                    onIncrement={() =>
                      user &&
                      incrementQuantity(
                        user.uid,
                        item.productId,
                        item.size,
                        item.insert,
                        item.materialColor
                      )
                    }
                    onDecrement={() =>
                      user &&
                      decrementQuantity(
                        user.uid,
                        item.productId,
                        item.size,
                        item.insert,
                        item.materialColor
                      )
                    }
                    onRemove={() =>
                      user &&
                      removeItem(
                        user.uid,
                        item.productId,
                        item.size,
                        item.insert,
                        item.materialColor
                      )
                    }
                  />
                ))}

                <GiftOptions register={register} />
              </div>

              <div className="col-span-full lg:col-span-1">
                <OrderSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  giftOptionsTotal={giftOptionsTotal}
                  total={total}
                />
              </div>
            </div>
          )}
          <div className="mt-6">
            <RecentlyViewed products={recentlyViewed} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
