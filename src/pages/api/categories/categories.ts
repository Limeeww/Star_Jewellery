import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "@/lib/firebaseAdmin";
import { Category } from "@/types/product";
import { v4 as uuidv4 } from "uuid";
import { uuidToNumber } from "@/hooks/uuidToNumber";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const snapshot = await adminDB.collection("categories").get();
      const categories: Category[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: d.id.toString(),
          name: d.name,
          parentCategory: d.parentCategory ?? null,
        };
      });
      return res.status(200).json({ categories });
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
  }

  if (req.method === "POST") {
    try {
      const body: Omit<Category, "id"> = req.body;

      const numericId = uuidToNumber(uuidv4());
      const idStr = numericId.toString();

      await adminDB
        .collection("categories")
        .doc(idStr)
        .set({ ...body, id: numericId });

      return res.status(201).json({ success: true, id: idStr });
    } catch (err) {
      console.error("Failed to create category:", err);
      return res.status(500).json({ error: "Failed to create category" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
