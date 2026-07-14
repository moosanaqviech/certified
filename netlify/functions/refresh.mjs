// Re-establishes the access cookie from a previously issued signed token.
// Used by the client (course page, paywall, unlock page) to self-heal when the
// cookie is dropped, e.g. a mobile WebView that does not persist cookies across
// app launches. The token is stored in localStorage (which WebViews keep more
// reliably) and refreshed here.
//
// This does NOT consume a device activation: it only re-issues a cookie from an
// already-valid token (the activation was counted when the code was redeemed).
// The token is HMAC-signed by the server, so a client cannot forge one.
//
// The course a token belongs to travels inside the token's own signed payload
// (stamped there by /api/unlock), so the right cookie pair is reissued without
// trusting anything the client sends beyond the token itself. Tokens minted
// before Professional existed have no course field; they were all Associate,
// so that's the default.

import crypto from "node:crypto";

const COOKIE_DAYS = 60;

const COURSES = {
  associate: { cookieName: "cc_access", uiCookieName: "cc_ui" },
  professional: { cookieName: "cc_access_pro", uiCookieName: "cc_ui_pro" },
};

function courseOf(id) {
  return COURSES[id] ? id : "associate";
}

function b64urlJson(obj) {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}
function sign(payloadB64, secret) {
  return crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
}
function verify(token, secret) {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payloadB64, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    if (typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000)) return payload;
  } catch (_e) { /* fall through */ }
  return null;
}

export default async (req) => {
  try {
    const secret = process.env.GATE_SIGNING_SECRET;
    if (!secret) return json({ error: "Not configured" }, 500);
    const { token } = await req.json().catch(() => ({}));
    if (!token) return json({ error: "Missing token" }, 400);
    const payload = verify(token, secret);
    if (!payload) return json({ error: "Invalid or expired" }, 401);

    const courseId = courseOf(payload.course);
    const course = COURSES[courseId];

    // Re-issue a fresh cookie + token (sliding 60-day expiry). No activation used.
    const maxAge = COOKIE_DAYS * 86400;
    const exp = Math.floor(Date.now() / 1000) + maxAge;
    const payloadB64 = b64urlJson({ v: 1, exp, course: courseId });
    const newToken = `${payloadB64}.${sign(payloadB64, secret)}`;
    const headers = new Headers({ "content-type": "application/json", "cache-control": "no-store" });
    headers.append("set-cookie", `${course.cookieName}=${newToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`);
    headers.append("set-cookie", `${course.uiCookieName}=1; Path=/; Secure; SameSite=Lax; Max-Age=${maxAge}`);
    return new Response(JSON.stringify({ ok: true, token: newToken, course: courseId }), { status: 200, headers });
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

export const config = { path: "/api/refresh" };
