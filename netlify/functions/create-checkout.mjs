// Creates a Stripe Checkout Session (one-time payment) and returns its URL.
// Called by each course's paywall and "Get full access" button. Uses the
// Stripe REST API via fetch, so no Stripe SDK dependency is needed.
//
// Associate and Professional are separate products with separate Stripe
// Prices. The request body names which course is being purchased; that
// choice is stamped into the Stripe session's metadata so /api/unlock can
// trust it after payment instead of taking the course from client input.

const COURSES = {
  associate: {
    priceEnv: "STRIPE_PRICE_ID",
    cancelPath: "/databricks-data-engineer-associate/",
  },
  professional: {
    priceEnv: "STRIPE_PRICE_ID_PROFESSIONAL",
    cancelPath: "/databricks-data-engineer-professional/",
  },
};

export default async (req) => {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    const site = process.env.SITE_URL || new URL(req.url).origin;

    const input = await req.json().catch(() => ({}));
    const courseId = COURSES[input.course] ? input.course : "associate";
    const course = COURSES[courseId];
    const price = process.env[course.priceEnv];
    if (!key || !price) return json({ error: "Checkout is not configured yet." }, 500);

    const body = new URLSearchParams();
    body.set("mode", "payment");
    body.set("line_items[0][price]", price);
    body.set("line_items[0][quantity]", "1");
    // Enables the promo-code field on Stripe checkout (useful for comps/discounts).
    body.set("allow_promotion_codes", "true");
    body.set("metadata[course]", courseId);
    body.set("success_url", `${site}/unlock/?session_id={CHECKOUT_SESSION_ID}`);
    body.set("cancel_url", `${site}${course.cancelPath}`);

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
