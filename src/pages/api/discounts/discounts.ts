import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "@/lib/firebaseAdmin";
import { Discount } from "@/types/product";
import { v4 as uuidv4 } from "uuid";
import { uuidToNumber } from "@/hooks/uuidToNumber";
import admin from "firebase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const now = new Date();
      const snapshot = await adminDB.collection("discounts").get();

      const discounts: Discount[] = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();

          const validUntil =
            data.validUntil instanceof admin.firestore.Timestamp
              ? data.validUntil.toDate()
              : new Date(0);

          let priority = data.priority;

          if (validUntil < now && priority !== 0) {
            await doc.ref.update({ priority: 0 });
            priority = 0;
          }

          return {
            id: data.id,
            name: data.name,
            value: data.value,
            type: data.type,
            targetType: data.targetType,
            applicableTo: data.applicableTo || [],
            validFrom: data.validFrom,
            validUntil: data.validUntil,
            priority,
          };
        }),
      );

      return res.status(200).json({ discounts });
    } catch (error) {
      console.error("Error fetching discounts:", error);
      return res.status(500).json({ error: "Failed to fetch discounts" });
    }
  }

  if (req.method === "POST") {
    try {
      const discount: Omit<Discount, "id"> = req.body;
      const numericId = uuidToNumber(uuidv4());

      const validFrom =
        discount.validFrom && "seconds" in discount.validFrom
          ? admin.firestore.Timestamp.fromMillis(
              (discount.validFrom.seconds as number) * 1000,
            )
          : admin.firestore.Timestamp.fromDate(
              (discount.validFrom as admin.firestore.Timestamp).toDate(),
            );

      const validUntil =
        discount.validUntil && "seconds" in discount.validUntil
          ? admin.firestore.Timestamp.fromMillis(
              (discount.validUntil.seconds as number) * 1000,
            )
          : admin.firestore.Timestamp.fromDate(
              (discount.validUntil as admin.firestore.Timestamp).toDate(),
            );

      await adminDB
        .collection("discounts")
        .doc(numericId.toString())
        .set({
          ...discount,
          id: numericId,
          validFrom,
          validUntil,
        });

      return res.status(201).json({ success: true, id: numericId });
    } catch (error) {
      console.error("Error creating discount:", error);
      return res.status(500).json({ error: "Failed to create discount" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
