// pages/api/set-role.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../../lib/firebaseAdmin";

type RoleRequestBody = {
  uid: string;
  role: "user" | "admin"; // можно расширить при необходимости
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid authorization token" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    await adminAuth.verifyIdToken(token);

    if (decodedToken.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    const { uid, role } = req.body as RoleRequestBody;

    if (!uid || !role) {
      return res.status(400).json({ error: "Missing uid or role in body" });
    }

    await adminAuth.setCustomUserClaims(uid, { role });

    console.log(`Установка роли '${role}' для пользователя ${uid}`);

    return res
      .status(200)
      .json({ message: `Role '${role}' has been set for user ${uid}` });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    console.error("Set role error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}
