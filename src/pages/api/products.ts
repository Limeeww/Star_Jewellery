import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "../../lib/firebaseAdmin";
import { Product } from "@/app/types/product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const snapshot = await adminDB.collection("products").get();

    const products: Product[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        slug: data.slug,
        categoryId: data.categoryId,
        variants: data.variants || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        price: data.price,
        isHidden: data.isHidden,
        additionalDescription: data.additionalDescription,
        quantitySize: data.quantitySize || [],
      } as Product;
    });

    return res.status(200).json({ products });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ error: "Failed to fetch products", details: err });
  }
}
