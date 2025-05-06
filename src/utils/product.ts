import {
  collection,
  getDocs,
  query,
  getDoc,
  doc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Discount, Product, ProductVariant } from "@/types/product";
import { Collection } from "@/types/collection";

const norm = (s: string) => s.trim().toLowerCase();

export function findByVariantAttributes(
  variants: ProductVariant[],
  insert: string,
  materialColor: string
): ProductVariant | undefined {
  return (
    variants.find(
      (v) =>
        norm(v.insert) === norm(insert) &&
        norm(v.materialColor) === norm(materialColor)
    ) || variants[0]
  );
}

export async function fetchProductBySlug(
  slug: string
): Promise<Product | null> {
  const snap = await getDocs(
    query(collection(db, "products"), where("slug", "==", slug))
  );
  return snap.empty ? null : (snap.docs[0].data() as Product);
}

export async function fetchCollectionById(
  id: number
): Promise<Collection | null> {
  const snap = await getDoc(doc(db, "collections", id.toString()));
  return snap.exists()
    ? ({ id: +snap.id, ...snap.data() } as Collection)
    : null;
}

export async function fetchActiveDiscounts(
  productId: number
): Promise<Discount[]> {
  const snap = await getDocs(
    query(
      collection(db, "discounts"),
      where("applicableTo", "array-contains", productId)
    )
  );
  const now = Date.now();
  return snap.docs
    .map((d) => ({ id: +d.id, ...d.data() } as Discount))
    .filter(
      (d) =>
        now >= d.validFrom.toDate().getTime() &&
        now <= d.validUntil.toDate().getTime()
    )
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
}
