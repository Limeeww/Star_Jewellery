import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Category } from "@/types/product";

export function useCategories(): Category[] {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("id"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs
        .map((doc) => doc.data() as Category)
        .filter((cat) => cat.parentCategory === null);
      setCategories(cats);
    });
    return () => unsubscribe();
  }, []);

  return categories;
}
