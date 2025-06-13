"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ConfirmModal from "@/app/components/MessageHandling/ConfirmModal";
import { CartItem } from "@/types/cartItem";
import DiscountDisplay from "../DiscountDisplay/DiscountDisplay";

interface CartItemComponentProps {
  item: CartItem;
  mode?: "cart" | "order";
  onIncrement?: (productId: number) => void;
  onDecrement?: (productId: number) => void;
  onRemove?: (productId: number) => void;
}

export default function CartItemComponent({
  item,
  mode = "cart",
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemComponentProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionIsRemove, setActionIsRemove] = useState(false);
  if (mode === "order") {
    return (
      <div className="flex items-center space-x-4 bg-white p-4 rounded shadow-sm">
        <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-contain object-center"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">{item.name}</p>
        </div>
        <p className="text-sm text-gray-600 whitespace-nowrap">
          Qty: {item.quantity} × {item.price} ₴
        </p>
      </div>
    );
  }

  const href = `/${item.slug}?variantID=${item.variantId}`;
  const hasDiscount =
    item.originalPrice != null && item.originalPrice > item.price;

  const handleDecrement = () => {
    if (!onDecrement) return;
    if (item.quantity > 1) {
      onDecrement(item.productId);
    } else {
      setActionIsRemove(false);
      setConfirmOpen(true);
    }
  };

  const handleRemove = () => {
    if (!onRemove) return;
    setActionIsRemove(true);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (actionIsRemove) {
      onRemove?.(item.productId);
    } else {
      onDecrement?.(item.productId);
    }
    setConfirmOpen(false);
  };

  return (
    <>
      <div className="w-full border rounded flex-wrap bg-white p-4 flex items-center gap-4">
        <Link href={href} className="flex-shrink-0">
          <div className="relative w-16 h-16">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
             className="object-cover object-center"
            />
          </div>
        </Link>

        <div className="flex flex-col flex-grow min-w-0">
          <Link
            href={href}
            className="block truncate font-semibold text-sm md:text-base hover:underline"
          >
            {item.name}
          </Link>
          {item.description && (
            <p className="text-xs md:text-sm text-gray-500 truncate">
              {item.description}
            </p>
          )}

          <p className="text-xs text-gray-600 mt-1">
            <span className="font-medium">Size:</span> {item.size} &nbsp;
            <span className="font-medium">Insert:</span> {item.insert} &nbsp;
            <span className="font-medium">Color:</span> {item.materialColor}
          </p>
        </div>

        {onIncrement && onDecrement && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              className="px-2 py-1 border text-sm hover:bg-gray-100 transition"
            >
              –
            </button>
            <span className="w-6 text-center">{item.quantity}</span>
            <button
              onClick={() => onIncrement(item.productId)}
              className="px-2 py-1 border text-sm hover:bg-gray-100 transition"
            >
              +
            </button>
          </div>
        )}

        {onRemove && (
          <button
            onClick={handleRemove}
            className="text-sm underline text-red-600 hover:text-black transition-colors"
          >
            Remove
          </button>
        )}

        <div className="ml-auto text-right font-semibold">
          {hasDiscount ? (
            <DiscountDisplay discountedPrice={item.price} />
          ) : (
            <p className="font-medium">{item.price} ₴</p>
          )}
        </div>
      </div>

      {(onDecrement || onRemove) && (
        <ConfirmModal
          isOpen={confirmOpen}
          title={actionIsRemove ? "Remove Item" : "Decrease Quantity"}
          message={
            actionIsRemove
              ? "Are you sure you want to remove this item from your cart?"
              : "Quantity will become zero. Remove item?"
          }
          cancelLabel="Cancel"
          confirmLabel={actionIsRemove ? "Remove" : "Yes"}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
