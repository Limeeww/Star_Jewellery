import { useState, useEffect, useCallback } from "react";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import type { CartItem } from "@/types/cartItem";

export type CartItemIdentifier = Pick<
  CartItem,
  "productId" | "size" | "insert" | "materialColor"
>;

interface UseCartReturn {
  items: CartItem[];
  addOrIncrement: (newItem: CartItem) => Promise<void>;
  incrementItem: (item: CartItemIdentifier) => Promise<void>;
  decrementItem: (item: CartItemIdentifier) => Promise<void>;
  removeItem: (item: CartItemIdentifier) => Promise<void>;
}

export function useCart(userId: string | null): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      return;
    }
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      const data = snap.data() as { cartItems?: CartItem[] } | undefined;
      setItems(data?.cartItems ?? []);
    });
    return () => unsubscribe();
  }, [userId]);

  const addOrIncrement = useCallback(
    async (newItem: CartItem) => {
      if (!userId) return;
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;

      const cart: CartItem[] = snap.data().cartItems || [];
      const idx = cart.findIndex(
        (it) =>
          it.productId === newItem.productId &&
          it.size === newItem.size &&
          it.insert === newItem.insert &&
          it.materialColor === newItem.materialColor
      );

      if (idx > -1) {
        cart[idx].quantity += newItem.quantity;
      } else {
        cart.push(newItem);
      }

      await updateDoc(userRef, { cartItems: cart });
    },
    [userId]
  );

  const incrementItem = useCallback(
    async (item: CartItemIdentifier) => {
      if (!userId) return;
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;

      const cart: CartItem[] = snap.data().cartItems || [];
      const updated = cart.map((it) =>
        it.productId === item.productId &&
        it.size === item.size &&
        it.insert === item.insert &&
        it.materialColor === item.materialColor
          ? { ...it, quantity: it.quantity + 1 }
          : it
      );
      await updateDoc(userRef, { cartItems: updated });
    },
    [userId]
  );

  const decrementItem = useCallback(
    async (item: CartItemIdentifier) => {
      if (!userId) return;
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;

      const cartOrNull: (CartItem | null)[] = snap.data().cartItems || [];
      const filtered = cartOrNull
        .map((it) =>
          it &&
          it.productId === item.productId &&
          it.size === item.size &&
          it.insert === item.insert &&
          it.materialColor === item.materialColor
            ? it.quantity > 1
              ? { ...it, quantity: it.quantity - 1 }
              : null
            : it
        )
        .filter(Boolean) as CartItem[];
      await updateDoc(userRef, { cartItems: filtered });
    },
    [userId]
  );

  const removeItem = useCallback(
    async (item: CartItemIdentifier) => {
      if (!userId) return;
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;

      const cart: CartItem[] = snap.data().cartItems || [];
      const filtered = cart.filter(
        (it) =>
          !(
            it.productId === item.productId &&
            it.size === item.size &&
            it.insert === item.insert &&
            it.materialColor === item.materialColor
          )
      );
      await updateDoc(userRef, { cartItems: filtered });
    },
    [userId]
  );

  return { items, addOrIncrement, incrementItem, decrementItem, removeItem };
}
