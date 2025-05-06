import { useState, useEffect, useCallback, useMemo } from "react";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { WishlistItem } from "@/types/userTypes";

type Identifier = Omit<WishlistItem, "price">;

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
      const data = snap.data() as
        | { wishListItems?: WishlistItem[] }
        | undefined;
      setItems(data?.wishListItems ?? []);
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
      const list: WishlistItem[] = snap.data().wishListItems || [];
      if (!list.some((it) => makeKey(it) === makeKey(item))) {
        await updateDoc(ref, { wishListItems: [...list, item] });
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
      const list: WishlistItem[] = snap.data().wishListItems || [];
      await updateDoc(ref, {
        wishListItems: list.filter((it) => makeKey(it) !== makeKey(identifier)),
      });
    },
    [userId]
  );

  const toggleItem = useCallback(
    async (item: WishlistItem) => {
      const id: Identifier = {
        productId: item.productId,
        variantId: item.variantId,
        size: item.size,
        insert: item.insert,
        materialColor: item.materialColor,
        slug: item.slug,
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

  const keySet = useMemo(() => {
    const s = new Set<string>();
    items.forEach((it) => s.add(makeKey(it)));
    return s;
  }, [items]);

  const isWishlisted = useCallback(
    (identifier: Identifier) => keySet.has(makeKey(identifier)),
    [keySet]
  );

  return { items, addItem, removeItem, toggleItem, isWishlisted };
}
