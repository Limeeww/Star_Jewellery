import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../../lib/firebaseAdmin";

type UserItem = {
  uid: string;
  email: string | null;
  role: "admin" | "user" | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const users: UserItem[] = [];

    const getAllUsers = async (nextPageToken?: string) => {
      const result = await adminAuth.listUsers(1000, nextPageToken);

      result.users.forEach((userRecord) => {
        const claims = userRecord.customClaims || {};
        users.push({
          uid: userRecord.uid,
          email: userRecord.email || null,
          role: (claims.role as "admin" | "user") || null,
        });
      });

      if (result.pageToken) {
        await getAllUsers(result.pageToken);
      }
    };

    await getAllUsers();

    return res.status(200).json({ users });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ error: "Failed to fetch users", details: err });
  }
}
