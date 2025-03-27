"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import Link from "next/link";

import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import CartItemComponent from "@/app/components/CartItem/CartItemComponent";
import GiftOptions from "@/app/components/GiftOptions/GiftOptions";
import OrderSummary from "@/app/components/OrderSummary/OrderSummary";
import RecentlyViewed from "@/app/components/RecentlyViewed/RecentlyViewed";

import { CartItem } from "@/app/types/cartItem";
import { GiftOptionsForm } from "@/app/types/order";
import { Product } from "@/app/types/product";
import {
  getTotalCount,
  getSubtotal,
  getShippingCost,
  getGiftOptionsTotal,
  getTotal,
} from "@/app/utils/cartUtils";

export default function CartPage() {
  const [user, loading] = useAuthState(auth);
  const isLoggedIn = !!user && !loading;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);


  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (!snapshot.exists()) {
        setCartItems([]);
        return;
      }
      const data = snapshot.data();
      setCartItems(data.cartItems || []);
    });

    return () => unsubscribe();
  }, [user]);


  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      if (stored) {
        const parsed = JSON.parse(stored) as Product[];
        setRecentlyViewed(parsed);
      }
    } catch (error) {
      console.error("Ошибка чтения localStorage:", error);
    }
  }, []);


  const incrementQuantity = async (productId: number) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    const data = snap.data();
    let updatedCart: CartItem[] = data.cartItems || [];

    updatedCart = updatedCart.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    await updateDoc(userRef, { cartItems: updatedCart });
  };

  const decrementQuantity = async (productId: number) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    let updatedCart: CartItem[] = snap.data().cartItems || [];

    updatedCart = updatedCart.map((item) => {
      if (item.productId === productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    await updateDoc(userRef, { cartItems: updatedCart });
  };

  const removeItem = async (productId: number) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    let updatedCart: CartItem[] = snap.data().cartItems || [];
    console.log(updatedCart);
    updatedCart = updatedCart.filter((item) => {
      return item.productId === productId;
    });

    await updateDoc(userRef, { cartItems: updatedCart });
  };

  /**
   * 4) Расчёт итоговой суммы и т.д.
   */
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<GiftOptionsForm>({
    defaultValues: {
      giftPackaging: false,
      giftMessage: false,
      giftReceipt: false,
    },
  });

  const giftOptionsValues = {
    giftPackaging: watch("giftPackaging", false),
    giftMessage: watch("giftMessage", false),
    giftReceipt: watch("giftReceipt", false),
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

      <main className="min-h-screen bg-gray-50 p-4 text-gray-800 mt-10">
        <div className="container mx-auto">
          <h1 className="text-4xl font-semibold mb-6 mt-10 text-center">
            Cart ({totalCount})
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
              <div className="col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <CartItemComponent
                    key={item.productId}
                    item={item}
                    onIncrement={() => incrementQuantity(item.productId)}
                    onDecrement={() => decrementQuantity(item.productId)}
                    onRemove={() => removeItem(item.productId)}
                  />
                ))}

                <GiftOptions register={register} />

                {/* Recently Viewed из localStorage */}
                <RecentlyViewed products={recentlyViewed} />
              </div>

              <div className="col-span-1">
                <OrderSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  giftOptionsTotal={giftOptionsTotal}
                  total={total}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
