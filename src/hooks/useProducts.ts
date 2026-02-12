import { useState, useEffect } from "react";
import {
  collection,
  query,
  limit as queryLimit,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useNotification } from "@/hooks/useNotification";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import type { Product } from "@/types/product";

export function useProducts(limitNum: number) {
  const { notify, notification, clearNotification } = useNotification();
  const { user, loading: authLoading } = useAuthStatus();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    setLoading(true);
    const productsRef = collection(db, "products");
    const q = query(productsRef, queryLimit(limitNum));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const items: Product[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Product & {
            imageUrl: string;
            price: number;
            quantitySize: number;
          };
          return {
            id: data.id,
            name: data.name,
            description: data.description,
            slug: data.slug,
            categoryId: data.categoryId,
            variants: data.variants || [],
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            isHidden: data.isHidden || false,
            additionalDescription: data.additionalDescription || "",
            tag: "default",
          };
        });

        setProducts(items);
        if (items.length === 0) {
          notify({ type: "warning", message: "No products found" });
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to products:", err);
        notify({ type: "error", message: "Failed to load products" });
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
      clearNotification();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limitNum, authLoading, user]);

  return {
    products,
    loading: authLoading || loading,
    notification,
    clearNotification,
  };
}
