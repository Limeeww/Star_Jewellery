import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    // Пробуем получить первого пользователя в системе
    const list = await adminAuth.listUsers(1);
    return NextResponse.json({
      message: "✅ Firebase Admin SDK работает!",
      users: list.users.map((u) => ({
        uid: u.uid,
        email: u.email,
        role: u.customClaims?.role || "no role",
      })),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
