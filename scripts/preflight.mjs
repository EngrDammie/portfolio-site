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

console.log('\n4. Contact endpoint accepts a message');
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

console.log('');
if (failed) {
  console.log('\x1b[31mPreflight FAILED.\x1b[0m Enquiries are probably being lost.\n');
  process.exit(1);
}
console.log('\x1b[32mPreflight passed.\x1b[0m\n');
