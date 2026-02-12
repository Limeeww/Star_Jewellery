"use client";

import React from "react";
import DiscountDisplay from "@/app/components/DiscountDisplay/DiscountDisplay";
import { formatPrice } from "@/utils/index";
import ActionButton from "@/app/components/FormComponents/ActionButton";
import { LuSparkles } from "react-icons/lu";

interface OrderSummaryProps {
  originalPrice?: number;
  subtotal: number;
  shipping: number;
  giftOptionsTotal: number;
  total: number;
  mode: "cart" | "checkout";
  bonuses?: number;
  usePoints?: boolean;
  loadingBonuses?: boolean;
  onToggleUsePoints?: () => void;
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
  mode,
  bonuses = 0,
  usePoints = false,
  onToggleUsePoints,
  loadingBonuses,
  onClick,
  disabled = false,
  buttonText = "Proceed to Checkout",
}: OrderSummaryProps) {
  const isCheckout = mode === "checkout";

  const shouldDisplayDiscount =
    originalPrice != null && originalPrice > subtotal;

  const accrual = isCheckout ? Math.floor(subtotal * 0.003) : 0;
  const discountPercent =
    isCheckout && usePoints && bonuses >= 100
      ? Math.floor((bonuses / 100) * 5)
      : 0;
  const discountAmount =
    isCheckout && usePoints && bonuses >= 100
      ? +(subtotal * (discountPercent / 100)).toFixed(2)
      : 0;
  const finalTotal = isCheckout
    ? +(subtotal + shipping + giftOptionsTotal - discountAmount).toFixed(2)
    : total;

  return (
    <div
      className="bg-white p-4 rounded shadow space-y-4 w-full"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
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

      {isCheckout && (
        <>
          <hr />
          <div className="flex justify-between">
            <p className="text-gray-600">Points to earn</p>
            <span className="flex items-center gap-1">
              <p className="font-semibold">{accrual}</p>
              <LuSparkles size={16} className="text-cyan-600" />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={usePoints}
                onChange={onToggleUsePoints}
                disabled={bonuses < 100 || loadingBonuses}
                className="h-4 w-4"
              />
              <span>Use points ({bonuses})</span>
            </label>
          </div>
          {usePoints && bonuses! >= 100 && (
            <div className="flex justify-between">
              <p className="text-gray-600">Discount ({discountPercent}%):</p>
              <p className="font-semibold">–{formatPrice(discountAmount)} ₴</p>
            </div>
          )}
        </>
      )}

      <hr />

      <div className="flex justify-between">
        <p className="font-semibold">Total</p>
        <p className="font-semibold">
          {formatPrice(isCheckout ? finalTotal : total)} ₴
        </p>
      </div>

      <ActionButton
        text={buttonText}
        disabled={disabled}
        onClick={onClick ?? (() => {})}
        className={`w-full px-6 py-1 rounded text-white transition mt-4 ${
          disabled ? "bg-gray-400 cursor-default" : "bg-black hover:bg-gray-800"
        }`}
      />
    </div>
  );
}
