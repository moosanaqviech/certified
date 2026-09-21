#!/usr/bin/env python3
"""Build the Certify brand mark and every icon derived from it.

The mark is the app icon's serif C (Fraunces, opsz 144, wght 380) in
lavender with a flat gold check, on the site's navy ground. Run from the
repo root:

    python3 scripts/build_brand_assets.py [--fonts DIR] [--no-raster]

Outputs (all under assets/ unless noted):
  logo-mark.svg        glyph only, transparent, for inline header use
  icon.svg             rounded tile, SVG favicon
  favicon-16.png       C only (the check is too fine at 16px)
  favicon-32.png       tile with check
  apple-touch-icon.png 180px full-bleed square (iOS rounds it)
  icon-192.png, icon-512.png   web manifest icons, full-bleed square
  app-icon-1024.png    full-bleed square for the store listings
  og-image.png         1200x630 share image
  favicon.ico (repo root), site.webmanifest (repo root)

One-off tooling, not a site build step: needs fontTools (with brotli) and
the variable Fraunces font (npm i @fontsource-variable/fraunces, then pass
--fonts to its files/ folder), Playwright for the PNGs, Pillow for the .ico.
The SVGs are committed, so pages never depend on this script.
"""
import argparse, glob, os, subprocess, sys, tempfile

GOLD = "#d9a441"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIZE = 1024

def outline_c(fonts_dir, wght=380, opsz=144):
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    from fontTools.pens.boundsPen import BoundsPen
    cands = sorted(glob.glob(os.path.join(fonts_dir, "*latin-opsz-normal.woff2")) + glob.glob(os.path.join(fonts_dir, "*latin-full-normal.woff2")))
    if not cands: sys.exit(f"no variable Fraunces woff2 in {fonts_dir}")
    t = TTFont(cands[0])
    axes = {a.axisTag for a in t["fvar"].axes}
    loc = {"wght": wght, "opsz": opsz}
    if "SOFT" in axes: loc["SOFT"] = 0
    if "WONK" in axes: loc["WONK"] = 0
    inst = instancer.instantiateVariableFont(t, loc, inplace=False)
    gs = inst.getGlyphSet(); g = gs[inst.getBestCmap()[ord("C")]]
    bp = BoundsPen(gs); g.draw(bp); xmin, ymin, xmax, ymax = bp.bounds
    pen = SVGPathPen(gs); g.draw(TransformPen(pen, (1, 0, 0, -1, -xmin, ymax)))
    return pen.getCommands(), xmax - xmin, ymax - ymin

def svg(d, w, h, tile=True, check=True, rounded=True, view=None):
    s = SIZE
    target_h = s * 0.50
    k = target_h / h; cw = w * k
    tx = s * 0.485 - cw / 2 - s * 0.03; ty = s * 0.50 - target_h / 2
    chk = f'<path d="M{s*0.648:.0f} {s*0.505:.0f} L{s*0.691:.0f} {s*0.548:.0f} L{s*0.774:.0f} {s*0.462:.0f}" fill="none" stroke="{GOLD}" stroke-width="{s*0.025:.0f}" stroke-linecap="round" stroke-linejoin="round"/>' if check else ""
    bg = (f'<rect width="{s}" height="{s}" rx="{s*0.225:.0f}" fill="url(#glow)"/>' if rounded else f'<rect width="{s}" height="{s}" fill="url(#glow)"/>') if tile else ""
    vb = view or f"0 0 {s} {s}"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Certify">
  <defs>
    <radialGradient id="glow" cx="29%" cy="24%" r="66%"><stop offset="0" stop-color="#2b2f5c"/><stop offset="0.45" stop-color="#141629"/><stop offset="1" stop-color="#06070d"/></radialGradient>
    <linearGradient id="lav" x1="0" y1="0" x2="0.55" y2="1"><stop offset="0" stop-color="#eef0ff"/><stop offset="0.5" stop-color="#d3d6ff"/><stop offset="1" stop-color="#aeb2ff"/></linearGradient>
  </defs>
  {bg}
  <g transform="translate({tx:.1f} {ty:.1f}) scale({k:.5f})"><path d="{d}" fill="url(#lav)"/></g>
  {chk}
</svg>
'''

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fonts", default=os.environ.get("FRAUNCES_DIR", ""))
    ap.add_argument("--no-raster", action="store_true")
    a = ap.parse_args()
    d, w, h = outline_c(a.fonts)
    A = os.path.join(ROOT, "assets")
    s = SIZE
    # glyph: tight box around the C and the check, a little breathing room
    k = (s * 0.50) / h; cw = w * k
    left = s * 0.485 - cw / 2 - s * 0.03; top = s * 0.25
    right = s * 0.774 + s * 0.02; bottom = s * 0.75
    pad = s * 0.02
    view = f"{left-pad:.0f} {top-pad:.0f} {right-left+2*pad:.0f} {bottom-top+2*pad:.0f}"
    open(os.path.join(A, "logo-mark.svg"), "w").write(svg(d, w, h, tile=False, view=view))
    open(os.path.join(A, "icon.svg"), "w").write(svg(d, w, h, tile=True))
    manifest = '''{
  "name": "Certify",
  "short_name": "Certify",
  "description": "Focused certification prep, one concept at a time.",
  "start_url": "/",
  "display": "browser",
  "background_color": "#14161c",
  "theme_color": "#14161c",
  "icons": [
    { "src": "/assets/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/assets/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
'''
    open(os.path.join(ROOT, "site.webmanifest"), "w").write(manifest)
    if a.no_raster:
        print("svgs + manifest written (rasters skipped)"); return
    tmp = tempfile.mkdtemp()
    variants = {
        "tile-rounded": svg(d, w, h, tile=True, rounded=True),
        "tile-square": svg(d, w, h, tile=True, rounded=False),
        "tile-rounded-nocheck": svg(d, w, h, tile=True, rounded=True, check=False),
    }
    for n, txt in variants.items(): open(os.path.join(tmp, n + ".svg"), "w").write(txt)
    fonts = os.path.join(ROOT, "social-kit", "fonts", "static")
    og = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:F;src:url("file://{fonts}/Fraunces-SemiBold.ttf")}}
@font-face{{font-family:H;src:url("file://{fonts}/HankenGrotesk-Medium.ttf")}}
body{{margin:0;width:1200px;height:630px;background:radial-gradient(900px 520px at 22% 10%,#1c1f33 0%,#14161c 60%);display:flex;align-items:center;gap:64px;padding:0 96px;box-sizing:border-box;color:#e9e6dd;font-family:H}}
img{{width:300px;height:300px;flex:none}}
.w{{font-family:F;font-size:76px;letter-spacing:-.01em;line-height:1}} .w b{{color:{GOLD};font-weight:600}}
.t{{font-size:30px;color:#a7acba;margin-top:22px;max-width:640px;line-height:1.35}}
</style></head><body><img src="file://{tmp}/tile-rounded.svg"><div><div class="w">certify<b>.</b>courses</div><div class="t">Focused certification prep, one concept at a time. Databricks and AWS exams, two-minute lessons and timed practice.</div></div></body></html>'''
    open(os.path.join(tmp, "og.html"), "w").write(og)
    js = f'''
const {{chromium}}=require("playwright");
(async()=>{{
  const b=await chromium.launch({{executablePath:process.env.CHROME||"/opt/pw-browsers/chromium",args:["--allow-file-access-from-files"]}});
  const fs=require("fs");
  const shot=async(svgName,px,out,transparent)=>{{
    const p=await b.newPage({{viewport:{{width:px,height:px}},deviceScaleFactor:1}});
    const html="{tmp}/shot-"+svgName+"-"+px+".html";
    fs.writeFileSync(html,`<body style="margin:0;background:${{transparent?"transparent":"#06070d"}}"><img src="file://{tmp}/${{svgName}}.svg" width="${{px}}" height="${{px}}" style="display:block"></body>`);
    await p.goto("file://"+html); await p.waitForTimeout(200);
    await p.screenshot({{path:out,omitBackground:!!transparent}}); await p.close();
  }};
  const A="{A}";
  await shot("tile-rounded-nocheck",16,A+"/favicon-16.png",true);
  await shot("tile-rounded",32,A+"/favicon-32.png",true);
  await shot("tile-rounded",48,"{tmp}/favicon-48.png",true);
  await shot("tile-square",180,A+"/apple-touch-icon.png",false);
  await shot("tile-square",192,A+"/icon-192.png",false);
  await shot("tile-square",512,A+"/icon-512.png",false);
  await shot("tile-square",1024,A+"/app-icon-1024.png",false);
  const p=await b.newPage({{viewport:{{width:1200,height:630}},deviceScaleFactor:1}});
  await p.goto("file://{tmp}/og.html"); await p.waitForTimeout(400);
  await p.screenshot({{path:A+"/og-image.png"}}); await p.close();
  await b.close(); console.log("rasters written");
}})();'''
    open(os.path.join(tmp, "raster.js"), "w").write(js)
    node_path = os.environ.get("NODE_PATH", "")
    subprocess.run(["node", os.path.join(tmp, "raster.js")], check=True, env={**os.environ, "NODE_PATH": node_path})
    from PIL import Image
    # Pillow keeps only sizes no larger than the base image, so lead with 48px.
    ims = [Image.open(os.path.join(tmp, "favicon-48.png")), Image.open(os.path.join(A, "favicon-32.png")), Image.open(os.path.join(A, "favicon-16.png"))]
    ims[0].save(os.path.join(ROOT, "favicon.ico"), format="ICO", sizes=[(48, 48), (32, 32), (16, 16)], append_images=ims[1:])
    print("wrote favicon.ico")

if __name__ == "__main__":
    main()
