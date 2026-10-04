/**
 * Preflight check for the deployed worker.
 *
 * Why this exists, concretely: the contact form failed in production on
 * 30 September 2026 because RESEND_API_KEY was not bound to the deployed
 * worker. Every submission returned a 500 and the message "Email delivery
 * is not configured. Please reach out via WhatsApp." The site looked
 * perfect, the code was identical to the version that had worked minutes
 * earlier, and nothing in the app could tell you. It was only found
 * because someone submitted the form by hand.
 *
 * That is the failure mode worth engineering against. The business loses
 * enquiries, the page looks fine, and there is no alarm.
 *
 * So this asks the two questions a build cannot answer:
 *   1. Is RESEND_API_KEY actually bound to the DEPLOYED worker?
 *      `wrangler secret list` is the only thing that reports this
 *      truthfully. A key sitting in .dev.vars or .env.local proves
 *      nothing about production.
 *   2. Does the deployed endpoint actually accept a message?
 *
 * Note that the local build inlines nothing: the built route reads
 * process.env.RESEND_API_KEY at request time, so the value must come from
 * a worker binding. Locally the key is read from .dev.vars. In production
 * it has to be set with `wrangler secret put`.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://get-tech-solutions.dammieoptimus.workers.dev';
const REQUIRED_SECRET = 'RESEND_API_KEY';

let failed = false;

function ok(msg) {
  console.log(`  \x1b[32mok\x1b[0m    ${msg}`);
}
function bad(msg) {
  failed = true;
  console.log(`  \x1b[31mFAIL\x1b[0m  ${msg}`);
}
/**
 * A warning does not fail the run. Reserved for things that are worth
 * noticing but are not proof that enquiries are being lost.
 */
function warn(msg) {
  console.log(`  \x1b[33mwarn\x1b[0m  ${msg}`);
}

console.log('\nDeployed worker preflight\n');

console.log('1. Required secret is bound to the live worker');
let secrets = [];
try {
  const out = execFileSync('npx', ['wrangler', 'secret', 'list'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  secrets = JSON.parse(out);
  if (secrets.some((s) => s.name === REQUIRED_SECRET)) {
    ok(`${REQUIRED_SECRET} is bound`);
  } else {
    bad(`${REQUIRED_SECRET} is NOT bound — every form submission is failing with a 500`);
    console.log(`        fix: npx wrangler secret put ${REQUIRED_SECRET}`);
  }
} catch {
  bad('could not read the secret list (are you logged in? run: npx wrangler login)');
}

console.log('\n2. Public pages reachable');
// A single fetch failure is not evidence the site is down. Node's fetch has
// proved intermittent in restricted network environments, and treating a
// transient DNS or connection blip as "enquiries are being lost" trains you
// to ignore this script. Retried, and a repeated failure is a warning.
for (const path of ['/', '/privacy', '/robots.txt', '/sitemap.xml']) {
  let status = null;
  for (let attempt = 0; attempt < 3 && status === null; attempt++) {
    try {
      const res = await fetch(SITE + path, { redirect: 'follow' });
      status = res.status;
    } catch {
      /* transient; retry */
    }
  }
  if (status === null) warn(`${path} unreachable after 3 attempts (network or DNS?)`);
  else if (status === 200) ok(`${path} 200`);
  else bad(`${path} returned ${status}`);
}

console.log('\n3. Internal documents are excluded from search');
// Every document meant to be internal must answer with noindex. A mistake in
// public/_headers is silent: the page still returns 200, the styling still
// works, and nothing looks broken. This exact bug happened — an inserted
// comment orphaned the /openchamber-guide* pattern from its header, leaving
// one internal document indexable in production with no visible symptom.
const INTERNAL = [
  '/docs',
  '/app-documentation',
  '/the-nameless-column',
  '/pricing-benchmark-report',
  '/brand-guidelines',
  '/email-delivery-guide',
  '/google-calendar-booking',
  '/seo-virality-growth-guide',
  '/openchamber-guide',
  '/social-media-growth-playbook',
];
for (const path of INTERNAL) {
  try {
    const res = await fetch(SITE + path, { redirect: 'follow' });
    const tag = res.headers.get('x-robots-tag') || '';
    if (!res.ok) {
      bad(`${path} returned ${res.status}`);
    } else if (!/noindex/i.test(tag)) {
      bad(`${path} is INDEXABLE — no X-Robots-Tag header (check public/_headers)`);
    } else {
      ok(`${path} noindex`);
    }
  } catch (e) {
    warn(`${path} unreachable: ${e.message}`);
  }
}

console.log('\n4. Brand tokens are consistent');
// Deliberately a subprocess rather than an import: check-tokens exits non-zero
// and prints its own report, and duplicating its logic here would create a
// second implementation that drifts from the first.
try {
  const out = execFileSync('node', ['scripts/check-tokens.mjs'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const lines = out.split('\n').filter((l) => l.includes('\u001b[32mok') || l.includes('All token checks'));
  ok(`tokens.json conforms and every doc reference resolves (${lines.length} checks)`);
} catch (err) {
  bad('design tokens have drifted — run `npm run tokens:check`');
  console.log(String(err.stdout || '').split('\n').filter(l => l.includes('FAIL') || l.includes('  ')).slice(0, 8)
    .map(l => '        ' + l.replace(/\u001b\[\d+m/g, '')).join('\n'));
}

console.log('\n5. Contact endpoint accepts a message');
try {
  // Sends a real notification to the business inbox. Uses a reserved
  // example.com address for the "visitor", so the auto-reply goes
  // nowhere. This is not free: every run costs one inbox message.
  const res = await fetch(`${SITE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Preflight Check',
      email: 'verify@example.com',
      whatsapp: '08000000000',
      projectType: 'Preflight',
      message: 'Automated preflight check. No action needed.',
    }),
  });
  const body = await res.json();
  if (res.ok && body.success) {
    ok('contact endpoint returned success (this also proves the key is live)');
  } else {
    bad(`contact endpoint failed: ${res.status} ${JSON.stringify(body).slice(0, 120)}`);
    console.log('        the usual cause is RESEND_API_KEY not being bound');
  }
} catch (e) {
  warn(`contact endpoint unreachable: ${e.message}`);
}


console.log('\n6. Download tracking is wired up');
// The failure this guards against is silent and specific: someone edits a
// release page, the button goes back to pointing straight at Dropbox, and the
// page keeps working perfectly while every click stops being counted. Nothing
// looks broken. So the check is that each page's button href agrees with the
// registry, not merely that the page is reachable.
try {
  const registry = fs.readFileSync('src/data/downloads.ts', 'utf8');
  const block = registry.slice(registry.indexOf('export const DOWNLOADS'));
  const entries = [...block.matchAll(/^\s{2}'?([a-z0-9-]+)'?:\s*\{([\s\S]*?)\n  \},/gm)].map((m) => ({
    slug: m[1],
    body: m[2],
  }));

  if (entries.length === 0) {
    bad('src/data/downloads.ts has no entries — the registry is unreadable');
  }

  // Release-page stem, then the registry slug. They are deliberately not the
  // same string: the page is called quickreceipt-android.html and the route is
  // /dl/quickreceipt, and conflating them is how one drifts from the other.
  const PAGES = {
    'quickreceipt-android': { file: 'public/quickreceipt-android.html', slug: 'quickreceipt' },
    'rafa-voucher-android': { file: 'public/rafa-voucher-android.html', slug: 'rafa-voucher' },
    'tgr-playbook-android': { file: 'public/tgr-playbook-android.html', slug: 'tgr-playbook' },
  };

  for (const [page, cfg] of Object.entries(PAGES)) {
    const entry = entries.find((e) => e.slug === cfg.slug);
    if (!entry) {
      bad(`${cfg.slug} has no entry in the downloads registry — its clicks cannot be counted`);
      continue;
    }
    const file = cfg.file;
    const html = fs.readFileSync(file, 'utf8');
    const button = html.match(/class="dl-btn"[\s\S]{0,200}?href="([^"]+)"/);

    if (!button) {
      bad(`${file} has no download button, or it has lost its dl-btn class`);
      continue;
    }
    if (button[1] === `/dl/${cfg.slug}`) {
      ok(`${page} button points at /dl/${cfg.slug}`);
    } else {
      bad(`${page} button points at ${button[1]}, not /dl/${cfg.slug} — clicks will not be counted`);
      console.log('        the Dropbox URL belongs in src/data/downloads.ts, not in the HTML');
    }
    if (html.includes('dropbox.com')) {
      bad(`${file} still contains a Dropbox URL — the registry must be the only copy`);
    }
    if (!html.includes('cloudflareinsights')) {
      bad(`${file} is missing the analytics beacon — visits here will not be counted`);
    }
    if (/\bbroken:\s*true/.test(entry.body)) {
      warn(`${page} is flagged broken in the registry — its download link needs replacing`);
    }
  }

  // Self-closing <script /> is a JSX habit that is invalid in raw HTML. HTML
  // has no self-closing syntax for non-void elements: the parser reads the
  // slash as nothing at all and then treats every following byte as script
  // text until it finds a real </script>. On the release pages that swallowed
  // the entire document, so the browser rendered an empty body over a correct
  // background — while curl showed the content perfectly, because curl reads
  // bytes and a browser reads a parse tree.
  //
  // Every check that looks at the served HTML misses this by construction,
  // which is why it is checked as source rather than as a response.
  // The Search Console verification file is a single line of text with no body
  // by design — it is not a page anyone will ever look at, and requiring one
  // would mean the check fails for a file that is correct.
  const htmlFiles = fs
    .readdirSync('public')
    .filter((f) => f.endsWith('.html') && !/^google[0-9a-f]+\.html$/.test(f));
  const selfClosing = [];
  const emptyBody = [];
  for (const f of htmlFiles) {
    const src = fs.readFileSync(path.join('public', f), 'utf8');
    if (/<script\b[^>]*\/\s*>/s.test(src)) selfClosing.push(f);

    const bodyAt = src.search(/<body\b[^>]*>/i);
    const bodyEnd = src.lastIndexOf('</body>');
    if (bodyAt === -1 || bodyEnd === -1 || bodyEnd < bodyAt) emptyBody.push(`${f} (no body)`);
    else if (!src.slice(bodyAt, bodyEnd).replace(/<[^>]*>/g, '').trim()) {
      emptyBody.push(`${f} (body has no text)`);
    }
  }
  if (selfClosing.length === 0) {
    ok(`no self-closing <script /> in any of the ${htmlFiles.length} static pages`);
  } else {
    bad(`${selfClosing.length} page(s) use <script ... />, which blanks the page: ${selfClosing.join(', ')}`);
    console.log('        close it as <script ...></script> instead');
  }
  if (emptyBody.length === 0) ok('every static page has readable text inside <body>');
  else bad(`page(s) whose body parses to nothing: ${emptyBody.join(', ')}`);

  const route = fs.existsSync('src/app/dl/[slug]/route.ts');
  route ? ok('the /dl/[slug] redirect route exists') : bad('src/app/dl/[slug]/route.ts is missing');

  const wrangler = JSON.parse(fs.readFileSync('wrangler.jsonc', 'utf8').replace(/^\s*\/\/.*$/gm, ''));
  const binding = (wrangler.kv_namespaces || []).some((k) => k.binding === 'DOWNLOADS');
  binding ? ok('the DOWNLOADS KV binding is declared') : bad('no DOWNLOADS binding in wrangler.jsonc');
} catch (e) {
  bad(`download tracking check failed: ${e.message}`);
}
console.log('');
if (failed) {
  console.log('\x1b[31mPreflight FAILED.\x1b[0m Enquiries are probably being lost.\n');
  process.exit(1);
}
console.log('\x1b[32mPreflight passed.\x1b[0m\n');
