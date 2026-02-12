import { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "../../../lib/firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { productId, variants } = req.body;

  try {
    const productRef = adminDB.collection("products").doc(productId);
    await productRef.update({ variants });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating variants:", error);
    res.status(500).json({ error: "Failed to update variants" });
  }
}
