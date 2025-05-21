import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  limit as queryLimit,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Product } from "@/types/product";
import { useNotification } from "@/hooks/useNotification";

export function useProducts(limitNum: number) {
  const { notify, notification, clearNotification } = useNotification();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    (async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, queryLimit(limitNum));
        const snapshot = await getDocs(q);
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
            imageUrl: data.imageUrl,
            slug: data.slug,
            variantID:
              data.variants && data.variants.length > 0
                ? String(data.variants[0].id)
                : "",
            price: data.price,
            categoryId: data.categoryId,
            variants: data.variants || [],
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            isHidden: data.isHidden || false,
            additionalDescription: data.additionalDescription || "",
            quantitySize: data.quantitySize || 0,
          };
        });

        if (!isMounted) return;
        setProducts(items);

        if (items.length === 0) {
          notify({ type: "warning", message: "No products found" });
        }
      } catch (err) {
        console.error("Error loading products:", err);
        notify({ type: "error", message: "Failed to load products" });
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      clearNotification();
    };
  }, [limitNum]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    products,
    loading,
    notification,
    clearNotification,
  };
}
