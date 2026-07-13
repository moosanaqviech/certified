// Freemium gate for the Databricks DE Associate course.
//
// Runs on every request but only acts on the PAID course pages. Unit 1
// (lessons 01 to 04 plus Practice Test 1), the course home, the blog, and
// everything else pass straight through. Behaviour is driven by env vars so
// the same commit can be free on one Netlify site and gated on another:
//   GATING_ENABLED=true  -> enforce the paywall on paid pages
//   NOINDEX_SITE=true    -> stamp X-Robots-Tag: noindex on all responses
//   GATE_SIGNING_SECRET  -> HMAC secret (shared with the unlock function)
//
// The gate only READS a signed cookie; it never mints one and needs no
// dependencies. Access is granted by /api/unlock after Stripe confirms
// payment. On any internal error the gate fails open so the site can never
// be taken down by a paywall bug.

import type { Context } from "https://edge.netlify.com";

const COURSE_PREFIX = "/databricks-data-engineer-associate/";

// Free = Unit 1. Stems are the filename without the .html extension.
const FREE_STEMS = new Set<string>([
  "",
  "index",
  "lesson-01-lakehouse",
  "lesson-02-delta-lake",
  "lesson-03-unity-catalog",
  "lesson-04-compute-cost",
  "practice-exam-01",
]);

// Display price (front-end anchor only; the real charge is the Stripe Price).
const PRICE_REGULAR = "$30";
const PRICE_NOW = "$9.99";

function stemOf(path: string): string {
  let p = path;
  if (p.endsWith("/")) p = p.slice(0, -1);
  const base = p.substring(p.lastIndexOf("/") + 1);
  return base.endsWith(".html") ? base.slice(0, -5) : base;
}

function isPaidPath(path: string): boolean {
  if (!path.startsWith(COURSE_PREFIX)) return false;
  const base = path.substring(path.lastIndexOf("/") + 1);
  // Ignore anything that carries a non-html extension (assets, etc.).
  if (base.includes(".") && !base.endsWith(".html")) return false;
  return !FREE_STEMS.has(stemOf(path));
}

function b64urlToBytes(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return bytesToB64url(new Uint8Array(sig));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function cookieValid(req: Request, secret: string): Promise<boolean> {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)cc_access=([^;]+)/);
  if (!m) return false;
  const token = decodeURIComponent(m[1]);
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmac(secret, payloadB64);
  if (!safeEqual(sig, expected)) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(payloadB64)));
    return typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export default async (request: Request, context: Context) => {
  try {
    const gating = Deno.env.get("GATING_ENABLED") === "true";
    const noindex = Deno.env.get("NOINDEX_SITE") === "true";
    const secret = Deno.env.get("GATE_SIGNING_SECRET") || "";
    const path = new URL(request.url).pathname;

    if (gating && secret && isPaidPath(path)) {
      const ok = await cookieValid(request, secret);
      if (!ok) {
        return new Response(paywallHtml(), {
          status: 402,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "x-robots-tag": "noindex",
            "cache-control": "no-store",
          },
        });
      }
    }

    const res = await context.next();
    const ct = res.headers.get("content-type") || "";
    const isHtml = ct.includes("text/html");
    if (noindex || isHtml) {
      const r = new Response(res.body, res);
      if (noindex) r.headers.set("x-robots-tag", "noindex");
      // Readable (non-HttpOnly) hint so the course page knows whether this
      // site enforces the paywall. Not a security boundary: real enforcement
      // is the signed cc_access cookie the gate verifies above.
      if (isHtml) {
        r.headers.append("set-cookie", `cc_gating=${gating ? "1" : "0"}; Path=/; SameSite=Lax; Max-Age=1800`);
      }
      return r;
    }
    return res;
  } catch (_e) {
    // Fail open: never break the site because of the gate.
    return context.next();
  }
};

export const config = { path: "/*" };

function paywallHtml(): string {
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Unlock the full course · Already Certified</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{--bg:#0b0d12;--surface:#161a22;--ink:#f3f0ea;--ink-soft:#a7a59f;--ink-faint:#6b6a66; --red:#FF0000; --green:#008000; --gold:#e3b84a;--line:rgba(255,255,255,.08);--display:"Fraunces",Georgia,serif;--body:"Hanken Grotesk",system-ui,sans-serif;}
  *{margin:0;padding:0;box-sizing:border-box;}
  body{background:radial-gradient(1100px 650px at 50% -8%,#1a1d29 0%,transparent 58%),var(--bg);font-family:var(--body);color:var(--ink);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;line-height:1.55;}
  .card{max-width:440px;width:100%;background:var(--surface);border:1px solid var(--line);border-radius:22px;padding:36px 30px;text-align:center;}
  .lock{width:46px;height:46px;margin:0 auto 18px;color:var(--gold);}
  .kicker{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:12px;}
  h1{font-family:var(--display);font-weight:600;font-size:27px;line-height:1.12;letter-spacing:-.02em;margin-bottom:12px;}
  p{color:var(--ink-soft);font-size:15.5px;margin-bottom:20px;}
  .price{display:flex;align-items:baseline;gap:10px;justify-content:center;margin-bottom:4px;}
  .price .now{font-family:var(--display);font-size:38px;font-weight:700;color:var(--green);}
  .price .was{font-size:19px;color:var(--red);text-decoration:line-through;}
  .oneoff{font-size:12.5px;color:var(--ink-faint);margin-bottom:22px;}
  .cta{display:inline-flex;align-items:center;justify-content:center;gap:9px;width:100%;background:var(--gold);color:#14110c;font-weight:700;font-size:16px;padding:15px 26px;border-radius:14px;border:none;cursor:pointer;text-decoration:none;transition:transform .15s ease;}
  .cta:active{transform:scale(.98);}
  .cta[disabled]{opacity:.6;cursor:default;}
  .alt{margin-top:16px;font-size:13.5px;color:var(--ink-soft);}
  .alt a{color:var(--gold);}
  .err{margin-top:14px;font-size:13px;color:#ef6f6f;min-height:16px;}
  .back{margin-top:22px;font-size:13px;}
  .back a{color:var(--ink-faint);text-decoration:underline;text-underline-offset:3px;}
</style></head><body>
  <div class="card">
    <svg class="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke-linecap="round"/></svg>
    <div class="kicker">Members only</div>
    <h1>Unlock the full Databricks DE Associate course</h1>
    <p>Unit 1 is free. Get lifetime access to Units 2 to 7: every lesson and all timed practice exams, one payment.</p>
    <div class="price"><span class="now">${PRICE_NOW}</span><span class="was">${PRICE_REGULAR}</span></div>
    <div class="oneoff">One-time payment. Lifetime access.</div>
    <button class="cta" id="buy">Get full access</button>
    <div class="err" id="err"></div>
    <div class="alt">Already purchased? <a href="/unlock/">Enter your access code</a></div>
    <div class="back"><a href="/databricks-data-engineer-associate/">Back to the free lessons</a></div>
  </div>
<script>
  // Self-heal: if a saved token exists (e.g. cookie dropped by a mobile WebView),
  // silently re-establish access and reload so the real lesson is served. Does
  // not consume a device activation. Guarded so it runs at most once per session.
  (function(){
    try{
      var t=localStorage.getItem("cc_token");
      if(!t || sessionStorage.getItem("cc_refresh_done")) return;
      sessionStorage.setItem("cc_refresh_done","1");
      fetch("/api/refresh",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({token:t})})
        .then(function(r){return r.json().then(function(d){return {ok:r.ok,d:d};});})
        .then(function(res){
          if(res.ok&&res.d&&res.d.ok){ if(res.d.token) localStorage.setItem("cc_token",res.d.token); location.reload(); }
          else { localStorage.removeItem("cc_token"); }
        }).catch(function(){});
    }catch(e){}
  })();
  var btn=document.getElementById("buy"),err=document.getElementById("err");
  btn.addEventListener("click",async function(){
    btn.disabled=true;btn.textContent="Redirecting to checkout...";err.textContent="";
    try{
      var r=await fetch("/api/create-checkout",{method:"POST"});
      var d=await r.json();
      if(d&&d.url){location.href=d.url;return;}
      throw new Error((d&&d.error)||"Could not start checkout");
    }catch(e){err.textContent=e.message||"Something went wrong. Please try again.";btn.disabled=false;btn.textContent="Get full access";}
  });
</script>
</body></html>`;
}
