import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}
const auth = getAuth();
const db = getFirestore();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await auth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) throw new Error("User not found");

    let { stripeCustomerId } = userSnap.data()!;

    // Auto-create Stripe Customer if missing (Google sign-in, legacy users, etc.)
    if (!stripeCustomerId) {
      const firebaseUser = await auth.getUser(uid);
      const customer = await stripe.customers.create({
        email: firebaseUser.email || decoded.email || "",
        name: firebaseUser.displayName || "",
        metadata: { firebaseUID: uid },
      });
      stripeCustomerId = customer.id;
      await userRef.update({ stripeCustomerId });
    }

    const intent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      usage: "off_session",
    });

    return res.status(200).json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error(err);
    const errorMessage =
      err instanceof Error ? err.message : "SetupIntent error";
    return res.status(500).json({ error: errorMessage });
  }
}
