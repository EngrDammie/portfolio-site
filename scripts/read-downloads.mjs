#!/usr/bin/env node
/**
 * Reads the download counters out of Cloudflare KV and prints a table.
 *
 * A terminal command rather than a dashboard, deliberately. The question this
 * answers is "how many clicks, and from where", and that is worth knowing in
 * five seconds once a week. A dashboard would be something built once and
 * opened never.
 *
 * Authentication is whatever `wrangler` already uses, so there is nothing to
 * add, no key to leak and nothing public to protect.
 *
 * Usage:
 *   npm run downloads
 *   npm run downloads -- --days 7
 *   npm run downloads -- --json
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const daysFlag = args.indexOf('--days');
const DAYS = daysFlag !== -1 ? Number(args[daysFlag + 1]) || 7 : 30;

/** Strip comments so wrangler.jsonc can be read as JSON. */
function readWranglerConfig() {
  const raw = fs.readFileSync(path.join(ROOT, 'wrangler.jsonc'), 'utf8');
  return JSON.parse(raw.replace(/^\s*\/\/.*$/gm, ''));
}

/** The DOWNLOADS namespace id, straight from the config so it cannot drift. */
function namespaceId() {
  const entry = readWranglerConfig().kv_namespaces?.find((k) => k.binding === 'DOWNLOADS');
  if (!entry) {
    console.error(
      'No DOWNLOADS binding in wrangler.jsonc.\n' +
        'Create it with:  npx wrangler kv namespace create DOWNLOADS',
    );
    process.exit(1);
  }
  return entry.id;
}

function readKey(id, key) {
  try {
    const out = execFileSync(
      'npx',
      ['wrangler', 'kv', 'key', 'get', `--namespace-id=${id}`, key],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    return JSON.parse(out);
  } catch {
    // A key that does not exist yet is not an error: it means zero clicks.
    return null;
  }
}

const slugs = registrySlugs();
const id = namespaceId();
const cutoff = new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 10);

const rows = slugs.map((slug) => {
  const stats = readKey(id, `dl:${slug}`);
  const byDay = (stats && stats.byDay) || {};
  const recent = Object.entries(byDay)
    .filter(([day]) => day >= cutoff)
    .reduce((sum, [, n]) => sum + Number(n || 0), 0);

  const sources = Object.entries((stats && stats.bySource) || {})
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 3)
    .map(([name, n]) => `${name} ${n}`);

  return {
    app: slug,
    total: Number((stats && stats.total) || 0),
    recent,
    firstSeen: (stats && stats.firstSeen) || null,
    sources,
  };
});

if (asJson) {
  console.log(JSON.stringify({ windowDays: DAYS, rows }, null, 2));
  process.exit(0);
}

const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

console.log('');
console.log(`  Download button clicks — last ${DAYS} days`);
console.log(`  ${'-'.repeat(72)}`);
console.log(`  ${pad('APP', 18)}${padL('TOTAL', 8)}${padL(DAYS + ' DAYS', 10)}   TOP SOURCES`);
console.log(`  ${'-'.repeat(72)}`);

let total = 0;
for (const r of rows) {
  total += r.total;
  console.log(
    `  ${pad(r.app, 18)}${padL(r.total, 8)}${padL(r.recent, 10)}   ${r.sources.join(', ') || '—'}`,
  );
}
console.log(`  ${'-'.repeat(72)}`);
console.log(`  ${pad(`${rows.length} apps`, 18)}${padL(total, 8)}`);
console.log('');
console.log('  Counts button clicks, not completed downloads — Dropbox reports nothing');
console.log('  back, so a click is the most that can honestly be measured.');
console.log('');

if (total === 0) {
  console.log('  No clicks recorded yet. That is normal until the buttons point at /dl/.');
  console.log('');
}

/** Slugs come from the registry, so the CLI can never list an app that is gone. */
function registrySlugs() {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/downloads.ts'), 'utf8');
  const excluded = new Set(
    [...src.matchAll(/NON_COUNTED = new Set\(\[([^\]]*)\]/g)]
      .flatMap((m) => m[1].split(','))
      .map((s) => s.trim().replace(/['"]/g, ''))
      .filter(Boolean),
  );
  const body = src.slice(src.indexOf('export const DOWNLOADS'));
  return [...body.matchAll(/^\s{2}'?([a-z0-9-]+)'?:\s*\{/gm)]
    .map((m) => m[1])
    .filter((slug) => !excluded.has(slug));
}