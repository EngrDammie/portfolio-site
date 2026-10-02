/**
 * Assembles brand-kit/ — the distributable copy of the design system.
 *
 * WHY THIS IS GENERATED
 *
 * The obvious way to share a design system across separate projects is to
 * copy the files. That works right up until it doesn't: you fix a typo in
 * one copy, tokens.json gains a token six months later, and now there are
 * four copies of the same system with no way to tell which is current.
 *
 * So the kit is assembled from the canonical files and gated on staleness.
 * `npm run kit:build` refreshes it. `npm run kit:check` fails if the
 * committed kit is not identical to what would be produced now. A copy
 * that someone edited by hand is caught rather than silently believed.
 *
 * WHAT IS IN HERE
 *
 *   START-HERE.md       authored, not generated. Which files go where.
 *   shared/             every platform needs these two.
 *   PLATFORM-mobile.md  every mobile platform needs this one.
 *   web/                the web platform.
 *   android/ ios/ react-native/   one folder each.
 *
 * Only the platform-specific files are split out. Duplicating a shared file
 * into three mobile folders would reintroduce exactly the drift this
 * arrangement exists to prevent.
 *
 * NOT IN HERE, DELIBIBERATELY
 *
 *   scripts/build-adapters.mjs    regenerating adapters needs this repo,
 *                                 not a consuming project. A client project
 *                                 gets adapters and never edits them.
 *   scripts/check-tokens.mjs      same.
 *   The Flutter adapter           does not exist yet.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import nodeCrypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KIT = path.join(ROOT, 'brand-kit');
const CHECK = process.argv.includes('--check');

/** Files that are copied into the kit, and where they land. */
const COPIES = [
  // Shared by every platform.
  { from: 'BRAND.md', to: 'shared/BRAND.md', note: 'markdown' },
  { from: 'tokens.json', to: 'shared/tokens.json', note: null },
  { from: 'PLATFORM-mobile.md', to: 'PLATFORM-mobile.md', note: 'markdown' },

  // Web.
  { from: 'DESIGN_SYSTEM.md', to: 'web/DESIGN_SYSTEM.md', note: 'markdown' },
  { from: 'adapters/web.css', to: 'web/web.css', note: null },

  // One folder per mobile target.
  { from: 'adapters/compose/Brand.kt', to: 'android/Brand.kt', note: null },
  { from: 'adapters/swift/Brand.swift', to: 'ios/Brand.swift', note: null },
  { from: 'adapters/react-native/tokens.ts', to: 'react-native/tokens.ts', note: null },
  { from: 'adapters/flutter/brand.dart', to: 'flutter/brand.dart', note: null },
];

/** Authored, not generated — the kit must not clobber it. */
const AUTHORED = ['START-HERE.md'];

/**
 * The version stamp.
 *
 * This is the answer to "is copying the files wrong?" It is not — vendoring
 * a built artefact into a project is normal and correct, and is how every
 * package manager works. What makes copying risky is not the copy, it is
 * not being able to tell later which version a project holds.
 *
 * So the kit carries a stamp. Record it in the consuming project's README
 * and "which version is this on?" stops being guesswork.
 */
/**
 * The version stamp.
 *
 * This is the answer to "is copying the files wrong?" It is not — vendoring
 * a built artefact into a project is normal and correct, and is how every
 * package manager works. What makes copying risky is not the copy, it is
 * being unable to tell later which snapshot a project holds.
 *
 * The stamp carries a CONTENT HASH of the source files rather than a git
 * commit. A commit stamp cannot work here: committing the stamp changes the
 * commit, so it is always one behind and `kit:check` would fail forever.
 * The commit is included for information only, and is not compared.
 */
function buildVersion() {
  const crypto = require_crypto();
  const hash = crypto.createHash('sha256');
  // Hash the canonical sources, not the kit. Hashing the kit would be circular
  // because VERSION is itself part of it.
  for (const c of [...COPIES].sort((a, b) => a.from.localeCompare(b.from))) {
    hash.update(c.from);
    hash.update(fs.readFileSync(path.join(ROOT, c.from)));
  }
  const digest = hash.digest('hex').slice(0, 12);

  let commit = 'unknown';
  try {
    commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      encoding: 'utf8',
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    /* not a git checkout, or git unavailable */
  }

  const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;

  return [
    `# Dammie Optimus Solutions — design system kit`,
    '',
    `version : ${version}`,
    `content : ${digest}`,
    `# built : portfolio repo ${commit} (informational only)`,
    '',
    '# `content` is a hash of the source files, not of this folder, so it is',
    '# stable across commits and can be compared reliably.',
    '',
    '# Record the version and content hash in a consuming project\'s README.',
    '# That single line is what makes copying a snapshot safe: it answers',
    '# "which version is this project on?" months later.',
    '',
  ].join('\n');
}

/** Lazily imported so the rest of the script has no top-level dependency. */
function require_crypto() {
  return globalThis.__kitCrypto || (globalThis.__kitCrypto = nodeCrypto);
}

const PROVENANCE = (from) => `<!--
  COPY — generated by scripts/build-brand-kit.mjs from \`${from}\` in the
  portfolio repository. Do not edit this copy.

  If you change something here, it will be overwritten by
  \`npm run kit:build\`, and \`npm run kit:check\` will fail until the
  source in the portfolio repo is changed instead.
-->`;

/**
 * Produces the content of one kit file from its canonical source.
 *
 * Markdown gets a provenance block inserted directly beneath the H1, so it
 * reads as part of the header rather than floating above the title where it
 * looks like a rendering bug. Everything else is copied verbatim — the
 * adapters already carry their own generated-file banner.
 */
function buildContent({ from, note }) {
  const raw = fs.readFileSync(path.join(ROOT, from), 'utf8');
  if (note !== 'markdown') return raw;
  const lines = raw.split('\n');
  const h1 = lines.findIndex((l) => l.startsWith('# '));
  if (h1 === -1) return PROVENANCE(from) + '\n' + raw;
  lines.splice(h1 + 1, 0, '', PROVENANCE(from));
  return lines.join('\n');
}

/** Removes previously generated files so a rename cannot leave a stale copy. */
function cleanGenerated() {
  if (!fs.existsSync(KIT)) return;
  for (const rel of fs.readdirSync(KIT, { withFileTypes: true })) {
    const p = path.join(KIT, rel.name);
    if (rel.isDirectory()) {
      if (rel.name === '.') continue;
      fs.rmSync(p, { recursive: true, force: true });
    } else if (rel.name !== 'START-HERE.md') {
      fs.rmSync(p, { force: true });
    }
  }
}

/* ------------------------------------------------------------------ check */

if (CHECK) {
  let stale = 0;
  console.log('Checking brand-kit is current\n');

  for (const a of AUTHORED) {
    const p = path.join(KIT, a);
    if (fs.existsSync(p)) {
      console.log(`  \x1b[32mok\x1b[0m    ${a} (authored)`);
    } else {
      console.log(`  \x1b[31mFAIL\x1b[0m  ${a} — missing. This file is written by hand, not generated.`);
      stale++;
    }
  }

  for (const c of COPIES) {
    const p = path.join(KIT, c.to);
    let existing = null;
    try {
      existing = fs.readFileSync(p, 'utf8');
    } catch {
      /* absent */
    }
    const expected = buildContent(c);
    if (existing === null) {
      console.log(`  \x1b[31mFAIL\x1b[0m  ${c.to} — missing. Run: npm run kit:build`);
      stale++;
    } else if (existing !== expected) {
      console.log(`  \x1b[31mFAIL\x1b[0m  ${c.to} — out of date with ${c.from}`);
      stale++;
    } else {
      console.log(`  \x1b[32mok\x1b[0m    ${c.to}`);
    }
  }

  const vPath = path.join(KIT, 'VERSION');
  if (fs.existsSync(vPath)) {
    const stamp = fs.readFileSync(vPath, 'utf8');
    // The commit line is informational and changes with every commit, so only
    // the version and content hash are compared.
    const meaningful = (t) => t.split('\n').filter((l) => !l.startsWith('# built :')).join('\n');
    if (meaningful(stamp) !== meaningful(buildVersion())) {
      console.log('  \x1b[31mFAIL\x1b[0m  VERSION — stale. The kit content no longer matches its sources.');
      stale++;
    } else {
      const h = stamp.match(/^content : (\w+)$/m);
      console.log(`  \x1b[32mok\x1b[0m    VERSION \u2014 content ${h ? h[1] : '?'}`);
    }
  } else {
    console.log('  \x1b[31mFAIL\x1b[0m  VERSION — missing. Run: npm run kit:build');
    stale++;
  }

  // Every file the instructions point at must actually be in the kit. A
  // START-HERE.md that references a file nobody shipped is worse than none.
  const shipped = new Set(COPIES.map((c) => c.to).concat(AUTHORED));
  const startHere = fs.readFileSync(path.join(KIT, 'START-HERE.md'), 'utf8');
  const referenced = new Set(
    [...startHere.matchAll(/`([\w./-]+\.(?:md|json|css|kt|swift|ts|dart))`/g)].map((m) => m[1]),
  );
  // Match on the kit-relative path OR the basename. The prose legitimately
  // refers to `web.css` and `Brand.kt` rather than `web/web.css` and
  // `android/Brand.kt`, and flagging those would train the reader to ignore
  // the check. A name that matches nothing in the kit still fails.
  const shippedBase = new Set([...shipped].map((f) => path.posix.basename(f)));
  const danglingRefs = [...referenced].filter(
    (r) => !shipped.has(r) && !shippedBase.has(path.posix.basename(r)) && !fs.existsSync(path.join(ROOT, r)),
  );
  if (danglingRefs.length === 0) {
    console.log('  \x1b[32mok\x1b[0m    START-HERE.md references only files that exist');
  } else {
    console.log(`  \x1b[31mFAIL\x1b[0m  START-HERE.md points at ${danglingRefs.length} missing file(s)`);
    for (const d of danglingRefs) console.log(`          ${d}`);
    stale++;
  }

  if (stale > 0) {
    console.log(`\n\x1b[31m${stale} problem(s).\x1b[0m Run: npm run kit:build\n`);
    process.exit(1);
  }
  console.log(`\n\x1b[32mbrand-kit is current — ${COPIES.length + AUTHORED.length} files.\x1b[0m\n`);
} else {
  cleanGenerated();
  let n = 0;
  console.log('Building brand-kit\n');
  for (const c of COPIES) {
    const target = path.join(KIT, c.to);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, buildContent(c));
    n++;
    console.log(`  copied  ${c.from.padEnd(28)} ->  ${c.to}`);
  }
  fs.writeFileSync(path.join(KIT, 'VERSION'), buildVersion());
  n++;
  console.log('  wrote   VERSION');

  for (const a of AUTHORED) {
    const p = path.join(KIT, a);
    if (!fs.existsSync(p)) {
      console.log(`  \x1b[33mnote\x1b[0m  ${a} does not exist yet — write it by hand`);
    }
  }
  console.log(`\n\x1b[32m${n} file(s) assembled.\x1b[0m\n`);
}
