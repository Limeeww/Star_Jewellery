import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "@/lib/firebaseAdmin";
import { Product } from "@/types/product";
import { uuidToNumber } from "@/hooks/uuidToNumber";
import { v4 as uuidv4 } from "uuid";
import admin from "firebase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
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
          isHidden: data.isHidden,
          additionalDescription: data.additionalDescription,
          tag: data.tag,
        };
      });

      return res.status(200).json({ products });
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ error: "Failed to fetch products", details: err });
    }
  }

  if (req.method === "POST") {
    try {
      const product: Omit<Product, "id"> = req.body;

      const numericId = uuidToNumber(uuidv4());
      const id = numericId.toString();

      await adminDB
        .collection("products")
        .doc(id)
        .set({
          ...product,
          id: numericId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      return res.status(201).json({ success: true, id });
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : "Unknown error";
      return res.status(500).json({
        success: false,
        error: "Failed to create product",
        details: err,
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
