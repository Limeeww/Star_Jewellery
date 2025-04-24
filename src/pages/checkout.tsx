"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import OrderSummary from "@/app/cart/components/OrderSummary";
// import SelectShippingAddress from "@/app/cart/components/SelectShippingAddress";
import Notification from "@/app/components/MessageHandling/Notification";
import { useNotification } from "@/hooks/useNotification";
import type { Order, PaymentInfo } from "@/app/types/order";

export default function CheckoutPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const { notification, notify, clearNotification } = useNotification();
  const router = useRouter();

  // Загрузка заказа из localStorage
  useEffect(() => {
    const raw = localStorage.getItem("currentOrder");
    if (!raw) {
      notify({ type: "error", message: "No order in progress." });
      // можно редиректить обратно в корзину:
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

  // Обработчик эмуляции «оплаты»
  const handleConfirm = () => {
    if (!order) return;
    const now = new Date();
    const paidInfo: PaymentInfo = {
      ...order.paymentInfo,
      transactionId: `TXN-${now.getTime()}`,
      paid: true,
    };
    const updated: Order = {
      ...order,
      paymentInfo: paidInfo,
      status: "shipped",       // или «pending» → «shipped»
      updatedAt: now,
    };
    // сохраняем обратно
    localStorage.setItem("currentOrder", JSON.stringify(updated));
    setOrder(updated);
    notify({ type: "success", message: "Payment confirmed!" });
  };

  if (!order) return null;

  return (
    <>
      {notification && (
        <Notification {...notification} onClose={clearNotification} />
      )}

      <Navbar isScrolled isLoggedIn />

      <main className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Review & Confirm Order</h1>

        <OrderSummary
          originalPrice={order.products.reduce(
            (sum, i) => sum + (i.originalPrice ?? i.price) * i.quantity,
            0
          )}
          subtotal={order.products.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
          )}
          shipping={order.shippingAddress ? 0 : 0} // уже включено в total
          giftOptionsTotal={order.giftOptions.giftPackaging ? 5 : 0}
          total={order.total}
        />

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
          <div className="space-y-1">
            <p>{order.shippingAddress.addressLabel}</p>
            <p>
              {order.shippingAddress.street}, {order.shippingAddress.houseNumber}
            </p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleConfirm}
            disabled={order.paymentInfo.paid}
            className={`px-6 py-3 rounded ${
              order.paymentInfo.paid
                ? "bg-gray-400 cursor-default"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white transition`}
          >
            {order.paymentInfo.paid ? "Already Paid" : "Confirm Payment"}
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}