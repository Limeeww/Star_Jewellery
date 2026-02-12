import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "@/lib/firebaseAdmin";
import { Order } from "@/types/order";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const snapshot = await adminDB.collection("orders").get();

      const orders: Order[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          orderId: data.orderId,
          userId: data.userId,
          products: data.products || [],
          total: data.total,
          orderDate: data.orderDate,
          updatedAt: data.updatedAt,
          giftOptions: data.giftOptions,
          paymentInfo: data.paymentInfo,
          shippingAddress: data.shippingAddress,
          discountsApplied: data.discountsApplied || [],
          status: data.status,
          usedBonuses: data.usedBonuses ?? 0,
        };
      });

      return res.status(200).json({ orders });
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ error: "Failed to fetch orders", details: err });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
