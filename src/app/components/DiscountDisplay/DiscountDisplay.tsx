"use client";

import React from "react";
import { formatPrice } from "@/app/utils/priceUtils";

interface DiscountDisplayProps {
  originalPrice?: number;
  discountedPrice: number;
  discountName?: string;
  quantity?: number;
  className?: string;
}

export default function DiscountDisplay({
  originalPrice,
  discountedPrice,
  discountName,
  quantity = 1,
  className = "",
}: DiscountDisplayProps) {
  const origTotal = (originalPrice ?? 0) * quantity;
  const discTotal = discountedPrice * quantity;

  return (
    <div
      className={`space-y-1 text-right ${
        originalPrice ? "mb-4" : ""
      } ${className}`}
    >
      {originalPrice && (
        <div className="text-sm text-gray-500 line-through">
          {formatPrice(origTotal)} ₴
        </div>
      )}
      <div className="text-base font-bold text-red-600">
        {formatPrice(discTotal)} ₴
      </div>
      {discountName && (
        <div className="text-xs text-red-500">{discountName}</div>
      )}
    </div>
  );
}
