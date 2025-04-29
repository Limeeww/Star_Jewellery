import { useState, useEffect } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import type { CartItem } from "@/types/cartItem";

export function useCartItems(userId: string | null) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      return;
    }
    const q = query(collection(db, "cartItems"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snap) => {
      setItems(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<CartItem, "id">),
        }))
      );
    });
    return () => unsubscribe();
  }, [userId]);

  return items;
}
