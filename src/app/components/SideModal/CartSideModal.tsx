"use client";

import React from "react";
import SideModal from "../SideModal/SideModal";
import CartItemComponent from "../CartItem/CartItemComponent";
import LinkButtonForm from "../FormComponents/LinkButtonForm";
import { useCartContext } from "@/app/contexts/CartContent";
import { CartItem } from "@/types/cartItem";


interface CartSideModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  added?: boolean;
  onIncrement?: (item: CartItem) => void;  
  onDecrement?: (item: CartItem) => void;
  onRemove?:    (item: CartItem) => void;
}

function CartSideModal({ isOpen, onClose, added = false }: CartSideModalProps) {
  const { cartItems, incrementItem, decrementItem, removeItem } =
    useCartContext();

  return (
    <SideModal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 h-full flex flex-col max-h-screen overflow-y-auto space-y-4"
      style={{ fontFamily: "var(--font-poppins)" }}>
        <div className="flex-1 flex flex-col">
          <h2
            className="text-2xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {added ? "Product successfully added to cart!" : "Your Cart"}
          </h2>
          {added && (
            <p className="mb-4">
              You can continue shopping or view your cart items below.
            </p>
          )}

          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.insert}-${item.materialColor}`}
                className="my-2"
              >
                <CartItemComponent
                  mode="cart"
                  item={item}
                  onIncrement={() =>
                    incrementItem({
                      productId: item.productId,
                      size: item.size,
                      insert: item.insert,
                      materialColor: item.materialColor,
                    })
                  }
                  onDecrement={() =>
                    decrementItem({
                      productId: item.productId,
                      size: item.size,
                      insert: item.insert,
                      materialColor: item.materialColor,
                    })
                  }
                  onRemove={() =>
                    removeItem({
                      productId: item.productId,
                      size: item.size,
                      insert: item.insert,
                      materialColor: item.materialColor,
                    })
                  }
                />
              </div>
            ))
          ) : (
            <p>Your cart is currently empty.</p>
          )}
        </div>
        <div>
          <LinkButtonForm href="/cart" label="View Cart" showArrow />
        </div>
      </div>
    </SideModal>
  );
}

export default CartSideModal;
