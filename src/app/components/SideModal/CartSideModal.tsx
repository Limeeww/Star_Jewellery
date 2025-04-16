"use client";

import React from "react";
import SideModal from "../SideModal/SideModal";
import CartItemComponent from "../CartItem/CartItemComponent";
import LinkButtonForm from "../FormComponents/LinkButtonForm";
import {
  incrementQuantity,
  decrementQuantity,
  removeItem,
} from "../../utils/cartActions";
import { CartItem } from "../../types/cartItem";
import { User } from "firebase/auth";

interface CartSideModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  user: User | null;
  added?: boolean;
}

function CartSideModal({
  isOpen,
  onClose,
  cartItems,
  user,
  added = false,
}: CartSideModalProps) {
  return (
    <SideModal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 h-full flex flex-col max-h-screen overflow-y-auto">
        <div className="flex-1">
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

          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.insert}-${item.materialColor}`}
                className="mb-4"
              >
                <CartItemComponent
                  item={item}
                  onIncrement={() => {
                    if (user?.uid) {
                      incrementQuantity(
                        user.uid,
                        item.productId,
                        item.size,
                        item.insert,
                        item.materialColor
                      );
                    }
                  }}
                  onDecrement={() => {
                    if (user?.uid) {
                      decrementQuantity(
                        user.uid,
                        item.productId,
                        item.size,
                        item.insert,
                        item.materialColor
                      );
                    }
                  }}
                  onRemove={() => {
                    if (user?.uid) {
                      removeItem(
                        user.uid,
                        item.productId,
                        item.size,
                        item.insert,
                        item.materialColor
                      );
                    }
                  }}
                />
              </div>
            ))
          ) : (
            <p>Your cart is currently empty.</p>
          )}
        </div>
        <div className="mt-auto">
          <LinkButtonForm href="/cart" label="View Cart" showArrow />
        </div>
      </div>
    </SideModal>
  );
}

export default CartSideModal;
