"use client";

import React from "react";
import ActionButton from "@/app/components/FormComponents/ActionButton";
import type { PaymentInfo } from "@/types/order";

interface PaymentMethodCardProps {
  paymentMethod: PaymentInfo;
  onEdit?: () => void;
  showDeleteIcon?: boolean;
  onDelete?: () => void;
  className?: string;
}

/**
 * Card component to display a saved payment method.
 * Styles largely mirror AddressCard.
 */
export default function PaymentMethodCard({
  paymentMethod,
  onEdit,
  showDeleteIcon = false,
  onDelete,
  className = "",
}: PaymentMethodCardProps) {
  return (
    <div
      className={`
        relative
        border rounded-lg p-4 flex flex-col justify-between
        border-gray-200
        ${className}
      `}
    >
      {showDeleteIcon && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-3 right-2 p-1 text-gray-400 hover:text-red-600 transition"
          aria-label="Delete payment method"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div>
        {paymentMethod.method === "credit_card" && (
          <>
            <h4 className="font-semibold text-gray-800 mb-2">
              {paymentMethod.cardBrand}
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>{paymentMethod.cardNumberMasked}</div>
              <div>Expires {paymentMethod.cardExpiry}</div>
              <div>{paymentMethod.cardHolderName}</div>
            </div>
          </>
        )}
        {paymentMethod.method === "paypal" && (
          <>
            <h4 className="font-semibold text-gray-800 mb-2">PayPal</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>{paymentMethod.payerEmail}</div>
              <div>Order ID: {paymentMethod.paypalOrderId}</div>
            </div>
          </>
        )}
        {paymentMethod.method === "klarna" && (
          <>
            <h4 className="font-semibold text-gray-800 mb-2">Klarna</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>Order ID: {paymentMethod.klarnaOrderId}</div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {onEdit && (
          <ActionButton
            text="Edit"
            onClick={onEdit}
            className="text-sm font-medium px-3 py-1 rounded flex-1 bg-gray-900 text-white hover:bg-gray-700 transition"
          />
        )}
        {!showDeleteIcon && onDelete && (
          <ActionButton
            text="Remove"
            onClick={onDelete}
            className="text-sm font-medium px-3 py-1 rounded flex-1 bg-red-600 text-white hover:bg-red-700 transition"
          />
        )}
      </div>
    </div>
  );
}
