#!/usr/bin/env node
/**
 * Generates every share card in public/assets/ from one template.
 *
 * Why this exists: the cards used to be made ad hoc, one design session at a
 * time, and none of them could be regenerated. When the brand or a fact
 * changed there was no way to update them short of doing the whole thing
 * again by hand — and when QuickReceipt shipped with no card at all, its
 * release page fell back to Rafa Voucher's, so sharing a QuickReceipt link
 * showed the wrong app's name. That is the failure this removes.
 *
 * Sizes are read from src/data/downloads.ts rather than typed here, so a
 * card cannot claim a file size the registry disagrees with — the same
 * one-source-of-truth rule the download pages and the tracker already follow.
 *
 * Claims are limited to what is actually verifiable. There is no "Signed
 * APK" here: the signing on these builds cannot be confirmed without
 * apksigner, and the same claim was removed from the QuickReceipt page for
 * exactly that reason. A card is the least editable surface on the site and
 * therefore the worst place to leave a claim nobody can stand behind.
 *
 * Run: npm run og:cards
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ASSETS = new URL('../public/assets/', import.meta.url).pathname;
const CHROME = process.env.CHROME_BIN || '/usr/bin/google-chrome';
const HOST = 'get-tech-solutions.dammieoptimus.workers.dev';

/**
 * Sizes come from the download registry, keyed by its slug. A slug missing
 * from the registry is a hard error rather than a fallback, because a card
 * showing a stale or invented size is worse than no card.
 */
function sizesFromRegistry() {
  const src = readFileSync(
    new URL('../src/data/downloads.ts', import.meta.url).pathname,
    'utf8',
  );
  const block = src.slice(src.indexOf('export const DOWNLOADS'));
  const out = {};
  for (const m of block.matchAll(
    /^\s{2}'?([a-z0-9-]+)'?:\s*\{([\s\S]*?)\n {2}\},/gm,
  )) {
    const size = m[2].match(/sizeMb:\s*([0-9.]+)/);
    if (size) out[m[1]] = Number(size[1]);
  }
  return out;
}

const SIZES = sizesFromRegistry();

/** Every card. `file` is the output name; `slug` ties it to the registry. */
const CARDS = [
  {
    file: 'og-homepage.png',
    eyebrow: 'NIGERIA &middot; UK &middot; US &middot; EUROPE',
    headline: 'I build <em>high-impact</em><br>web apps.',
    sub: 'Fast, reliable software engineered around the way your business actually runs &mdash; not the other way round.',
    pills: ['Offline-first where it matters', 'Zero licence bloat', 'Built to be handed over'],
    url: HOST,
    note: 'Engineered for peak performance',
  },
  {
    file: 'og-privacy.png',
    eyebrow: 'PRIVACY &middot; PLAIN ENGLISH',
    headline: 'What I collect,<br><em>and what I don&rsquo;t.</em>',
    sub:
      'No database, no account, no cookies, and no advertising or tracking pixels. ' +
      'Two cookieless counters &mdash; page views and download clicks &mdash; and 12 months before your brief is deleted.',
    pills: ['No cookies', 'No tracking pixels', 'Deleted on request'],
    url: `${HOST}/privacy`,
    note: 'Plain English, on purpose',
  },
  {
    file: 'og-rafa-voucher.png',
    slug: 'rafa-voucher',
    eyebrow: 'ANDROID BUILD',
    headline: 'Rafa Voucher<br>Tracker',
    sub: 'Track shift attendance, missed days, streaks and voucher-cycle payouts. No account, no server, no subscription.',
    pills: [],
    pill: ['APK', 'SHA-256 checksum included'],
    url: `${HOST}/rafa-voucher-android`,
    note: 'Engineered for peak performance',
  },
  {
    file: 'og-tgr-playbook.png',
    slug: 'tgr-playbook',
    eyebrow: 'ANDROID BUILD',
    headline: 'TGR Playbook',
    sub: 'The offline field manual for telecom network field staff. Works with or without signal.',
    pills: [],
    pill: ['APK', 'SHA-256 checksum included'],
    url: `${HOST}/tgr-playbook-android`,
    note: 'Engineered for peak performance',
  },
  {
    file: 'og-quickreceipt.png',
    slug: 'quickreceipt',
    eyebrow: 'ANDROID BUILD',
    headline: 'QuickReceipt',
    sub: 'Professional PDF receipts, sent straight to WhatsApp. No account, no subscription, and it works offline.',
    pills: [],
    pill: ['Free', 'SHA-256 checksum included'],
    url: `${HOST}/quickreceipt-android`,
    note: 'Engineered for peak performance',
  },
];

/** The monogram, inlined from src/app/icon.svg rather than approximated in CSS. */
const MONOGRAM = (() => {
  const svg = readFileSync(new URL('../src/app/icon.svg', import.meta.url).pathname, 'utf8');
  const group = svg.slice(svg.indexOf('<g transform'), svg.indexOf('</svg>'));
  const body = group
    .replace('<g transform="translate(24.8994,18.5233) scale(0.67)"', '<g transform="translate(0,0) scale(1.34)"')
    .replace(/stroke="url\(#a\)"/g, 'stroke="url(#dosGrad)"')
    .replace('fill="url(#a)"', 'fill="url(#dosGrad)"');
  return `<svg width="160" height="120" viewBox="0 0 160 120" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="dosGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10B981"/><stop offset="100%" stop-color="#06B6D4"/>
      </linearGradient>
    </defs>
    ${body}
  </svg>`;
})();

function htmlFor(card) {
  // `card.pills || …` is wrong: an empty array is truthy, so the release cards
  // declared `pills: []` rendered with no pills at all and the fallback never
  // ran. The length has to be the test, not truthiness.
  const pills = card.pills && card.pills.length
    ? card.pills
    : [
        card.slug ? `${SIZES[card.slug]} MB` : null,
        ...(card.pill || []),
      ].filter(Boolean);

  return `<!DOCTYPE html>
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
  body::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background-image:linear-gradient(rgba(148,163,184,.05) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(148,163,184,.05) 1px,transparent 1px);
    background-size:60px 60px;
  }
  .row { display:flex; align-items:center; gap:18px; }
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

  <div class="eyebrow"><i></i> ${card.eyebrow}</div>

  <h1>${card.headline}</h1>

  <p class="sub">${card.sub}</p>

  <div class="pills">
${pills.map((p) => `    <div class="pill">${p}</div>`).join('\n')}
  </div>

  <footer>
    <span class="url">${card.url}</span>
    <span class="note">${card.note}</span>
  </footer>
</body></html>`;
}

const only = process.argv[2];
const list = only ? CARDS.filter((c) => c.file.includes(only)) : CARDS;
if (!list.length) {
  console.error(`No card matches "${only}". Known: ${CARDS.map((c) => c.file).join(', ')}`);
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), 'og-cards-'));
try {
  for (const card of list) {
    if (card.slug && !SIZES[card.slug]) {
      console.error(
        `${card.file}: slug "${card.slug}" is not in the download registry, so its size is unknown. ` +
          'Add it to src/data/downloads.ts or drop the slug.',
      );
      process.exit(1);
    }
    const page = join(dir, card.file.replace(/\.png$/, '.html'));
    writeFileSync(page, htmlFor(card));
    execFileSync(
      CHROME,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        '--window-size=1200,630',
        // Fonts must settle before the screenshot, or the headline renders in
        // a fallback face and the card silently does not match its siblings.
        '--virtual-time-budget=4000',
        `--screenshot=${ASSETS}${card.file}`,
        `file://${page}`,
      ],
      { stdio: 'inherit' },
    );
    console.log(`  wrote ${card.file}${card.slug ? `  (${SIZES[card.slug]} MB from the registry)` : ''}`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}