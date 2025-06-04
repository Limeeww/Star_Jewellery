import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "@/lib/firebaseAdmin";
import { Order } from "@/types/order";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id: orderId } = req.query; // ← сюда приходит orderId (не doc.id)

  // ищем документ по полю orderId
  const querySnap = await adminDB
    .collection("orders")
    .where("orderId", "==", Number(orderId)) // если orderId числовой
    .limit(1)
    .get();

  if (querySnap.empty) {
    return res.status(404).json({ error: "Order not found" });
  }

  // первый (и единственный) найденный документ
  const docSnap = querySnap.docs[0];
  const docRef = docSnap.ref;

  try {
    switch (req.method) {
      /* ───── GET ───── */
      case "GET": {
        const data = docSnap.data() as Order;
        return res.status(200).json({ order: data, docId: docSnap.id });
      }

      /* ───── PUT ───── */
      case "PUT": {
        const updated: Order = req.body;
        await docRef.set(
          { ...updated, updatedAt: new Date() },
          { merge: true }
        );
        return res.status(200).json({ ok: true });
      }

      /* ───── DELETE ───── */
      case "DELETE": {
        await docRef.delete();
        return res.status(204).end();
      }

      /* ───── Fallback ───── */
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: "API error", details: msg });
  }
}
