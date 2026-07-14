// Grants course access after payment, and re-grants it on other devices via
// an access code. Two request shapes (POST JSON):
//   { session_id }  -> from the Stripe success redirect: verify the session is
//                      paid, mint/lookup the buyer's access code, set the cookie.
//   { code }        -> a returning buyer unlocking another device: validate the
//                      code and enforce the per-purchase activation limit.
//
// Access is a signed (HMAC) cookie the edge gate verifies. Activation counts
// live in Netlify Blobs (no external database). The buyer's own success link is
// treated as proof of purchase and always unlocks; the shared ACCESS CODE is
// what the activation limit caps.
//
// Associate and Professional are separate products, so every access record
// and cookie is scoped to a course. Which course a Stripe session paid for
// comes from that session's own metadata (set by /api/create-checkout), never
// from client input, so a buyer cannot unlock a course they did not pay for.

import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

const LIMIT = parseInt(process.env.ACTIVATION_LIMIT || "3", 10);
const COOKIE_DAYS = 60;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I, O, 0, 1

const COURSES = {
  associate: { cookieName: "cc_access", uiCookieName: "cc_ui" },
  professional: { cookieName: "cc_access_pro", uiCookieName: "cc_ui_pro" },
};

function courseOf(id) {
  return COURSES[id] ? id : "associate";
}

function sign(payloadObj, secret) {
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function deriveCode(seed, secret) {
  const h = crypto.createHmac("sha256", secret).update("code:" + seed).digest();
  let s = "";
  for (let i = 0; i < 12; i++) s += CODE_ALPHABET[h[i] % CODE_ALPHABET.length];
  return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;
}

function unlockedResponse(secret, code, courseId) {
  const course = COURSES[courseOf(courseId)];
  const maxAge = COOKIE_DAYS * 86400;
  const exp = Math.floor(Date.now() / 1000) + maxAge;
  const token = sign({ v: 1, exp, course: courseOf(courseId) }, secret);
  const headers = new Headers({ "content-type": "application/json", "cache-control": "no-store" });
  headers.append("set-cookie", `${course.cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`);
  // Non-HttpOnly hint so the course page can show the unlocked state (not a security boundary).
  headers.append("set-cookie", `${course.uiCookieName}=1; Path=/; Secure; SameSite=Lax; Max-Age=${maxAge}`);
  // token is returned so the client can persist it (localStorage) and re-auth
  // via /api/refresh if the cookie is later dropped (e.g. mobile WebViews).
  return new Response(JSON.stringify({ ok: true, code, token, course: courseOf(courseId) }), { status: 200, headers });
}

export default async (req) => {
  try {
    const secret = process.env.GATE_SIGNING_SECRET;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!secret) return json({ error: "Not configured" }, 500);

    const input = await req.json().catch(() => ({}));
    const store = getStore("access-codes");

    if (input.session_id) {
      const r = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(input.session_id)}`,
        { headers: { Authorization: `Bearer ${stripeKey}` } },
      );
      const s = await r.json();
      if (!r.ok) return json({ error: "Could not verify payment" }, 502);
      const paid = s.payment_status === "paid" || s.status === "complete";
      if (!paid) return json({ error: "Payment not completed" }, 402);

      // The course comes from the session's own metadata (set server-side at
      // checkout creation), never from the client, so it cannot be spoofed.
      const courseId = courseOf(s.metadata && s.metadata.course);
      const code = deriveCode(`${courseId}:${s.customer || s.id}`, secret);
      const rec = await store.get(code, { type: "json" });
      if (!rec) {
        await store.setJSON(code, { activations: 1, limit: LIMIT, created: Date.now(), source: "stripe", course: courseId });
      }
      return unlockedResponse(secret, code, courseId);
    }

    if (input.code) {
      const code = String(input.code).trim().toUpperCase();
      const rec = await store.get(code, { type: "json" });
      if (!rec) return json({ error: "That code was not recognised." }, 404);
      const limit = rec.limit || LIMIT;
      if ((rec.activations || 0) >= limit) {
        return json({ error: `This code has already been used on ${limit} devices.` }, 403);
      }
      rec.activations = (rec.activations || 0) + 1;
      await store.setJSON(code, rec);
      // Codes created before Professional existed have no course field; they
      // were all Associate purchases, so default to that.
      return unlockedResponse(secret, code, courseOf(rec.course));
    }

    return json({ error: "Missing session_id or code" }, 400);
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

export const config = { path: "/api/unlock" };
