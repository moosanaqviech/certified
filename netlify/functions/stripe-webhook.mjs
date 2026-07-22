// Stripe webhook: the source of truth for entitlements. On
// checkout.session.completed it records the purchased course in the buyer's
// ledger, independent of whether the buyer's browser ever reaches the success
// redirect (closed tab, flaky network). unlock.mjs writes the same record on the
// redirect path, and grantCourse is idempotent, so the two never conflict.
//
// Signature is verified manually (no Stripe SDK) using STRIPE_WEBHOOK_SECRET:
// Stripe signs `${timestamp}.${rawBody}` with HMAC-SHA256 (hex), sent in the
// Stripe-Signature header as `t=...,v1=...`.

import crypto from "node:crypto";
import { isCourse, grantCourse } from "./_shared.mjs";

const TOLERANCE_SECONDS = 300;

function verifyStripeSignature(raw, header, secret) {
  if (!header) return false;
  const parts = {};
  for (const kv of header.split(",")) {
    const i = kv.indexOf("=");
    if (i > 0) {
      const k = kv.slice(0, i);
      const v = kv.slice(i + 1);
      if (!(k in parts)) parts[k] = v; // keep first of each key
    }
  }
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;

  const expected = crypto.createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
  const a = Buffer.from(v1);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  const age = Math.floor(Date.now() / 1000) - parseInt(t, 10);
  return Number.isFinite(age) && Math.abs(age) < TOLERANCE_SECONDS;
}

export default async (req) => {
  try {
    const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signSecret = process.env.GATE_SIGNING_SECRET;
    if (!whSecret || !signSecret) return new Response("Not configured", { status: 500 });

    const raw = await req.text();
    const sig = req.headers.get("stripe-signature") || "";
    if (!verifyStripeSignature(raw, sig, whSecret)) {
      return new Response("Bad signature", { status: 400 });
    }

    const event = JSON.parse(raw);
    if (event.type === "checkout.session.completed") {
      const s = event.data.object || {};
      const paid = s.payment_status === "paid" || s.status === "complete";
      const courseId = s.metadata && s.metadata.course;
      const buyerId = s.customer || s.id;
      if (paid && buyerId && isCourse(courseId)) {
        await grantCourse(buyerId, courseId, "webhook", signSecret);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (_e) {
    return new Response("Server error", { status: 500 });
  }
};

export const config = { path: "/api/stripe-webhook" };
