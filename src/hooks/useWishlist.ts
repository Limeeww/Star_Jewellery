import { useState, useEffect, useCallback } from "react";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { WishlistItem } from "@/types/userTypes";

interface UseWishlistReturn {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (identifier: Omit<WishlistItem, "price">) => Promise<void>;
  toggleItem: (item: WishlistItem) => Promise<void>;
  isWishlisted: (identifier: Omit<WishlistItem, "price">) => boolean;
}

export function useWishlist(userId: string | null): UseWishlistReturn {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      return;
    }
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      const data = snap.data() as
        | { wishListItems?: WishlistItem[] }
        | undefined;
      setItems(data?.wishListItems ?? []);
    });
    return () => unsubscribe();
  }, [userId]);

  const addItem = useCallback(
    async (item: WishlistItem) => {
      if (!userId) return;
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;

      const list: WishlistItem[] = snap.data().wishListItems || [];
      const exists = list.some(
        (it) =>
          it.productId === item.productId &&    
          it.variantId === item.variantId &&
          it.size === item.size &&
          it.insert === item.insert &&
          it.materialColor === item.materialColor
      );
      if (!exists) {
        list.push(item);
        await updateDoc(userRef, { wishListItems: list });
      }
    },
    [userId]
  );

  const removeItem = useCallback(
    async (identifier: Omit<WishlistItem, "price">) => {
      if (!userId) return;
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;

      const list: WishlistItem[] = snap.data().wishListItems || [];
      const filtered = list.filter(
        (it) =>
          !(
            it.productId === identifier.productId &&
            it.variantId === identifier.variantId &&
            it.size === identifier.size &&
            it.insert === identifier.insert &&
            it.materialColor === identifier.materialColor
          )
      );
      await updateDoc(userRef, { wishListItems: filtered });
    },
    [userId]
  );

  const toggleItem = useCallback(
    async (item: WishlistItem) => {
      const exists = items.some(
        (it) =>
          it.productId === item.productId &&
          it.variantId === item.variantId &&
          it.size === item.size &&
          it.insert === item.insert &&
          it.materialColor === item.materialColor
      );
      if (exists) {
        await removeItem(item);
      } else {
        await addItem(item);
      }
    },
    [items, addItem, removeItem]
  );

  const isWishlisted = useCallback(
    (identifier: Omit<WishlistItem, "price">) =>
      items.some(
        (it) =>
          it.productId === identifier.productId &&
          it.variantId === identifier.variantId &&
          it.size === identifier.size &&
          it.insert === identifier.insert &&
          it.materialColor === identifier.materialColor
      ),
    [items]
  );

  return { items, addItem, removeItem, toggleItem, isWishlisted };
}
