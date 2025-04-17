// components/CartItem/CartItemComponent.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CartItem } from "@/app/types/cartItem";

interface CartItemWithLink extends CartItem {
  slug: string;
  variantId: number;
}

interface CartItemComponentProps {
  item: CartItemWithLink;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export default function CartItemComponent({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemComponentProps) {
  console.log("CartItemComponent", item);
  const href = `/${item.slug}?variantID=${item.variantId}`;

  return (
    <div className="flex items-center bg-white p-4 rounded shadow space-x-4">
      <Link href={href} className="flex-shrink-0 w-20 h-20 overflow-hidden rounded">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={80}
          height={80}
          className="object-cover w-full h-full"
        />
      </Link>

      <div className="flex-1">
        <Link href={href} className="text-lg font-medium hover:underline block">
          {item.name}
        </Link>

        <div className="flex items-center space-x-2 mt-2">
          <button onClick={onDecrement} className="px-2 py-1 bg-gray-200 rounded">–</button>
          <span>{item.quantity}</span>
          <button onClick={onIncrement} className="px-2 py-1 bg-gray-200 rounded">+</button>
          <button onClick={onRemove} className="ml-4 text-red-500 hover:underline">
            Remove
          </button>
        </div>
      </div>

      <div className="font-semibold">
        ₴{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}
