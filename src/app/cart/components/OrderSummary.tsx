"use client";

import React from "react";
import DiscountDisplay from "@/app/components/DiscountDisplay/DiscountDisplay";
import { formatPrice } from "@/utils/index";
import ActionButton from "@/app/components/FormComponents/ActionButton";

interface OrderSummaryProps {
  originalPrice?: number;
  subtotal: number;
  shipping: number;
  giftOptionsTotal: number;
  total: number;
  onClick?: () => void;
  disabled?: boolean;
  buttonText?: string;
}

export default function OrderSummary({
  originalPrice,
  subtotal,
  shipping,
  giftOptionsTotal,
  total,
  onClick,
  disabled = false,
  buttonText = "Proceed to Checkout",
}: OrderSummaryProps) {
  const shouldDisplayDiscount =
    originalPrice != null && originalPrice > subtotal;

  return (
    <div className="bg-white p-4 rounded shadow space-y-4 w-full">
      <h2 className="text-lg font-semibold mb-2">Order Summary</h2>

      <div className="flex justify-between">
        <p className="text-gray-600">Subtotal</p>
        <div className="font-semibold">
          {shouldDisplayDiscount ? (
            <DiscountDisplay
              originalPrice={originalPrice!}
              discountedPrice={subtotal}
              discountName="Order Discount"
              className="mb-4"
            />
          ) : (
            <p>{formatPrice(subtotal)} ₴</p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <p className="text-gray-600">Shipping</p>
        <p className="font-semibold">
          {shipping === 0 ? "Free" : `${formatPrice(shipping)} ₴`}
        </p>
      </div>

      {giftOptionsTotal > 0 && (
        <div className="flex justify-between">
          <p className="text-gray-600">Gift Options</p>
          <p className="font-semibold">{formatPrice(giftOptionsTotal)} ₴</p>
        </div>
      )}

      <hr />

      <div className="flex justify-between">
        <p className="font-semibold">Total</p>
        <p className="font-semibold">{formatPrice(total)} ₴</p>
      </div>

      <ActionButton
        text={buttonText}
        disabled={disabled}
        onClick={onClick || (() => {})}
        className={`w-full px-6 py-1 rounded text-white transition mt-4 ${
          disabled
            ? "bg-gray-400 cursor-default"
            : "bg-black hover:bg-gray-800"
        }`}
      />
    </div>
  );
}
