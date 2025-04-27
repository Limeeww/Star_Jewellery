"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ConfirmModal from "@/app/components/MessageHandling/ConfirmModal";
import { CartItem } from "@/types/cartItem";
import DiscountDisplay from "../DiscountDisplay/DiscountDisplay";

interface CartItemComponentProps {
  item: CartItem & {
    originalPrice?: number;
    discountName?: string;
    slug: string;
    variantId: number;
    description?: string;
  };
  onIncrement: (itemId: number) => void;
  onDecrement: (itemId: number) => void;
  onRemove: (itemId: number) => void;
}

export default function CartItemComponent({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemComponentProps) {
  const href = `/${item.slug}?variantID=${item.variantId}`;
  const hasDiscount =
    item.originalPrice != null && item.originalPrice > item.price;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionIsRemove, setActionIsRemove] = useState(false);

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onDecrement(item.productId);
    } else {
      setActionIsRemove(false);
      setConfirmOpen(true);
    }
  };

  const handleRemove = () => {
    setActionIsRemove(true);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (actionIsRemove) {
      onRemove(item.productId);
    } else {
      onDecrement(item.productId);
    }
    setConfirmOpen(false);
  };

  return (
    <>
      <div className="w-full rounded flex-wrap bg-white p-4 shadow-lg flex items-center gap-4">
        <Link href={href} className="flex-shrink-0">
          <div className="relative w-16 h-16">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover rounded"
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
        </div>

        <p className="text-xs text-gray-600 mt-1">
          <span className="font-medium">Size:</span> {item.size} &nbsp;
          <span className="font-medium">Insert:</span> {item.insert} &nbsp;
          <span className="font-medium">Color:</span> {item.materialColor}
        </p>

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

        <button
          onClick={handleRemove}
          className="text-sm underline text-red-600 hover:text-black transition-colors"
        >
          Remove
        </button>

        <div className="ml-auto text-right">
          {hasDiscount && <DiscountDisplay discountedPrice={item.price} />}
        </div>
      </div>

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
    </>
  );
}
