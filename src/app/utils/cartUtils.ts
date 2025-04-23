import { CartItem } from "../types/cartItem";
import { GiftOptionsForm } from "../types/order";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";


export const getTotalCount = (cartItems: CartItem[]): number =>
  cartItems.reduce((acc, item) => acc + item.quantity, 0);

export const getSubtotal = (cartItems: CartItem[]): number =>
  cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

export const getShippingCost = (subtotal: number): number =>
  subtotal > 100 ? 0 : 50;

export const getGiftOptionsTotal = (giftOptions: GiftOptionsForm): number => {
  const giftPackagingCost = giftOptions.giftPackaging ? 50 : 0;
  const giftMessageCost = giftOptions.giftMessage ? 0 : 0;
  const giftReceiptCost = giftOptions.giftReceipt ? 0 : 0;

  const giftOptionsTotal =
    giftPackagingCost + giftMessageCost + giftReceiptCost;

  return giftOptionsTotal;
};

export const getTotal = (
  subtotal: number,
  shipping: number,
  giftOptionsTotal: number
): number => subtotal + shipping + giftOptionsTotal;

export const useCartItems = (userId: string | null): CartItem[] => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!userId) {
      setCartItems([]);
      return;
    }
    const userDocRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCartItems(data.cartItems || []);
      } else {
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return cartItems;
};
