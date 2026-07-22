// Creates a Stripe Checkout Session (one-time payment) for a single course and
// returns its URL. Called by the paywall 402 page and each course page's "Get
// full access" button, which POST { course: "<courseId>" }. Uses the Stripe
// REST API via fetch, so no Stripe SDK dependency is needed.

import { isCourse, priceFor, homeFor, json } from "./_shared.mjs";

export default async (req) => {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    const site = process.env.SITE_URL || new URL(req.url).origin;

    const input = await req.json().catch(() => ({}));
    const course = String(input.course || "").trim();
    if (!isCourse(course)) return json({ error: "Unknown course." }, 400);

    const price = priceFor(course);
    if (!key || !price) return json({ error: "Checkout is not configured yet." }, 500);

    const body = new URLSearchParams();
    body.set("mode", "payment");
    body.set("line_items[0][price]", price);
    body.set("line_items[0][quantity]", "1");
    // Enables the promo-code field on Stripe checkout (useful for comps/discounts).
    body.set("allow_promotion_codes", "true");
    // Carried through to the success redirect and the webhook so both know which
    // course was bought without trusting the client.
    body.set("metadata[course]", course);
    body.set("success_url", `${site}/unlock/?session_id={CHECKOUT_SESSION_ID}`);
    body.set("cancel_url", `${site}${homeFor(course)}`);

    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    const data = await r.json();
    if (!r.ok) return json({ error: data?.error?.message || "Stripe error" }, 502);
    return json({ url: data.url });
  } catch (_e) {
    return json({ error: "Server error" }, 500);
  }
};

export const config = { path: "/api/create-checkout" };
