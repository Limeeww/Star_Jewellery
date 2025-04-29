"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/app/components/Loading/Loading";
import Footer from "@/app/components/Footer/Footer";
import Navbar from "@/app/components/Navbar/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useNotification } from "@/hooks/useNotification";
import Notification from "@/app/components/MessageHandling/Notification";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import type { Order } from "@/types/order";

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const orderId = params?.get("orderId");
  const router = useRouter();
  const { notification, notify, clearNotification } = useNotification();
  const [user, loadingAuth] = useAuthState(auth);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      notify({ type: "error", message: "Order ID is missing." });
      router.replace("/");
    }
    if (!user && !loadingAuth) {
      router.replace("/login");
    }
  }, [orderId, user, loadingAuth, notify, router]);

  useEffect(() => {
    if (!orderId || !user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "orders", orderId));
        if (!snap.exists()) {
          notify({ type: "error", message: "Order not found." });
        } else {
          setOrder(snap.data() as Order);
        }
      } catch {
        notify({ type: "error", message: "Failed to load order." });
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId, user, notify]);

  if (loadingAuth || loading) return <Loading />;
  if (!order) return null;

  return (
    <>
      {notification && (
        <Notification {...notification} onClose={clearNotification} />
      )}
      <Navbar isScrolled isLoggedIn={!!user} />

      <main className="min-h-screen bg-gray-50 p-4 text-gray-800 mt-10">
        <div className="container mx-auto text-center space-y-6">
          <h1
            className="text-4xl font-semibold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Thank you for your order!
          </h1>
          <p>
            Your order <strong>#{orderId}</strong> has been received.
          </p>

          <div className="bg-white p-6 rounded shadow max-w-md mx-auto text-left">
            <h2 className="text-2xl font-medium mb-4">Order summary</h2>
            <ul className="space-y-2">
              {order.products.map((p) => (
                <li key={p.productId} className="flex justify-between">
                  <span>
                    {p.name} × {p.quantity}
                  </span>
                  <span>€ {(p.price * p.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t pt-2 flex justify-between font-semibold">
              <span>Total:</span>
              <span>€ {order.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}
