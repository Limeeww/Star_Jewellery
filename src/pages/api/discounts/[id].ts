import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "@/lib/firebaseAdmin";
import { Discount } from "@/types/product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const numericId = parseInt(id as string, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({ error: "Invalid discount ID" });
  }

  const docRef = adminDB.collection("discounts").doc(numericId.toString());

  try {
    if (req.method === "GET") {
      const snap = await docRef.get();
      if (!snap.exists) {
        return res.status(404).json({ error: "Discount not found" });
      }
      const data = snap.data() as Discount;
      return res.status(200).json({ discount: data });
    }

    if (req.method === "PUT") {
      const updated: Partial<Omit<Discount, "id">> = req.body;

      await docRef.set(updated, { merge: true });

      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      await docRef.delete();
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: "API error", details: message });
  }
}
