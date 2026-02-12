import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  const { customerId, paymentMethodId } = req.body;

  try {
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    res.status(200).json({ success: true });
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred.",
    });
  }
}
