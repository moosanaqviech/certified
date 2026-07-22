// Shared helpers for the course-scoped freemium paywall (Node/serverless side).
// Underscore-prefixed, so Netlify ignores it as an endpoint but still bundles it
// for import by create-checkout / unlock / refresh / stripe-webhook.
//
// Design (one-time purchases only, no bundles, no subscriptions):
//   * COURSES is the catalog. One entry per sellable product. Adding a course =
//     add an entry here AND a matching entry in netlify/edge-functions/gate.ts
//     (the edge gate needs prefix + free stems; it cannot import this module
//     because it runs on Deno at the edge).
//   * Entitlements are the source of truth, stored in Netlify Blobs keyed by
//     buyer (Stripe customer id, or the session id for guest checkout). A buyer
//     record aggregates every course they have ever bought, so a returning buyer
//     accumulates access instead of replacing it.
//   * Access is a signed (HMAC) cookie carrying the course list: { v, exp, c }.
//     The edge gate checks the request's course id against c. The cookie is a
//     cache of the ledger, always rebuilt from it on unlock/refresh.
//
// Scales to 50+ products: the catalog is data, the ledger is plain KV keyed by
// buyer, and the cookie lists only the (small) set a given buyer owns.

import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

export const COOKIE_DAYS = 60;
export const DEFAULT_DEVICE_LIMIT = parseInt(process.env.ACTIVATION_LIMIT || "3", 10);
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I, O, 0, 1

// The catalog. priceId is NOT a secret (Stripe Price ids are safe to ship), so
// it lives here as data. A per-course env override wins when set, so test and
// live Stripe modes can point at different Prices without editing code:
//   STRIPE_PRICE_DE_ASSOC=price_...   (course id upper-cased, "-" -> "_")
export const COURSES = {
  "de-assoc": {
    folder: "databricks-data-engineer-associate",
    title: "Databricks DE Associate",
    priceId: "STRIPE_PRICE_ID",
  },
  "de-pro": {
    folder: "databricks-data-engineer-professional",
    title: "Databricks DE Professional",
    priceId: "STRIPE_PRICE_ID_PROFESSIONAL",
  },
   
};

export function isCourse(id) {
  return Object.prototype.hasOwnProperty.call(COURSES, id);
}

export function homeFor(courseId) {
  const c = COURSES[courseId];
  return c ? `/${c.folder}/` : "/";
}

export function priceFor(courseId) {
  const envKey = "STRIPE_PRICE_" + courseId.toUpperCase().replace(/-/g, "_");
  return process.env[envKey] || (COURSES[courseId] && COURSES[courseId].priceId) || "";
}

// One access code per buyer (not per course): entering it restores every course
// that buyer owns. Derived deterministically so we never have to store it.
export function deriveCode(buyerId, secret) {
  const h = crypto.createHmac("sha256", secret).update("code:" + buyerId).digest();
  let s = "";
  for (let i = 0; i < 12; i++) s += CODE_ALPHABET[h[i] % CODE_ALPHABET.length];
  return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;
}

function stores() {
  return { ent: getStore("entitlements"), codes: getStore("access-codes") };
}

// Grant a course to a buyer. Idempotent: safe to call from both the success
// redirect (unlock) and the Stripe webhook, in any order, any number of times.
// Returns the updated buyer record and the buyer's access code.
export async function grantCourse(buyerId, courseId, source, secret) {
  const { ent, codes } = stores();
  let rec = await ent.get(buyerId, { type: "json" });
  if (!rec) {
    rec = { courses: [], devices: 0, deviceLimit: DEFAULT_DEVICE_LIMIT, created: Date.now(), source };
  }
  if (!Array.isArray(rec.courses)) rec.courses = [];
  if (!rec.courses.includes(courseId)) rec.courses.push(courseId);
  await ent.setJSON(buyerId, rec);

  const code = deriveCode(buyerId, secret);
  const map = await codes.get(code, { type: "json" });
  if (!map) await codes.setJSON(code, { buyerId });
  return { rec, code };
}

// Look up a buyer by their access code, enforcing the per-buyer device limit.
// Consumes one device activation on success. Returns { rec } or { error, status }.
export async function redeemCode(rawCode) {
  const { ent, codes } = stores();
  const code = String(rawCode).trim().toUpperCase();
  const map = await codes.get(code, { type: "json" });
  if (!map || !map.buyerId) return { error: "That code was not recognised.", status: 404 };
  const rec = await ent.get(map.buyerId, { type: "json" });
  if (!rec) return { error: "That code was not recognised.", status: 404 };
  const limit = rec.deviceLimit || DEFAULT_DEVICE_LIMIT;
  if ((rec.devices || 0) >= limit) {
    return { error: `This code has already been used on ${limit} devices.`, status: 403 };
  }
  rec.devices = (rec.devices || 0) + 1;
  await ent.setJSON(map.buyerId, rec);
  return { rec, code };
}

export function signToken(courses, secret) {
  const maxAge = COOKIE_DAYS * 86400;
  const exp = Math.floor(Date.now() / 1000) + maxAge;
  const payload = Buffer.from(JSON.stringify({ v: 1, exp, c: courses })).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return { token: `${payload}.${sig}`, maxAge };
}

// Build the Set-Cookie headers granting the given course list. cc_access is the
// HttpOnly signed token the edge gate verifies; cc_ui is a readable (non-secure-
// boundary) hint of owned course ids so the course pages can show unlocked state.
export function unlockedHeaders(courses, secret) {
  const { token, maxAge } = signToken(courses, secret);
  const headers = new Headers({ "content-type": "application/json", "cache-control": "no-store" });
  headers.append("set-cookie", `cc_access=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`);
  headers.append("set-cookie", `cc_ui=${courses.join(".")}; Path=/; Secure; SameSite=Lax; Max-Age=${maxAge}`);
  return { token, headers };
}

// Verify a token we previously signed. Returns the payload or null.
export function verifyToken(token, secret) {
  const dot = String(token).lastIndexOf(".");
  if (dot < 0) return null;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    if (typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000)) return payload;
  } catch (_e) { /* fall through */ }
  return null;
}

export function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
