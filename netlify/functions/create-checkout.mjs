// Creates a Stripe Checkout Session (one-time payment) and returns its URL.
// Called by the paywall and the course page "Get full access" button. Uses
// the Stripe REST API via fetch, so no Stripe SDK dependency is needed.

export default async (req) => {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    const price = process.env.STRIPE_PRICE_ID;
    const site = process.env.SITE_URL || new URL(req.url).origin;
    if (!key || !price) return json({ error: "Checkout is not configured yet." }, 500);

    const body = new URLSearchParams();
    body.set("mode", "payment");
    body.set("line_items[0][price]", price);
    body.set("line_items[0][quantity]", "1");
    // Enables the promo-code field on Stripe checkout (useful for comps/discounts).
    body.set("allow_promotion_codes", "true");
    body.set("success_url", `${site}/unlock/?session_id={CHECKOUT_SESSION_ID}`);
    body.set("cancel_url", `${site}/databricks-data-engineer-associate/`);

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

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export const config = { path: "/api/create-checkout" };
