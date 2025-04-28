"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import Footer from "@/app/components/Footer/Footer";
import Navbar from "@/app/components/Navbar/Navbar";
import Loading from "@/app/components/Loading/Loading";
import Notification from "@/app/components/MessageHandling/Notification";
import { useNotification } from "@/hooks/useNotification";
import type { Order, PaymentInfo } from "@/types/order";
import OrderSummary from "@/app/cart/components/OrderSummary";
import SelectShippingAddress from "@/app/checkout/components/SelectShippingAddress";
import type { Address } from "@/types/userTypes";
import { useAddresses } from "@/hooks/useAddresses";
import SelectPaymentMethod from "@/app/checkout/components/SelectPaymentMethod";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

export default function CheckoutPage() {
  const router = useRouter();
  const { notification, notify, clearNotification } = useNotification();
  const [user, loadingAuth] = useAuthState(auth);
  const isLoggedIn = !!user && !loadingAuth;

  const {
    addresses,
    selectedIndex: selectedAddrIndex,
    selectAddress,
    loading: loadingAddrs,
  } = useAddresses();

  const {
    paymentMethods,
    loading: loadingPM,
    add,
    update,
    remove,
    selectedIndex: selectedPMIndex,
    selectPayment,
  } = usePaymentMethods();

  const [order, setOrder] = useState<Order | null>(null);
  const [shipAddress, setShipAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentInfo | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);

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
      if (parsed.paymentInfo) {
        setSelectedPayment(parsed.paymentInfo);
      }
    } catch {
      notify({ type: "error", message: "Failed to parse order." });
      router.replace("/cart");
    }
  }, [notify, router]);

  useEffect(() => {
    if (!order) return;
    if (order.shippingAddress) {
      setShipAddress(order.shippingAddress);
    } else if (!loadingAddrs && addresses.length) {
      setShipAddress(addresses[selectedAddrIndex ?? 0]);
    }
  }, [order, addresses, selectedAddrIndex, loadingAddrs]);

  const handleAddressSelect = useCallback(
    (addr: Address, idx: number) => {
      setShipAddress(addr);
      selectAddress(idx);
    },
    [selectAddress]
  );

  const handlePaymentSelect = useCallback(
    (pm: PaymentInfo, idx: number) => {
      setSelectedPayment(pm);
      selectPayment(idx);
    },
    [selectPayment]
  );

  const handleSubmitOrder = useCallback(async () => {
    if (
      !order ||
      !shipAddress ||
      selectedPMIndex === null ||
      !selectedPayment ||
      !user
    )
      return;
    setSubmitting(true);
    try {
      const now = new Date();
      const paidInfo: PaymentInfo = {
        ...selectedPayment,
        transactionId: `TXN-${now.getTime()}`,
        paid: true,
      };
      const fullOrder = {
        ...order,
        shippingAddress: shipAddress,
        paymentInfo: paidInfo,
        status: "Pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const ordersCol = collection(db, "orders");
      const orderRef = await addDoc(ordersCol, fullOrder);

      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, {
        orders: arrayUnion(orderRef.id),
      });

      router.push(`/checkout/success?orderId=${orderRef.id}`);
    } catch (e) {
      console.error(e);
      notify({
        type: "error",
        message: (e as Error).message || "Failed to submit order.",
      });
    } finally {
      setSubmitting(false);
    }
  }, [
    order,
    shipAddress,
    selectedPayment,
    selectedPMIndex,
    user,
    router,
    notify,
  ]);

  if (loadingAuth) return <Loading />;
  if (!order) return null;

  return (
    <>
      {notification && (
        <Notification {...notification} onClose={clearNotification} />
      )}

      <Navbar isScrolled isLoggedIn={isLoggedIn} />

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
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                <SelectPaymentMethod
                  paymentMethods={paymentMethods}
                  loading={loadingPM}
                  add={add}
                  update={update}
                  remove={remove}
                  selectedIndex={selectedPMIndex}
                  onSelect={handlePaymentSelect}
                />
              </div>

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
                  (sum, p) => sum + (p.originalPrice ?? p.price) * p.quantity,
                  0
                )}
                subtotal={order.products.reduce(
                  (sum, p) => sum + p.price * p.quantity,
                  0
                )}
                shipping={shipAddress ? 0 : 0}
                giftOptionsTotal={order.giftOptions.giftPackaging ? 5 : 0}
                total={order.total}
                onClick={handleSubmitOrder}
                disabled={
                  submitting ||
                  order.paymentInfo.paid ||
                  !shipAddress ||
                  selectedPMIndex === null
                }
                buttonText={
                  submitting
                    ? "Submitting…"
                    : order.paymentInfo.paid
                    ? "Already Paid"
                    : !shipAddress
                    ? "Select Address First"
                    : selectedPMIndex === null
                    ? "Select Payment Method First"
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
