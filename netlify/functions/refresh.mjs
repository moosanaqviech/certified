// Re-establishes the access cookie from a previously issued signed token.
// Used by the client (course pages, paywall, unlock page) to self-heal when the
// cookie is dropped, e.g. a mobile WebView that does not persist cookies across
// app launches. The token is stored in localStorage (which WebViews keep more
// reliably) and refreshed here.
//
// This does NOT consume a device activation: it only re-issues a cookie from an
// already-valid token (the activation was counted when the code was redeemed).
// The token is HMAC-signed by the server, so a client cannot forge one. The
// course list carried by the token is preserved; a legacy token with no course
// scope is treated as the only course that existed when it was minted.

import { verifyToken, unlockedHeaders, json } from "./_shared.mjs";

export default async (req) => {
  try {
    const secret = process.env.GATE_SIGNING_SECRET;
    if (!secret) return json({ error: "Not configured" }, 500);
    const { token } = await req.json().catch(() => ({}));
    if (!token) return json({ error: "Missing token" }, 400);

    const payload = verifyToken(token, secret);
    if (!payload) return json({ error: "Invalid or expired" }, 401);

    const courses = Array.isArray(payload.c) ? payload.c : ["de-assoc"];
    const { headers, token: newToken } = unlockedHeaders(courses, secret);
    return new Response(JSON.stringify({ ok: true, token: newToken, courses }), { status: 200, headers });
  } catch (_e) {
    return json({ error: "Server error" }, 500);
  }
};

export const config = { path: "/api/refresh" };
