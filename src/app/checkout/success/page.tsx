"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/app/components/Loading/Loading";
import Footer from "@/app/components/Footer/Footer";
import Navbar from "@/app/components/Navbar/Navbar";
import { useNotification } from "@/hooks/useNotification";
import Notification from "@/app/components/MessageHandling/Notification";
import { FcOk } from "react-icons/fc";
import useOrder from "@/hooks/useOrder";
import ActionButton from "@/app/components/FormComponents/ActionButton";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { notification, notify, clearNotification } = useNotification();
  const { user, isLoggedIn, loading: loadingAuth } = useAuthStatus();

  const orderId = params?.get("orderId") ?? null;
  const { order, loading, error } = useOrder(orderId, user ?? null);

  useEffect(() => {
    if (error) {
      notify({ type: "error", message: error });
      router.replace("/");
    }
  }, [error, notify, router]);

  useEffect(() => {
    if (!user && !loadingAuth) router.replace("/login");
  }, [user, loadingAuth, router]);

  if (loadingAuth || loading) return <Loading />;
  if (!order) return null;

  return (
    <>
      {notification && (
        <Notification {...notification} onClose={clearNotification} />
      )}
      <Navbar isScrolled isLoggedIn={isLoggedIn} />

      <main
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-gray-800"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <div className="text-center space-y-6">
          <FcOk className="mx-auto text-6xl" />
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
                <li
                  key={`${p.productId}-${p.variantId}-${p.slug}-${p.size}`}
                  className="flex justify-between"
                >
                  <span>
                    {p.name} × {p.quantity}
                  </span>
                  <span>{(p.price * p.quantity).toFixed(2)} ₴</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t pt-2 flex justify-between font-semibold">
              <span>Total:</span>
              <span>{order.total.toFixed(2)} ₴</span>
            </div>
          </div>

          <ActionButton
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            text="Continue Shopping"
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
