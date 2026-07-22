// Grants course access after payment, and re-grants a buyer's full set of
// courses on other devices via an access code. Two request shapes (POST JSON):
//   { session_id }  -> from the Stripe success redirect: verify the session is
//                      paid, read the course from its metadata, record the
//                      purchase in the ledger, set the cookie for every course
//                      the buyer owns.
//   { code }        -> a returning buyer unlocking another device: validate the
//                      code, enforce the per-buyer device limit, restore all of
//                      that buyer's courses.
//
// Access is a signed (HMAC) cookie the edge gate verifies. Entitlements live in
// Netlify Blobs keyed by buyer (no external database). The buyer's own success
// link is proof of purchase and never counts against the device limit; the
// shared ACCESS CODE is what the limit caps.

import {
  isCourse, grantCourse, redeemCode, unlockedHeaders, homeFor, json,
} from "./_shared.mjs";

export default async (req) => {
  try {
    const secret = process.env.GATE_SIGNING_SECRET;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!secret) return json({ error: "Not configured" }, 500);

    const input = await req.json().catch(() => ({}));

    if (input.session_id) {
      const r = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(input.session_id)}`,
        { headers: { Authorization: `Bearer ${stripeKey}` } },
      );
      const s = await r.json();
      if (!r.ok) return json({ error: "Could not verify payment" }, 502);
      const paid = s.payment_status === "paid" || s.status === "complete";
      if (!paid) return json({ error: "Payment not completed" }, 402);

      const courseId = (s.metadata && s.metadata.course) || String(input.course || "");
      if (!isCourse(courseId)) return json({ error: "Unknown course." }, 400);

      const buyerId = s.customer || s.id;
      const { rec, code } = await grantCourse(buyerId, courseId, "stripe", secret);
      const { headers, token } = unlockedHeaders(rec.courses, secret);
      return new Response(
        JSON.stringify({ ok: true, code, token, courses: rec.courses, home: homeFor(courseId) }),
        { status: 200, headers },
      );
    }

    if (input.code) {
      const { rec, code, error, status } = await redeemCode(input.code);
      if (error) return json({ error }, status);
      const { headers, token } = unlockedHeaders(rec.courses, secret);
      const primary = rec.courses[rec.courses.length - 1];
      return new Response(
        JSON.stringify({ ok: true, code, token, courses: rec.courses, home: homeFor(primary) }),
        { status: 200, headers },
      );
    }

    return json({ error: "Missing session_id or code" }, 400);
  } catch (_e) {
    return json({ error: "Server error" }, 500);
  }
};

export const config = { path: "/api/unlock" };
