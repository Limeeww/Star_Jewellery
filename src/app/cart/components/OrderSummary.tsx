// components/OrderSummary/OrderSummary.tsx
import { Order } from "@/app/types/userTypes";
import React from "react";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  giftOptionsTotal: number;
  total: number;
}

function OrderSummary({ subtotal, shipping, giftOptionsTotal, total } : OrderSummaryProps) {
    return (
        <div className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
            <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-semibold">€{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="flex justify-between">
                <p className="text-gray-600">Shipping</p>
                <p className="font-semibold">
                    {shipping === 0 ? "Free" : `€${shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </p>
            </div>
            {giftOptionsTotal > 0 && (
                <div className="flex justify-between">
                    <p className="text-gray-600">Gift Options</p>
                    <p className="font-semibold">€{giftOptionsTotal.toFixed(2)}</p>
                </div>
            )}
            <hr />
            <div className="flex justify-between">
                <p className="font-semibold">Total</p>
                <p className="font-semibold">€{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <button className="w-full mt-4 bg-gray-800 text-white py-2 hover:bg-black transition-colors rounded">
                Proceed to Checkout
            </button>
        </div>
    );
}

export default OrderSummary;
