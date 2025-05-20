"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useForm } from "react-hook-form";

import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import CartItemComponent from "@/app/components/CartItem/CartItemComponent";
import OrderSummary from "@/app/cart/components/OrderSummary";
import RecentlyViewed from "@/app/components/RecentlyViewed/RecentlyViewed";
import GiftOptions from "@/app/cart/components/GiftOptions";
import {
  GiftOptionsForm,
  Order,
  PaymentInfo,
  PaymentStatusValue,
} from "@/types/order";
import { useRouter } from "next/navigation";

import { useCartContext } from "@/app/contexts/CartContent";
import {
  getTotalCount,
  getSubtotal,
  getShippingCost,
  getGiftOptionsTotal,
  getTotal,
  calculateOriginalPriceSum,
} from "@/utils/index";

export default function CartPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const isLoggedIn = !!user && !loading;

  const { cartItems, incrementItem, decrementItem, removeItem } =
    useCartContext();

  const { register, watch } = useForm<GiftOptionsForm>({
    defaultValues: {
      giftPackaging: false,
      giftMessage: false,
      giftReceipt: false,
      giftMessageText: "",
    },
  });
  const giftOptionsValues = {
    giftPackaging: watch("giftPackaging"),
    giftMessage: watch("giftMessage"),
    giftReceipt: watch("giftReceipt"),
    giftMessageText: watch("giftMessageText") ?? "",
  };

  const totalCount = getTotalCount(cartItems);
  const subtotal = getSubtotal(cartItems);
  const shipping = getShippingCost(subtotal);
  const giftOptionsTotal = getGiftOptionsTotal([giftOptionsValues]);
  const total = getTotal(subtotal, shipping, giftOptionsTotal);

  const originalPriceSum = calculateOriginalPriceSum(cartItems);

  const handleProceed = () => {
    if (!user) return;

    const now = new Date();
    const paymentInfo = {
      method: "credit_card",
      transactionId: "",
      paid: false,
    } as unknown as PaymentInfo;
    const order: Partial<Order> = {
      orderId: Date.now(),
      userId: user.uid,
      products: cartItems,
      total,
      orderDate: now,
      updatedAt: now,
      giftOptions: giftOptionsValues,
      paymentInfo,
      discountsApplied: [],
      status: PaymentStatusValue.PENDING,
    };

    localStorage.setItem("currentOrder", JSON.stringify(order));
    router.push("/checkout");
  };

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

      <main
        className="min-h-screen bg-gray-50 p-4 text-gray-800 mt-10"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <div className="container mx-auto">
          <h1
            className="text-4xl mb-6 mt-10 text-center"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your Cart {totalCount > 1 ? `(${totalCount} Items)` : null}
          </h1>

          {cartItems.length === 0 ? (
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600">Your cart is currently empty.</p>
              <Link
                href="/"
                className="inline-block mt-2 text-sm underline text-gray-700 hover:text-black transition-colors"
              >
                Return to the shop
                <span className="ml-1">&rarr;</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 lg:col-span-2">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto mb-4">
                  {cartItems.map((item) => (
                    <CartItemComponent
                      key={`${item.productId}-${item.size}-${item.insert}-${item.materialColor}`}
                      item={item}
                      onIncrement={() => incrementItem(item)}
                      onDecrement={() => decrementItem(item)}
                      onRemove={() => removeItem(item)}
                    />
                  ))}
                </div>
                <GiftOptions register={register} watch={watch} />
              </div>

              <div className="col-span-full lg:col-span-1 space-y-4">
                <OrderSummary
                  originalPrice={originalPriceSum}
                  subtotal={subtotal}
                  shipping={shipping}
                  giftOptionsTotal={giftOptionsTotal}
                  total={total}
                  onClick={handleProceed}
                  mode={"cart"}
                />

                <div className="bg-white p-4 rounded shadow space-y-4 w-full">
                  <h3 className="text-lg font-semibold mb-2">
                    Payment Methods
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        src: "https://upload.wikimedia.org/wikipedia/commons/4/40/Klarna_Payment_Badge.svg",
                        alt: "Klarna",
                      },
                      {
                        src: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
                        alt: "Visa",
                      },
                      {
                        src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
                        alt: "PayPal",
                      },
                      {
                        src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
                        alt: "Mastercard",
                      },
                    ].map(({ src, alt }) => (
                      <div key={alt} className="flex-1 py-3 transition">
                        <div className="relative w-full h-6">
                          <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <RecentlyViewed />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
