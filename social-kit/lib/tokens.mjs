// Certify social kit — brand tokens.
// Every value here was extracted from the shipped SVG frames, not invented.
// If the Visual Brain changes, change it here and re-render.

export const CANVAS = {
  feed:  { w: 1080, h: 1350 },
  story: { w: 1080, h: 1920 },
};

export const COLOR = {
  bg:          '#14161c', // default frame background
  bgTension:   '#0d0f13', // near-black, tension frames only
  cream:       '#e9e6dd', // primary text
  gold:        '#d9a441', // the one accent, one per frame
  goldUrl:     '#e5c988', // muted gold, used for URLs
  eyebrow:     '#62647a', // eyebrow grey, also muted footnotes
  body:        '#8b90a0', // body grey
  panel:       '#1b1e26', // card / bar track fill
  panelStroke: '#272b36', // card / bar borders
};

export const FONT = {
  display: 'Fraunces',       // hooks, headlines, wordmark
  body:    'Hanken Grotesk', // eyebrows, body, captions
};

export const MARGIN = { left: 96 };

// Brand mark: fixed checkmark + wordmark, bottom-left. Always on, and it is
// excluded from the one-gold-element-per-frame budget.
export const BRAND_MARK = `
  <g>
    <path d="M 101.08 1268.52 l 7.8 8.32 l 14.56 -16.12" stroke="${COLOR.gold}" stroke-width="3.64" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="140" y="1278" font-family="${FONT.display}" font-size="34" font-weight="600" fill="${COLOR.cream}">Certify</text>
  </g>`;
