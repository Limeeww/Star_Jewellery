import { useState, useEffect, useCallback, useMemo } from "react";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import type { WishlistItem } from "@/types/userTypes";
import type { Identifier } from "@/types/userTypes";


const makeKey = (it: Identifier) =>
  `${it.productId}_${it.variantId}_${it.size}_${it.insert}_${it.materialColor}`;

interface UseWishlistReturn {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (id: Identifier) => Promise<void>;
  toggleItem: (item: WishlistItem) => Promise<void>;
  isWishlisted: (id: Identifier) => boolean;
}

export function useWishlist(userId: string | null): UseWishlistReturn {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      return;
    }
    const ref = doc(db, "users", userId);
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() as { wishList?: WishlistItem[] } | undefined;
      setItems(data?.wishList ?? []);
    });
    return () => unsub();
  }, [userId]);

  const addItem = useCallback(
    async (item: WishlistItem) => {
      if (!userId) return;
      const ref = doc(db, "users", userId);

      setItems((prev) => {
        const key = makeKey(item);
        if (prev.some((it) => makeKey(it) === key)) return prev;
        return [...prev, item];
      });

      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const existing: WishlistItem[] = snap.data().wishList || [];

      if (!existing.some((it) => makeKey(it) === makeKey(item))) {
        const cleanItem = JSON.parse(JSON.stringify(item));
        const newList = [
          ...existing.map((it) => JSON.parse(JSON.stringify(it))),
          cleanItem,
        ];
        await updateDoc(ref, { wishList: newList });
      }
    },
    [userId]
  );

  const removeItem = useCallback(
    async (identifier: Identifier) => {
      if (!userId) return;
      const ref = doc(db, "users", userId);

      setItems((prev) =>
        prev.filter((it) => makeKey(it) !== makeKey(identifier))
      );

      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const existing: WishlistItem[] = snap.data().wishList || [];

      await updateDoc(ref, {
        wishList: JSON.parse(
          JSON.stringify(
            existing.filter((it) => makeKey(it) !== makeKey(identifier))
          )
        ),
      });
    },
    [userId]
  );

  const toggleItem = useCallback(
    async (item: WishlistItem) => {
      const id: Identifier = {
        productId: item.productId,
        variantId: item.variantId,
        slug: item.slug,
        materialColor: item.materialColor,
        insert: item.insert,
        size: item.size,
        image: item.image,
      };
      if (items.some((it) => makeKey(it) === makeKey(id))) {
        await removeItem(id);
      } else {
        await addItem(item);
      }
    },
    [items, addItem, removeItem]
  );

  const isWishlisted = useMemo(() => {
    const keys = new Set(items.map((it) => makeKey(it)));
    return (id: Identifier) => keys.has(makeKey(id));
  }, [items]);

  return { items, addItem, removeItem, toggleItem, isWishlisted };
}
