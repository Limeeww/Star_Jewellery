import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, name, uid } = req.body;

  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { firebaseUID: uid },
    });

    res.status(200).json({ customerId: customer.id });
  } catch {
    res.status(500).json({ error: "Failed to create customer" });
  }
}
