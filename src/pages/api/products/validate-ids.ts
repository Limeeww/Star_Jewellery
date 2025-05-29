import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "@/lib/firebaseAdmin";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const chunks = chunkArray(ids, 10);
    let foundIds: number[] = [];

    for (const chunk of chunks) {
      const snapshot = await adminDB
        .collection("products")
        .where("id", "in", chunk)
        .get();

      foundIds = foundIds.concat(snapshot.docs.map((doc) => doc.data().id));
    }

    const invalidIds = ids.filter((id) => !foundIds.includes(id));
    return res.status(200).json({ invalidIds });
  } catch (error) {
    console.error("Error validating product IDs:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
