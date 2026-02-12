import type { NextApiRequest, NextApiResponse } from "next";
import { adminDB } from "@/lib/firebaseAdmin";

interface PublicUser {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const uid = id as string;

  if (req.method === "GET") {
    try {
      const docRef = adminDB.collection("users").doc(uid);
      const snap = await docRef.get();

      if (!snap.exists) {
        return res.status(404).json({ error: "User not found" });
      }

      const data = snap.data() as PublicUser;

      const { firstName, lastName, email } = data;
      return res.status(200).json({ user: { firstName, lastName, email } });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ error: "Failed to fetch user", details: msg });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
