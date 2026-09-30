/**
 * Generates public/assets/og-privacy.png — the share card for /privacy.
 *
 * Why a script rather than a hand-made image: the other three cards were
 * produced ad hoc, which means none of them can be regenerated or tweaked
 * once the brand changes. This one is reproducible. `npm run og:privacy`
 * rewrites the file from the markup below, so a wording or colour change
 * is a one-line edit and a re-run rather than a fresh design session.
 *
 * Rendered with headless Chrome because the typeface matters. The card is
 * read at thumbnail size in a chat window, and the local system fonts
 * available to an image library are the wrong ones — they render the
 * headline narrower and the letterforms visibly wrong next to the
 * existing cards.
 *
 * The palette below is not invented. Every value is sampled from the
 * existing og-homepage.png, and they are the site's own Tailwind tokens:
 * slate-950, slate-100, slate-300, emerald-400 and cyan-400.
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const OUT = new URL('../public/assets/og-privacy.png', import.meta.url).pathname;
const CHROME = process.env.CHROME_BIN || '/usr/bin/google-chrome';

/**
 * The DO monogram, inlined from src/app/icon.svg with the viewBox cropped
 * to the artwork so the badge background is not included. Read from the
 * real file so the mark can never drift from the site's actual icon.
 */
const MONOGRAM = (() => {
  const svg = readFileSync(
    new URL('../src/app/icon.svg', import.meta.url),
    'utf8',
  );

  // Take the monogram group verbatim from the site's own icon, rather than
  // restating its paths here. Restating them would create a second copy
  // that could drift from the real icon without anything noticing, which
  // would defeat the entire reason for reading the file at all.
  const group = svg.slice(svg.indexOf('<g transform'), svg.indexOf('</svg>'));

  // The translate is removed above, so the artwork returns to its unshifted
  // coordinates: y 25..95 and x 30..135, plus half of the 12px stroke on
  // each side. That gives a stroked bounding box of x 24..141, y 19..101.
  // Cropping to exactly that frames the mark with no clipping, and leaves
  // the badge and its padding out.
  // Renamed gradient id so it cannot collide with anything else on the page.
  const body = group
    .replace('<g transform="translate(0, 20)">', '<g>')
    .replace(/optimusGrad/g, 'doGrad');

  return `<svg viewBox="24 19 117 82" fill="none" xmlns="http://www.w3.org/2000/svg"
    style="width:100%;height:100%">
    <defs>
      <linearGradient id="doGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10B981"/><stop offset="100%" stop-color="#06B6D4"/>
      </linearGradient>
    </defs>
    ${body}
  </svg>`;
})();

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:1200px; height:630px; overflow:hidden;
    font-family:'Poppins',sans-serif; color:#F1F5F9;
    background:
      radial-gradient(1100px 620px at 8% 0%, rgba(16,185,129,.16), transparent 62%),
      radial-gradient(900px 560px at 100% 100%, rgba(6,182,209,.13), transparent 60%),
      linear-gradient(135deg,#031520 0%,#020617 52%);
    position:relative; padding:56px 72px; display:flex; flex-direction:column;
  }
  /* Faint grid, matching the other three cards. */
  body::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background-image:linear-gradient(rgba(148,163,184,.05) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(148,163,184,.05) 1px,transparent 1px);
    background-size:60px 60px;
  }
  .row { display:flex; align-items:center; gap:18px; }
  /* The real monogram, inlined from src/app/icon.svg rather than
     approximated in CSS. An approximation is always subtly wrong, and a
     wrong logo on a share card is worse than no logo. */
  .mark { width:60px; height:42px; flex:none; }
  .brand { font-size:24px; font-weight:800; letter-spacing:-.01em; line-height:1.1; }
  .tagline { font-size:12px; font-weight:600; letter-spacing:.24em; color:#22D3EE; margin-top:5px; }

  .eyebrow {
    display:flex; align-items:center; gap:14px; margin-top:38px;
    font-size:14px; font-weight:700; letter-spacing:.14em; color:#34D399;
  }
  .eyebrow i { display:block; width:34px; height:3px; background:#34D399; font-style:normal; }

  h1 { margin-top:20px; font-size:56px; font-weight:800; line-height:1.13; letter-spacing:-.02em; }
  h1 em { font-style:normal; color:#34D399; }

  .sub { margin-top:22px; font-size:21px; line-height:1.6; color:#CBD5E1; max-width:880px; font-weight:400; }

  .pills { display:flex; gap:12px; margin-top:auto; }
  .pill {
    border:1px solid rgba(148,163,184,.28); border-radius:999px;
    padding:11px 20px; font-size:14px; font-weight:600; color:#E2E8F0;
  }
  footer {
    display:flex; justify-content:space-between; align-items:center;
    margin-top:30px; padding-top:22px; border-top:1px solid rgba(148,163,184,.16);
  }
  .url { font-size:14px; font-weight:700; letter-spacing:.02em; }
  .note { font-size:14px; color:#94A3B8; }
</style></head>
<body>
  <div class="row">
    <div class="mark">${MONOGRAM}</div>
    <div>
      <div class="brand">Dammie Optimus Solutions</div>
      <div class="tagline">SOFTWARE ENGINEERING</div>
    </div>
  </div>

  <div class="eyebrow"><i></i> PRIVACY &middot; PLAIN ENGLISH</div>

  <h1>What I collect,<br><em>and what I don't.</em></h1>

  <p class="sub">
    No database, no account, no cookies, and no advertising or tracking pixels.
    One cookieless page-view counter, and 12 months before your brief is deleted.
  </p>

  <div class="pills">
    <div class="pill">No cookies</div>
    <div class="pill">No tracking pixels</div>
    <div class="pill">Deleted on request</div>
  </div>

  <footer>
    <span class="url">get-tech-solutions.dammieoptimus.workers.dev/privacy</span>
    <span class="note">Plain English, on purpose</span>
  </footer>
</body></html>`;

const dir = mkdtempSync(join(tmpdir(), 'og-'));
const page = join(dir, 'card.html');
writeFileSync(page, html);

try {
  execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      // Screenshots only after fonts have settled, otherwise the headline
      // renders in a fallback face and the card silently does not match.
      '--virtual-time-budget=4000',
      `--screenshot=${OUT}`,
      `file://${page}`,
    ],
    { stdio: 'inherit' },
  );
  console.log(`Wrote ${OUT}`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
