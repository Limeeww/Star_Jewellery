import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";
import { Collection } from "@/types/collection";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const numericId = parseInt(id as string, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({ error: "Invalid collection ID" });
  }

  const docRef = adminDB.collection("collections").doc(numericId.toString());

  try {
    if (req.method === "GET") {
      const snap = await docRef.get();
      if (!snap.exists) {
        return res.status(404).json({ error: "Collection not found" });
      }

      const data = snap.data() as Collection;
      return res.status(200).json({ collection: data });
    }

    if (req.method === "PUT") {
      const updatedFields: Partial<Omit<Collection, "id" | "createdAt">> =
        req.body;

      await docRef.set(
        {
          ...updatedFields,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      await docRef.delete();
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: "API error", details: message });
  }
}
