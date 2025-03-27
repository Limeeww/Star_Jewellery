// components/CartItem/CartItem.tsx
import React from "react";
import Image from "next/image";
import { CartItem } from "../../types/cartItem";
import { Product } from "../../types/product";

interface CartItemComponentProps {
  item: CartItem;
  product?: Product; // additional info 
  onIncrement: (productId: number) => void;
  onDecrement: (productId: number) => void;
  onRemove: (productId: number) => void;
}

function CartItemComponent({
  item,
  product,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemComponentProps) {
  const productDescription = product?.description || "";

  return (
    <div className="bg-white p-4 rounded shadow flex items-center gap-4">
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col flex-grow">
        <p className="font-semibold text-sm md:text-base">{item.name}</p>
        {productDescription && (
          <p className="text-xs md:text-sm text-gray-500">
            {productDescription}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDecrement(item.productId)}
          className="px-2 py-1 border text-sm hover:bg-gray-100 transition"
        >
          -
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
        onClick={() => onRemove(item.productId)}
        className="text-sm underline text-gray-700 hover:text-black transition-colors"
      >
        Remove
      </button>
      <p className="font-semibold text-sm md:text-base">
        {(item.price * item.quantity).toFixed(2)} EUR
      </p>
    </div>
  );
}

export default CartItemComponent;
