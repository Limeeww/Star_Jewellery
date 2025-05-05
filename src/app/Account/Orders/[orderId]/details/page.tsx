"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useUserOrders } from "@/hooks/useUserOrders";
import AccountPageLayout from "@/app/Account/components/AccountPageLayout";
import Loading from "@/app/components/Loading/Loading";
import Notification from "@/app/components/MessageHandling/Notification";
import { useNotification } from "@/hooks/useNotification";
import OrderCard from "@/app/Account/components/OrderCard";
import LinkButton from "@/app/Account/components/LinkButton";

export default function OrderDetailsPage() {
  const { orderId } = useParams() as { orderId: string };
  const { orders, loading, error } = useUserOrders();
  const { notification, notify, clearNotification } = useNotification();

  if (loading) return <Loading />;
  if (error) {
    notify({ type: "error", message: error.message, duration: 5000 });
  }

  const order = orders?.find((o) => o.orderId.toString() === orderId);

  return (
    <AccountPageLayout sideLinks={[]} title="Order Details">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={clearNotification}
        />
      )}

      {order ? (
        <OrderCard order={order} />
      ) : (
        <p className="text-red-600">Order not found.</p>
      )}

      <div className="space-x-4 mt-2">
        <LinkButton
          text="Print Receipt"
          onClick={() => window.print()}
          className="text-sm text-primary-500 hover:underline"
        />
        <LinkButton
          text="Contact Support"
          href="/support"
          className="text-sm text-primary-500 hover:underline"
        />
      </div>
    </AccountPageLayout>
  );
}
