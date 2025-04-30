import { useState, useEffect } from "react";
import { db } from "@/firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import type { CartItem } from "@/types/cartItem";

export function useCartItems(userId: string | null) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      return;
    }

    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      const userData = snap.data() as { cartItems?: CartItem[] } | undefined;
      setItems(userData?.cartItems ?? []);
    });

    return () => unsubscribe();
  }, [userId]);

  return items;
}
