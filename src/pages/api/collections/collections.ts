import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "@/lib/firebaseAdmin";
import { Collection } from "@/types/collection";
import { v4 as uuidv4 } from "uuid";
import { uuidToNumber } from "@/hooks/uuidToNumber";
import admin from "firebase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const snapshot = await adminDB.collection("collections").get();
      const collections: Collection[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.id.toString(),
          name: data.name,
          description: data.description,
          images: data.images || [],
          parentCategory: data.parentCategory,
          isActive: data.isActive,
          createdAt: data.createdAt,
          productIds: data.productIds || [],
        };
      });
      return res.status(200).json({ collections });
    } catch (error) {
      console.error("Ошибка при чтении коллекций:", error);
      return res.status(500).json({ error: "Failed to fetch collections" });
    }
  }

  if (req.method === "POST") {
    try {
      const newCol: Omit<Collection, "id" | "createdAt"> = req.body;
      const numericId = uuidToNumber(uuidv4());
      const idStr = numericId.toString();
      await adminDB
        .collection("collections")
        .doc(idStr)
        .set({
          ...newCol,
          id: numericId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      return res.status(201).json({ success: true, id: idStr });
    } catch (error) {
      console.error("Ошибка при создании коллекции:", error);
      return res.status(500).json({ error: "Failed to create collection" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
