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
    <div className={`space-y-1 ${originalPrice ? "mb-4" : ""} ${className}`}>
      {originalPrice && (
        <p className="text-sm text-gray-500 line-through">
          {formatPrice(origTotal)} ₴
        </p>
      )}
      <p className="text-base font-bold text-red-600">
        {formatPrice(discTotal)} ₴
      </p>
      {discountName && <p className="text-xs text-red-500">{discountName}</p>}
    </div>
  );
}
