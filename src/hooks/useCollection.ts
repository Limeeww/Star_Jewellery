import { useState, useEffect } from "react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection as coll,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { Collection } from "@/types/collection";

export function useCollections(): Collection[] {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const q = query(coll(db, "collections"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const cols: Collection[] = snapshot.docs
          .map((doc) => {
            const data = doc.data() as Partial<Collection>;
            return {
              id: data.id ?? "",
              name: data.name ?? "",
              description: data.description ?? "",
              images: data.images || [],
              isActive: data.isActive ?? false,
              parentCategory: data.parentCategory ?? 0,
              createdAt: data.createdAt ?? Timestamp.fromDate(new Date()),
              productIds: data.productIds ?? [],
            };
          })
          .filter((c) => c.isActive);
        setCollections(cols);
      },
      (err) => {
        console.error("Error loading collections:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  return collections;
}
