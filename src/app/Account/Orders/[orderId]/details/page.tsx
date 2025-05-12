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
import {
  getSubtotal,
  getShippingCost,
  getGiftOptionsTotal,
  getTotal,
} from "@/utils";
import type { GiftOptionsForm } from "@/types/order";
import { LuPrinter, LuLifeBuoy } from "react-icons/lu";

export default function OrderDetailsPage() {
  const { orderId } = useParams() as { orderId: string };
  const { orders, loading, error } = useUserOrders();
  const { notification, notify, clearNotification } = useNotification();

  if (loading) return <Loading />;
  if (error) {
    notify({ type: "error", message: error.message, duration: 5000 });
  }

  const order = orders?.find((o) => o.orderId.toString() === orderId);
  if (!order) {
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
        <p className="text-red-600">Order not found.</p>
      </AccountPageLayout>
    );
  }

  const subtotal = getSubtotal(order.products);
  const shipping = getShippingCost(subtotal);
  const giftTotal = getGiftOptionsTotal(order.giftOptions as GiftOptionsForm);
  const total = getTotal(subtotal, shipping, giftTotal);

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

      <OrderCard order={order} />

      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded shadow-sm">
        <h4 className="font-medium text-gray-700 mb-2">Order Summary</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{subtotal} ₴</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{shipping} ₴</span>
          </div>
          <div className="flex justify-between">
            <span>Gift Options:</span>
            <span>{giftTotal} ₴</span>
          </div>
          <div className="flex justify-between font-semibold text-lg text-gray-800 border-t border-gray-200 pt-2">
            <span>Total:</span>
            <span>{total} ₴</span>
          </div>
        </div>
      </div>
      <div className="space-x-4 mt-4 flex items-center">
        <LinkButton
          text={
            <span className="inline-flex items-center gap-1">
              <LuPrinter size={16} />
              Print Receipt
            </span>
          }
          onClick={() => window.print()}
          className="text-sm text-primary-500 hover:underline"
        />
        <LinkButton
          text={
            <span className="inline-flex items-center gap-1">
              <LuLifeBuoy size={16} />
              Contact Support
            </span>
          }
          href="/support"
          className="text-sm text-primary-500 hover:underline"
        />
      </div>
    </AccountPageLayout>
  );
}
