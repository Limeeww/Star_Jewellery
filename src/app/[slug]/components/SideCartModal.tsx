"use client";

import React from "react";
import SideModal from "@/app/components/SideModal/SideModal";
import CartItemComponent from "@/app/components/CartItem/CartItemComponent";
import LinkButtonForm from "@/app/components/FormComponents/LinkButtonForm";
import { CartItem } from "@/types/cartItem";

interface Props {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onIncrement?: (item: CartItem) => void;
  onDecrement?: (item: CartItem) => void;
  onRemove?: (item: CartItem) => void;
}

export default function SideCartModal({
  isOpen,
  items,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
}: Props) {
  return (
    <SideModal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 h-full flex flex-col max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">
          Product successfully added to cart!
        </h2>

        {items.length > 0 ? (
          items.map((it) => (
            <CartItemComponent
              key={`${it.productId}-${it.size}-${it.insert}-${it.materialColor}`}
              item={it}
              onIncrement={onIncrement ? () => onIncrement(it) : () => {}}
              onDecrement={onDecrement ? () => onDecrement(it) : () => {}}
              onRemove={onRemove ? () => onRemove(it) : () => {}}
            />
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}

        <div className="mt-auto">
          <LinkButtonForm href="/cart" label="View cart" showArrow />
        </div>
      </div>
    </SideModal>
  );
}
