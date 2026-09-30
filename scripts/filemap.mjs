#!/usr/bin/env node
/**
 * filemap:check — is the section 08 file map in sync with the files on disk?
 *
 * The file map used to carry a line count for every file. It was removed,
 * because a count went stale on almost every edit and turned a routine code
 * change into a documentation chore that was routinely missed. What actually
 * matters is that the table is *complete* in both directions:
 *
 *   - a file that exists is listed
 *   - a file that is listed exists
 *
 * That invariant does not decay on its own, so this check is cheap to keep.
 *
 *   npm run filemap:check   # fail the command if out of sync
 *   npm run filemap         # same check, but always exits 0
 *
 * File type is irrelevant here - a favicon counts as a file, it just cannot
 * be line-counted, which was the original reason this script existed.
 *
 * The list of documented files is read straight out of
 * public/app-documentation.html, so there is no second list to keep in step.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DOC = path.join(ROOT, 'public', 'app-documentation.html');

// Directories the file map claims to describe. Anything inside these that is
// not listed in the document is reported as missing from the map.
const AREAS = ['src', 'public', 'scripts'];

// Root-level files the map also covers.
const ROOT_FILES = [
  'package.json',
  'next.config.ts',
  'open-next.config.ts',
  'tsconfig.json',
  'postcss.config.mjs',
  'eslint.config.mjs',
  'wrangler.jsonc',
  'package-lock.json',
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
  '.gitignore',
];

const IGNORED_DIRS = new Set(['node_modules', '.next', '.open-next', '.git']);

/**
 * Third-party verification artefacts that come and go.
 *
 * A Google Search Console HTML verification file is dropped into public/
 * and deleted once verification passes. Requiring a documentation row for
 * it would mean the file map churns every time Search Console is used
 * again, which trains you to ignore the file map.
 *
 * The pattern is deliberately narrow: it matches only Google's own
 * filename shape. It will not quietly excuse a real file that happens to
 * be called something with "google" in it.
 */
const IGNORED_PATTERNS = [/^public\/google[0-9a-f]+\.html$/];

const strict = process.argv.includes('--check');

function readDocFiles() {
  if (!fs.existsSync(DOC)) {
    console.error(`Cannot read ${DOC}`);
    process.exit(1);
  }
  const html = fs.readFileSync(DOC, 'utf8');
  // Every file-map row begins with this cell. Matching on the class rather
  // than the whole row keeps prose mentioning a path from being picked up.
  const found = [];
  const re = /<td class="f">([^<]+)<\/td>/g;
  let m;
  while ((m = re.exec(html)) !== null) found.push(m[1].trim());
  return new Set(found);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function isIgnored(relativePath) {
  const normalised = relativePath.split(path.sep).join('/');
  return IGNORED_PATTERNS.some((pattern) => pattern.test(normalised));
}

const documented = readDocFiles();
const onDisk = new Set();

for (const area of AREAS) {
  const dir = path.join(ROOT, area);
  if (!fs.existsSync(dir)) continue;
  for (const full of walk(dir)) {
    const relative = path.relative(ROOT, full).split(path.sep).join('/');
    if (isIgnored(relative)) continue;
    onDisk.add(relative);
  }
}
for (const f of ROOT_FILES) {
  if (fs.existsSync(path.join(ROOT, f))) onDisk.add(f);
}

const missingFromMap = [...onDisk].filter((f) => !documented.has(f)).sort();
const missingOnDisk = [...documented].filter((f) => !onDisk.has(f)).sort();

console.log(`files on disk:     ${onDisk.size}`);
console.log(`files in the map:  ${documented.size}`);

if (missingFromMap.length === 0 && missingOnDisk.length === 0) {
  console.log('\nThe file map matches the files on disk.');
  process.exit(0);
}

if (missingFromMap.length) {
  console.log(`\n${missingFromMap.length} file(s) exist but are not in section 08:`);
  for (const f of missingFromMap) console.log(`  + ${f}`);
}
if (missingOnDisk.length) {
  console.log(`\n${missingOnDisk.length} file(s) are listed in section 08 but do not exist:`);
  for (const f of missingOnDisk) console.log(`  - ${f}`);
}
console.log('\nAdd or remove the rows in public/app-documentation.html, section 08.');

process.exit(strict ? 1 : 0);
