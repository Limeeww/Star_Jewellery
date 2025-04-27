"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer/Footer";
import OrderSummary from "@/app/cart/components/OrderSummary";
import Notification from "@/app/components/MessageHandling/Notification";
import { useNotification } from "@/hooks/useNotification";
import type { Order, PaymentInfo } from "@/types/order";
import SelectShippingAddress from "@/app/checkout/components/SelectShippingAddress";
import { Address } from "@/types/userTypes";
import Navbar from "../components/Navbar/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useAddresses } from "@/hooks/useAddresses";
import Loading from "../components/Loading/Loading";

export default function CheckoutPage() {
  const router = useRouter();
  const { notification, notify, clearNotification } = useNotification();
  const [user, loadingAuth] = useAuthState(auth);
  const isLoggedIn = !!user && !loadingAuth;
  const {
    addresses,
    selectedIndex,
    selectAddress,
    loading: loadingAddrs,
  } = useAddresses();

  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem("currentOrder");
    if (!raw) {
      notify({ type: "error", message: "No order in progress." });
      router.replace("/cart");
      return;
    }
    try {
      const parsed: Order = JSON.parse(raw);
      setOrder(parsed);
    } catch {
      notify({ type: "error", message: "Failed to parse order." });
      router.replace("/cart");
    }
  }, [notify, router]);

  const [shipAddress, setShipAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!order) return;

    if (order.shippingAddress) {
      setShipAddress(order.shippingAddress);
    } else if (!loadingAddrs && addresses.length) {
      setShipAddress(addresses[selectedIndex ?? 0]);
    }
  }, [order, addresses, selectedIndex, loadingAddrs]);

  const handleAddressSelect = (addr: Address) => {
    setShipAddress(addr);
    selectAddress(addresses.findIndex((a) => a === addr));
  };

  const handleConfirm = () => {
    if (!order || !shipAddress) return;
    const now = new Date();
    const paidInfo: PaymentInfo = {
      ...order.paymentInfo,
      transactionId: `TXN-${now.getTime()}`,
      paid: true,
    };
    const updated: Order = {
      ...order,
      shippingAddress: shipAddress,
      paymentInfo: paidInfo,
      status: "shipped",
      updatedAt: now,
    };
    localStorage.setItem("currentOrder", JSON.stringify(updated));
    setOrder(updated);
    notify({ type: "success", message: "Payment confirmed!" });
  };

  if (!order) return null;

  if (loadingAuth) {
    return <Loading />;
  }
  return (
    <>
      {notification && (
        <Notification {...notification} onClose={clearNotification} />
      )}

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
            Review and Confirm Order
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <OrderSummary
                originalPrice={order.products.reduce(
                  (sum, i) => sum + (i.originalPrice ?? i.price) * i.quantity,
                  0
                )}
                subtotal={order.products.reduce(
                  (sum, i) => sum + i.price * i.quantity,
                  0
                )}
                shipping={shipAddress ? 0 : 0}
                giftOptionsTotal={order.giftOptions.giftPackaging ? 5 : 0}
                total={order.total}
              />

              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>

                {loadingAddrs ? (
                  <p>Loading addresses…</p>
                ) : (
                  <SelectShippingAddress
                    loading={loadingAddrs}
                    addresses={addresses}
                    onSelect={handleAddressSelect}
                  />
                )}
              </div>
            </div>

            <div className="col-span-full lg:col-span-1 space-y-8">
              <OrderSummary
                originalPrice={order.products.reduce(
                  (sum, i) => sum + (i.originalPrice ?? i.price) * i.quantity,
                  0
                )}
                subtotal={order.products.reduce(
                  (sum, i) => sum + i.price * i.quantity,
                  0
                )}
                shipping={shipAddress ? 0 : 0}
                giftOptionsTotal={order.giftOptions.giftPackaging ? 5 : 0}
                total={order.total}
                onClick={handleConfirm}
                disabled={order.paymentInfo.paid || !shipAddress}
                buttonText={
                  order.paymentInfo.paid
                    ? "Already Paid"
                    : !shipAddress
                    ? "Select Address First"
                    : "Confirm Payment"
                }
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
