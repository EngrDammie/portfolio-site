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
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css',
  'src/app/privacy/page.tsx',
  'src/app/api/contact/route.ts',
  'src/components/Navbar.tsx',
  'src/components/Hero.tsx',
  'src/components/DOMonogram.tsx',
  'src/components/ProjectShowcase.tsx',
  'src/components/TrustEngine.tsx',
  'src/components/ScopeEstimator.tsx',
  'src/components/ContactHub.tsx',
  'src/components/Typewriter.tsx',
  'src/components/ThemeProvider.tsx',
  'src/components/ThemeToggle.tsx',
  'src/data/projectsConfig.ts',
  'src/data/pricingConfig.ts',
  'public/docs.html',
  'public/app-documentation.html',
  'public/brand-guidelines.html',
  'public/email-delivery-guide.html',
  'public/google-calendar-booking.html',
  'public/the-nameless-column.html',
  'public/pricing-benchmark-report.html',
  'public/seo-virality-growth-guide.html',
  'public/assets/docs.css',
  'public/assets/docs.js',
  'public/_headers',
  'scripts/filemap.js',
];

// Counts the document states for the same paths, so --check can compare.
const STATED = {
  'src/app/layout.tsx': 41,
  'src/app/page.tsx': 40,
  'src/app/globals.css': 221,
  'src/app/privacy/page.tsx': 604,
  'src/app/api/contact/route.ts': 171,
  'src/components/ContactHub.tsx': 417,
  'public/docs.html': 423,
  'public/app-documentation.html': null,
  'public/brand-guidelines.html': 1537,
  'public/email-delivery-guide.html': 722,
  'public/google-calendar-booking.html': 714,
  'public/the-nameless-column.html': 4596,
  'public/pricing-benchmark-report.html': 2642,
  'public/seo-virality-growth-guide.html': 2646,
  'public/assets/docs.css': 390,
  'public/assets/docs.js': 108,
  // Deliberately absent: this file's own count would go stale the moment the
  // script is edited, which is a permanent false positive. It is listed in
  // TRACKED for display, but never compared.
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
