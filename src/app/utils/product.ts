
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Product } from "../types/product";

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
