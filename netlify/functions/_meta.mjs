// Shared Meta Conversions API (CAPI) helper for the server side.
// Underscore-prefixed so Netlify does not treat it as an endpoint, but it is
// still bundled for import by stripe-webhook.mjs (Purchase), subscribe.mjs
// (Lead), and the meta-capi.mjs HTTP endpoint.
//
// Design notes:
//   * The access token is a SECRET and lives only in META_CAPI_TOKEN. It is
//     never sent to the browser. Email is hashed (SHA-256) here, server side,
//     so raw PII never reaches Meta.
//   * Every event carries an event_id. The browser pixel fires the same event
//     with the same event_id, so Meta DEDUPLICATES the pair and keeps the
//     richer record. Purchase derives its id deterministically from the Stripe
//     session id (both sides can compute it without a handshake); Lead uses an
//     id minted by the browser and forwarded to us.
//   * Match quality: we pass hashed email plus fbp/fbc and the client IP and
//     user agent when the caller has them (the webhook does not, the
//     browser-invoked functions do).
//   * The pixel id is not a secret; it can be overridden by env for test setups
//     but falls back to the site's live dataset id.

import crypto from "node:crypto";

const GRAPH_VERSION = "v21.0";
const PIXEL_ID = process.env.META_PIXEL_ID || "4477591755892377";

// Deterministic Purchase event id, shared by the browser pixel and the webhook.
export function purchaseEventId(sessionId) {
  return `pur_${sessionId}`;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// Meta wants email normalised (trim + lowercase) before hashing.
function hashEmail(email) {
  const norm = String(email || "").trim().toLowerCase();
  if (!norm || !norm.includes("@")) return null;
  return sha256(norm);
}

// Build the user_data object, omitting anything we do not have. All keys are
// optional to Meta; more of them means better match quality.
function buildUserData({ email, fbp, fbc, ip, userAgent }) {
  const ud = {};
  const em = hashEmail(email);
  if (em) ud.em = [em];
  if (fbp) ud.fbp = fbp;
  if (fbc) ud.fbc = fbc;
  if (ip) ud.client_ip_address = ip;
  if (userAgent) ud.client_user_agent = userAgent;
  return ud;
}

// Send a single conversion event to Meta. Returns { ok, status, body }.
// Fails soft: if the token is not configured it no-ops with ok:false rather
// than throwing, so a CAPI outage never breaks checkout or signup.
export async function sendCapiEvent({
  eventName,
  eventId,
  eventSourceUrl,
  actionSource = "website",
  eventTime,
  user = {},
  custom = {},
}) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return { ok: false, status: 0, body: "META_CAPI_TOKEN not set" };

  const event = {
    event_name: eventName,
    event_time: eventTime || Math.floor(Date.now() / 1000),
    action_source: actionSource,
    user_data: buildUserData(user),
  };
  if (eventId) event.event_id = eventId;
  if (eventSourceUrl) event.event_source_url = eventSourceUrl;
  if (custom && Object.keys(custom).length) event.custom_data = custom;

  const payload = { data: [event] };
  // Optional: route to Meta Test Events during verification.
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await r.text();
    return { ok: r.ok, status: r.status, body };
  } catch (e) {
    return { ok: false, status: 0, body: String(e && e.message ? e.message : e) };
  }
}

// Pull fbp/fbc from a request's own cookies when the browser hit a function
// directly (used by subscribe.mjs as a fallback if the client did not forward
// them explicitly).
export function fbCookiesFrom(req) {
  const cookie = req.headers.get("cookie") || "";
  const fbp = (cookie.match(/(?:^|;\s*)_fbp=([^;]+)/) || [])[1] || "";
  const fbc = (cookie.match(/(?:^|;\s*)_fbc=([^;]+)/) || [])[1] || "";
  return { fbp: fbp ? decodeURIComponent(fbp) : "", fbc: fbc ? decodeURIComponent(fbc) : "" };
}

// Best-effort client IP from the platform's forwarding headers.
export function clientIpFrom(req) {
  const xff = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || "";
  return xff.split(",")[0].trim();
}
