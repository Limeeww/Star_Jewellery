"use client";

import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import Loading from "@/app/components/Loading/Loading";
import { useRequireAuth } from "@/hooks/index";
import { useUserOrders } from "@/hooks/index";
import OrderCard from "../components/OrderCard";
import { useNotification } from "@/hooks/useNotification";
import Notification from "@/app/components/MessageHandling/Notification";

import AccountPageLayout from "@/app/Account/components/AccountPageLayout";

export default function MyOrders() {
  const [user, loadingAuth] = useAuthState(auth);
  useRequireAuth(user ?? null, loadingAuth);

  const { notification, notify, clearNotification } = useNotification();
  const { orders, loading, error } = useUserOrders();

  if (loadingAuth || loading) return <Loading />;
  if (error) {
    notify({
      type: "error",
      message: error.message,
      duration: 5000,
    });
  }

  return (
    <AccountPageLayout
      sideLinks={[]}
      title="My Orders"
      description=" Track your orders in one convenient place. Review order details, status
        updates, and delivery progress anytime."
    >
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={clearNotification}
        />
      )}

      <div
        className="mt-6 space-y-6 text-gray-800"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {orders && orders.length > 0 ? (
          orders.map((order) => <OrderCard key={order.orderId} order={order} />)
        ) : (
          <p>You don&apos;t have orders yet</p>
        )}
      </div>
    </AccountPageLayout>
  );
}
