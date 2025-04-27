import {
  collection,
  getDocs,
  query,
  limit,
  getDoc,
  doc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Discount, Product, ProductVariant } from "@/types/product";
import { Collection } from "@/types/collection";

const norm = (s: string) => s.trim().toLowerCase();

export async function fetchProducts(limitNum: number): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, limit(limitNum));
    const querySnapshot = await getDocs(q);
    const products: Product[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        slug: data.slug,
        variantID:
          data.variants && data.variants.length > 0
            ? data.variants[0].id.toString()
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
    return products;
  } catch (error) {
    console.error("Error fetching products: ", error);
    return [];
  }
}

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
