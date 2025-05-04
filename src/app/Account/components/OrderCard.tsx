"use client";

import React from "react";
import Image from "next/image";
import {
  PaymentMethodLabel,
  PaymentStatusLabel,
  type Order,
} from "@/types/order";
import LinkButton from "./LinkButton";

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { orderId, orderDate, products, shippingAddress, paymentInfo, status } =
    order;

  const steps = ["pending", "shipped", "delivered"] as const;
  const progressIndex = steps.indexOf(status as (typeof steps)[number]);

  return (
    <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-primary-700">
          Order #{orderId}
        </h3>
        <LinkButton
          href={`/account/orders/${orderId}/details`}
          text="View Details"
          showArrow
          className="text-primary-500 hover:text-primary-700 underline"
        />
      </div>

      {/* Date */}
      <p className="text-sm text-gray-500 mb-6">
        Placed on:{" "}
        <span className="text-gray-700">{orderDate.toLocaleDateString()}</span>
      </p>

      {/* Products List */}
      <div className="space-y-4 mb-6">
        {products.map((item, index) => (
          <div
            key={`${item.productId}-${item.variantId}-${index}`}
            className="flex items-center space-x-4 bg-white p-4 rounded shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity} × {item.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-2 font-semibold">
            Shipping Address
          </h4>
          <p className="text-sm text-gray-600">
            {shippingAddress.addressLabel}
          </p>
          <p className="text-sm text-gray-600">{shippingAddress.street}</p>
          <p className="text-sm text-gray-600">
            {shippingAddress.city}, {shippingAddress.zipCode}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2 font-semibold">
            Payment
          </h4>
          <p className="text-sm text-gray-600">
            Payment Status:{" "}
            <span
              className={paymentInfo.paid ? "text-green-600" : "text-red-600"}
            >
              {paymentInfo.paid
                ? PaymentStatusLabel.completed
                : PaymentStatusLabel.pending}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Method:{" "}
            {"method" in paymentInfo
              ? PaymentMethodLabel[
                  paymentInfo.method as keyof typeof PaymentMethodLabel
                ]
              : "Unknown"}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Order Status</h4>
          <div className="w-full bg-gray-200 h-2 rounded overflow-hidden mb-2">
            <div
              className="h-2 bg-primary-500 transition-width"
              style={{
                width: `${((progressIndex + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs uppercase text-gray-500">
            <span
              className={
                status !== "pending" ? "text-primary-500" : "text-gray-400"
              }
            >
              Placed
            </span>
            <span
              className={
                String(status) === "shipped" || String(status) === "delivered"
                  ? "text-primary-500"
                  : "text-gray-400"
              }
            >
              Shipped
            </span>
            <span
              className={
                String(status) === "delivered"
                  ? "text-primary-500"
                  : "text-gray-400"
              }
            >
              Delivered
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
