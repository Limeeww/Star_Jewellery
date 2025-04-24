import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "../../../lib/firebaseAdmin";
import { Product } from "@/app/types/product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  const numericId = parseInt(id as string, 10);
  if (isNaN(numericId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const doc = await adminDB
      .collection("products")
      .doc(numericId.toString())
      .get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    const data = doc.data();

    const product: Product = {
      id: data!.id,
      name: data!.name,
      description: data!.description,
      slug: data!.slug,
      categoryId: data!.categoryId,
      variants: data!.variants || [],
      createdAt: data!.createdAt,
      updatedAt: data!.updatedAt,
      isHidden: data!.isHidden,
      additionalDescription: data!.additionalDescription,
    };

    return res.status(200).json({ product });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ error: "Failed to fetch product", details: err });
  }
}
