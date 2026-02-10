import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../../lib/firebaseAdmin";

type AdminUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: "admin";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const admins: AdminUser[] = [];

    const getAllUsers = async (nextPageToken?: string) => {
      const result = await adminAuth.listUsers(1000, nextPageToken);

      result.users.forEach((userRecord) => {
        const claims = userRecord.customClaims || {};
        if (claims.role === "admin") {
          admins.push({
            uid: userRecord.uid,
            email: userRecord.email || null,
            displayName: userRecord.displayName || null,
            role: "admin",
          });
        }
      });

      if (result.pageToken) {
        await getAllUsers(result.pageToken);
      }
    };

    await getAllUsers();

    return res.status(200).json({ admins });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching admins:", err);
    return res.status(500).json({ error: "Failed to fetch admin users." });
  }
}
