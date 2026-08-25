// Email-capture sink for the readiness quiz result screen.
//
// The quiz posts { email, slug, cert, correct, total, event_id, fbp, fbc,
// event_source_url } here. We:
//   1. Subscribe the address to Buttondown, tagging it with the cert slug so
//      the list is segmented by which certification the visitor just diagnosed.
//   2. Fire a server-side Meta "Lead" via the shared CAPI helper, deduplicated
//      against the browser pixel through the shared event_id, with the email
//      hashed server side for match quality.
//
// The Buttondown API key and Meta token are read from env and never exposed to
// the browser. A CAPI or Buttondown hiccup fails soft: the visitor still sees a
// success state as long as the address was accepted (or already subscribed).

import { sendCapiEvent, fbCookiesFrom, clientIpFrom } from "./_meta.mjs";

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function validEmail(v) {
  const s = String(v || "").trim();
  return s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// A safe, lowercase tag from the cert slug (defence against odd payloads).
function cleanSlug(v) {
  return String(v || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 64);
}

async function subscribeButtondown(email, slug, cert) {
  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) return { ok: false, reason: "not_configured" };

  // Current Buttondown API (api.buttondown.com/v1): email_address + tags +
  // metadata. Double opt-in vs single is controlled by the Buttondown account
  // settings, not here, so we do not force a subscriber state.
  const body = {
    email_address: email,
    tags: slug ? [`ready-${slug}`] : [],
    metadata: { cert: cert || "", quiz_slug: slug || "" },
  };

  try {
    const r = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (r.ok) return { ok: true };
    // 400 with an "already subscribed" style code is a success for our purposes.
    const text = await r.text();
    if (r.status === 400 && /already|exists|subscribed/i.test(text)) return { ok: true, existing: true };
    return { ok: false, reason: `buttondown_${r.status}` };
  } catch (e) {
    return { ok: false, reason: "buttondown_error" };
  }
}

export default async (req) => {
  try {
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
    const input = await req.json().catch(() => ({}));

    const email = String(input.email || "").trim();
    if (!validEmail(email)) return json({ error: "Enter a valid email address." }, 400);

    const slug = cleanSlug(input.slug);
    const cert = String(input.cert || "").slice(0, 120);

    const sub = await subscribeButtondown(email, slug, cert);
    // If the ESP is not configured we still return ok so the field is usable in
    // preview deploys; the real deploy sets BUTTONDOWN_API_KEY.
    const accepted = sub.ok || sub.reason === "not_configured";
    if (!accepted) return json({ error: "Could not sign you up just now. Try again in a moment." }, 502);

    // Server-side Lead, deduped against the browser pixel by event_id.
    const cookies = fbCookiesFrom(req);
    await sendCapiEvent({
      eventName: "Lead",
      eventId: input.event_id ? String(input.event_id) : undefined,
      eventSourceUrl: input.event_source_url ? String(input.event_source_url) : undefined,
      user: {
        email,
        fbp: input.fbp || cookies.fbp,
        fbc: input.fbc || cookies.fbc,
        ip: clientIpFrom(req),
        userAgent: req.headers.get("user-agent") || "",
      },
      custom: { content_name: cert || slug || "readiness-quiz" },
    });

    return json({ ok: true });
  } catch (_e) {
    return json({ error: "Server error" }, 500);
  }
};

export const config = { path: "/api/subscribe" };
