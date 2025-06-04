import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "@/lib/firebaseAdmin";
import { Order } from "@/types/order";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  const docRef = adminDB.collection("orders").doc(id as string);

  try {
    if (req.method === "GET") {
      const snap = await docRef.get();

      if (!snap.exists) {
        return res.status(404).json({ error: "Order not found" });
      }

      const data = snap.data() as Order;
      return res.status(200).json({ order: data });
    }

    if (req.method === "PUT") {
      const updated: Order = req.body;

      const updatedWithTimestamp = {
        ...updated,
        updatedAt: new Date(),
      };

      await docRef.set(updatedWithTimestamp, { merge: true });
      return res.status(200).json({ ok: true });
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
