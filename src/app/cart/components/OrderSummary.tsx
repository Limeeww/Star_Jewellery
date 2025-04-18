"use client";

import React from "react";
import LinkButtonForm from "@/app/components/FormComponents/LinkButtonForm";
import DiscountDisplay from "@/app/components/DiscountDisplay/DiscountDisplay";
import { formatPrice } from "@/app/utils/priceUtils";

interface OrderSummaryProps {
  originalPrice?: number;
  subtotal: number;
  shipping: number;
  giftOptionsTotal: number;
  total: number;
}

export default function OrderSummary({
  originalPrice,
  subtotal,
  shipping,
  giftOptionsTotal,
  total,
}: OrderSummaryProps) {
  const shouldDisplayDiscount =
    originalPrice != null && originalPrice > subtotal;

  return (
    <div className="bg-white p-4 rounded shadow space-y-4 w-full">
      <h2 className="text-lg font-semibold mb-2">Order Summary</h2>

      <div className="flex justify-between">
        <p className="text-gray-600">Subtotal</p>
        <p className="font-semibold">
          {shouldDisplayDiscount && (
            <DiscountDisplay
              originalPrice={originalPrice!}
              discountedPrice={subtotal}
              className="mb-4"
            />
          )}
        </p>
      </div>

      <div className="flex justify-between">
        <p className="text-gray-600">Shipping</p>
        <p className="font-semibold">
          {shipping === 0 ? "Free" : `₴${formatPrice(shipping)}`}
        </p>
      </div>

      {giftOptionsTotal > 0 && (
        <div className="flex justify-between">
          <p className="text-gray-600">Gift Options</p>
          <p className="font-semibold">₴{formatPrice(giftOptionsTotal)}</p>
        </div>
      )}

      <hr />

      <div className="flex justify-between">
        <p className="font-semibold">Total</p>
        <p className="font-semibold">₴{formatPrice(total)}</p>
      </div>

      <LinkButtonForm
        label="Proceed to Checkout"
        href="/checkout"
        showArrow
        className="mt-4"
      />
    </div>
  );
}
