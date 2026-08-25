// Server-side Conversions API endpoint. Receives a conversion event from the
// browser and forwards it to Meta with the access token from env, hashing the
// email server side so raw PII never leaves our infrastructure.
//
// The main conversion paths call the shared _meta.mjs helper DIRECTLY (the
// Stripe webhook for Purchase, subscribe.mjs for Lead) so there is no extra
// network hop and the token stays server-only. This HTTP endpoint exists for
// events fired straight from the browser and for isolated testing with Meta's
// Test Events tool.
//
// POST JSON: { event_name, event_id, event_source_url, email?, fbp?, fbc?,
//              value?, currency?, content_ids?, content_type?, content_name? }
// Only a small allow-list of event names is accepted so this cannot be turned
// into an open relay to the pixel.

import { sendCapiEvent, fbCookiesFrom, clientIpFrom } from "./_meta.mjs";

const ALLOWED = new Set(["Lead", "Purchase", "CompleteRegistration", "ViewContent"]);

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export default async (req) => {
  try {
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
    const input = await req.json().catch(() => ({}));

    const eventName = String(input.event_name || "").trim();
    if (!ALLOWED.has(eventName)) return json({ error: "Unsupported event" }, 400);

    const cookies = fbCookiesFrom(req);
    const custom = {};
    if (input.value != null) custom.value = Number(input.value);
    if (input.currency) custom.currency = String(input.currency);
    if (input.content_ids) custom.content_ids = input.content_ids;
    if (input.content_type) custom.content_type = String(input.content_type);
    if (input.content_name) custom.content_name = String(input.content_name);

    const res = await sendCapiEvent({
      eventName,
      eventId: input.event_id ? String(input.event_id) : undefined,
      eventSourceUrl: input.event_source_url ? String(input.event_source_url) : undefined,
      user: {
        email: input.email,
        fbp: input.fbp || cookies.fbp,
        fbc: input.fbc || cookies.fbc,
        ip: clientIpFrom(req),
        userAgent: req.headers.get("user-agent") || "",
      },
      custom,
    });

    // Never leak the raw Meta response body to the client; report success only.
    return json({ ok: res.ok });
  } catch (_e) {
    return json({ error: "Server error" }, 500);
  }
};

export const config = { path: "/api/meta-capi" };
