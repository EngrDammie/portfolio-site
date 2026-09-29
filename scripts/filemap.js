#!/usr/bin/env node
/**
 * filemap — print the real line count of every file in the section 08 file map.
 *
 * The app documentation's file map lists a line count for each file. Those
 * numbers go stale the moment anything is edited, and a stale file map is a
 * documented defect. Run this after changing any app file and paste the new
 * numbers into section 08.
 *
 *   npm run filemap
 *
 * Pass --check to exit non-zero if any listed count no longer matches, which
 * makes it usable in a pre-commit hook or CI step.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

// The files listed in section 08 of public/app-documentation.html, in the
// order they appear there. Keep this list in step with the document.
const TRACKED = [
  '.gitignore',
  'AGENTS.md',
  'CLAUDE.md',
  'eslint.config.mjs',
  'next.config.ts',
  'open-next.config.ts',
  'package.json',
  'postcss.config.mjs',
  'public/_headers',
  'public/assets/docs.css',
  'public/assets/docs.js',
  'public/brand-guidelines.html',
  'public/docs.html',
  'public/email-delivery-guide.html',
  'public/google-calendar-booking.html',
  'public/openchamber-guide.html',
  'public/pricing-benchmark-report.html',
  'public/seo-virality-growth-guide.html',
  'public/the-nameless-column.html',
  'scripts/filemap.js',
  'src/app/api/contact/route.ts',
  'src/app/globals.css',
  'src/app/icon.svg',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/privacy/page.tsx',
  'src/components/ContactHub.tsx',
  'src/components/DOMonogram.tsx',
  'src/components/Hero.tsx',
  'src/components/Navbar.tsx',
  'src/components/ProjectShowcase.tsx',
  'src/components/ScopeEstimator.tsx',
  'src/components/ThemeProvider.tsx',
  'src/components/ThemeToggle.tsx',
  'src/components/TrustEngine.tsx',
  'src/components/Typewriter.tsx',
  'src/data/pricingConfig.ts',
  'src/data/projectsConfig.ts',
  'tsconfig.json',
  'wrangler.jsonc',
  // The script itself is listed for display but never compared: editing it
  // changes its own line count, which would be a permanent false positive.
  'scripts/filemap.js',
];

// Counts the document states for the same paths, so --check can compare.
const STATED = {
  '.gitignore': 49,
  'AGENTS.md': 9,
  'CLAUDE.md': 1,
  'eslint.config.mjs': 18,
  'next.config.ts': 7,
  'open-next.config.ts': 5,
  'package.json': 37,
  'postcss.config.mjs': 7,
  'public/_headers': 40,
  'public/assets/docs.css': 390,
  'public/assets/docs.js': 108,
  'public/brand-guidelines.html': 1537,
  'public/docs.html': 452,
  'public/email-delivery-guide.html': 722,
  'public/google-calendar-booking.html': 714,
  'public/openchamber-guide.html': 1385,
  'public/pricing-benchmark-report.html': 2642,
  'public/seo-virality-growth-guide.html': 2646,
  'public/the-nameless-column.html': 4596,
  'src/app/api/contact/route.ts': 171,
  'src/app/globals.css': 221,
  'src/app/icon.svg': 21,
  'src/app/layout.tsx': 70,
  'src/app/page.tsx': 40,
  'src/app/privacy/page.tsx': 647,
  'src/components/ContactHub.tsx': 417,
  'src/components/DOMonogram.tsx': 69,
  'src/components/Hero.tsx': 121,
  'src/components/Navbar.tsx': 122,
  'src/components/ProjectShowcase.tsx': 550,
  'src/components/ScopeEstimator.tsx': 346,
  'src/components/ThemeProvider.tsx': 10,
  'src/components/ThemeToggle.tsx': 52,
  'src/components/TrustEngine.tsx': 195,
  'src/components/Typewriter.tsx': 77,
  'src/data/pricingConfig.ts': 150,
  'src/data/projectsConfig.ts': 183,
  'tsconfig.json': 34,
  'wrangler.jsonc': 35,
  // Absent on purpose: scripts/filemap.js. Its own count would go stale the
  // moment the script is edited.
};

const check = process.argv.includes('--check');

function countLines(file) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) return null;
  const text = fs.readFileSync(full, 'utf8');
  if (text.length === 0) return 0;
  // Mirror wc -l: count newlines.
  let n = 0;
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

const rows = [];
for (const file of TRACKED) {
  const actual = countLines(file);
  const stated = STATED[file];
  let status = '';
  if (actual === null) status = 'MISSING';
  else if (stated === null || stated === undefined) status = '  -';
  else if (stated === actual) status = '  ok';
  else status = `STALE (doc says ${stated})`;
  rows.push({ file, actual, status });
}

const w = Math.max(...rows.map((r) => r.file.length));
console.log('file'.padEnd(w) + '  lines   status');
console.log('-'.repeat(w + 26));
for (const r of rows) {
  const n = r.actual === null ? '  --' : String(r.actual).padStart(5);
  console.log(r.file.padEnd(w) + '  ' + n + '   ' + r.status);
}

const stale = rows.filter((r) => r.status.startsWith('STALE') || r.status === 'MISSING');
console.log('');
if (stale.length === 0) {
  console.log('All stated line counts match.');
  process.exit(0);
}
console.log(`${stale.length} of ${rows.length} counts need updating in section 08:`);
for (const r of stale) console.log('  - ' + r.file + '  ->  ' + (r.actual ?? 'file missing'));
process.exit(check ? 1 : 0);
