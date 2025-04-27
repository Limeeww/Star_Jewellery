import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Collection } from "@/types/collection";

export async function fetchCollections(
  limitCount?: number
): Promise<Collection[]> {
  try {
    const collectionsRef = collection(db, "collections");
    const q = limitCount
      ? query(collectionsRef, limit(limitCount))
      : query(collectionsRef);
    const snapshot = await getDocs(q);
    const collections: Collection[] = snapshot.docs.map((doc) => {
      return {
        id: Number(doc.id),
        ...(doc.data() as Omit<Collection, "id">),
      };
    });
    return collections;
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}
