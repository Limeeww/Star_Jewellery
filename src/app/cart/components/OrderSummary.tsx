"use client";

import React from "react";
import DiscountDisplay from "@/app/components/DiscountDisplay/DiscountDisplay";
import { formatPrice } from "@/app/utils/priceUtils";
import ActionButton from "@/app/components/FormComponents/ActionButton";

interface OrderSummaryProps {
  originalPrice?: number;
  subtotal: number;
  shipping: number;
  giftOptionsTotal: number;
  total: number;
  onClick?: () => void;
}

export default function OrderSummary({
  originalPrice,
  subtotal,
  shipping,
  giftOptionsTotal,
  total,
  onClick,
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
        text="Proceed to Checkout"
        className="mt-4"
        onClick={onClick || (() => {})}
      />
    </div>
  );
}
