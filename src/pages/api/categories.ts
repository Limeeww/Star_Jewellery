import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "../../lib/firebaseAdmin";
import { Category } from "@/types/product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const snapshot = await adminDB.collection("categories").get();

    const categories: Category[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: data.id,
        name: data.name,
        image: data.image,
        parentCategory: data.parentCategory ?? null,
      } as Category;
    });

    return res.status(200).json({ categories });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ error: "Failed to fetch categories", details: err });
  }
}
