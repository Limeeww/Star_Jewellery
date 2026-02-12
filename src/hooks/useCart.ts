// src/hooks/useCart.ts
import { useState, useEffect, useCallback } from "react";
import { doc, onSnapshot, getDoc, setDoc, updateDoc } from "firebase/firestore";
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

const LOCAL_KEY = "star_cart";

export function useCart(userId: string | null): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (userId) {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const localCart: CartItem[] = JSON.parse(raw);
        localStorage.removeItem(LOCAL_KEY);
        const userRef = doc(db, "users", userId);
        getDoc(userRef).then((snap) => {
          if (!snap.exists()) {
            setDoc(userRef, { cartItems: localCart }, { merge: true });
          } else {
            const serverCart: CartItem[] = snap.data().cartItems || [];
            const merged = [...serverCart];
            localCart.forEach((li) => {
              const idx = merged.findIndex(
                (it) =>
                  it.productId === li.productId &&
                  it.size === li.size &&
                  it.insert === li.insert &&
                  it.materialColor === li.materialColor
              );
              if (idx > -1) merged[idx].quantity += li.quantity;
              else merged.push(li);
            });
            updateDoc(userRef, { cartItems: merged });
          }
        });

        const userRef2 = doc(db, "users", userId);
        const unsub = onSnapshot(userRef2, (snap) => {
          const data = snap.data() as { cartItems?: CartItem[] } | undefined;
          setItems(data?.cartItems ?? []);
        });
        return () => unsub();
      } else {
        const userRef = doc(db, "users", userId);
        const unsub = onSnapshot(userRef, (snap) => {
          const data = snap.data() as { cartItems?: CartItem[] } | undefined;
          setItems(data?.cartItems ?? []);
        });
        return () => unsub();
      }
    } else {
      const raw = localStorage.getItem(LOCAL_KEY);
      setItems(raw ? JSON.parse(raw) : []);
    }
  }, [userId]);

  const persist = useCallback(
    async (newCart: CartItem[]) => {
      setItems(newCart);
      if (userId) {
        const userRef = doc(db, "users", userId);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, { cartItems: newCart }, { merge: true });
        } else {
          await updateDoc(userRef, { cartItems: newCart });
        }
      } else {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(newCart));
        setItems(newCart);
      }
    },
    [userId]
  );

  const addOrIncrement = useCallback(
    async (newItem: CartItem) => {
      const cart = [...items];
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
      await persist(cart);
    },
    [items, persist]
  );

  const incrementItem = useCallback(
    async (item: CartItemIdentifier) => {
      const cart = items.map((it) =>
        it.productId === item.productId &&
        it.size === item.size &&
        it.insert === item.insert &&
        it.materialColor === item.materialColor
          ? { ...it, quantity: it.quantity + 1 }
          : it
      );
      await persist(cart);
    },
    [items, persist]
  );

  const decrementItem = useCallback(
    async (item: CartItemIdentifier) => {
      const cart = items
        .map((it) => {
          if (
            it.productId === item.productId &&
            it.size === item.size &&
            it.insert === item.insert &&
            it.materialColor === item.materialColor
          ) {
            return it.quantity > 1
              ? { ...it, quantity: it.quantity - 1 }
              : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[];
      await persist(cart);
    },
    [items, persist]
  );

  const removeItem = useCallback(
    async (item: CartItemIdentifier) => {
      const cart = items.filter(
        (it) =>
          !(
            it.productId === item.productId &&
            it.size === item.size &&
            it.insert === item.insert &&
            it.materialColor === item.materialColor
          )
      );
      await persist(cart);
    },
    [items, persist]
  );

  return { items, addOrIncrement, incrementItem, decrementItem, removeItem };
}
