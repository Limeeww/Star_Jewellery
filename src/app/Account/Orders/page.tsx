"use client";

import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import Loading from "@/app/components/Loading/Loading";
import { useRequireAuth } from "@/hooks/index";
import OrderCard from "../components/OrderCard";
import { useNotification } from "@/hooks/useNotification";
import Notification from "@/app/components/MessageHandling/Notification";

import AccountPageLayout from "@/app/Account/components/AccountPageLayout";
import { usePaginatedUserOrders } from "@/hooks/usePaginatedUserOrders";
import { PaginationControls } from "@/app/components/PaginationControls";

export default function MyOrders() {
  const [user, loadingAuth] = useAuthState(auth);
  useRequireAuth(user ?? null, loadingAuth);

  const { notification, notify, clearNotification } = useNotification();
  const {
    orders,
    loading,
    error,
    page,
    totalPages,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
  } = usePaginatedUserOrders(5);

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
      description="Track your orders in one convenient place. Review order details, status updates, and delivery progress anytime."
    >
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={clearNotification}
        />
      )}

      <div className="space-y-6">
        {orders.map((o) => (
          <OrderCard key={o.orderId} order={o} />
        ))}
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        hasPrev={hasPrev}
        hasNext={hasNext}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </AccountPageLayout>
  );
}
