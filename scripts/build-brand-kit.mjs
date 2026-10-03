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

/**
 * The shipped kit: one self-contained file per platform, and the stamp.
 *
 * A project copies a single file and tells its agent to read it. Nothing
 * else is needed, and nothing can be half-copied — which was the failure
 * mode of shipping folders, where the theme arrived but the rules did not.
 *
 * These files are composed, never maintained. One file per platform means
 * the same colour would otherwise be typed five times and would eventually
 * disagree with itself, so each is generated from the sources below and
 * `kit:check` fails if one drifts from its parts. The duplication is real
 * and the single source of truth is still tokens.json.
 */
const KIT_SOURCES = {
  'ANDROID.md': {
    label: 'Android — Jetpack Compose',
    setup: 'setup/ANDROID.md',
    docs: ['BRAND.md', 'PLATFORM-mobile.md'],
    adapter: 'adapters/compose/Brand.kt',
    lang: 'kotlin',
    target: 'app/src/main/java/<your/package>/brand/Brand.kt',
  },
  'FLUTTER.md': {
    label: 'Flutter',
    setup: 'setup/FLUTTER.md',
    docs: ['BRAND.md', 'PLATFORM-mobile.md'],
    adapter: 'adapters/flutter/brand.dart',
    lang: 'dart',
    target: 'lib/brand.dart',
  },
  'IOS.md': {
    label: 'iOS — SwiftUI',
    setup: 'setup/IOS.md',
    docs: ['BRAND.md', 'PLATFORM-mobile.md'],
    adapter: 'adapters/swift/Brand.swift',
    lang: 'swift',
    target: 'Brand.swift (add to your app target)',
  },
  'REACT-NATIVE.md': {
    label: 'React Native / Expo',
    setup: 'setup/REACT-NATIVE.md',
    docs: ['BRAND.md', 'PLATFORM-mobile.md'],
    adapter: 'adapters/react-native/tokens.ts',
    lang: 'tsx',
    target: 'src/theme/tokens.ts',
  },
  'WEB.md': {
    label: 'Web — CSS',
    setup: 'setup/WEB.md',
    docs: ['BRAND.md', 'DESIGN_SYSTEM.md'],
    adapter: 'adapters/web.css',
    lang: 'css',
    target: 'src/styles/brand.css',
  },
};

/** Everything the kit ships. Nothing else, and no folders. */
const SHIPPED = [...Object.keys(KIT_SOURCES), 'VERSION'];

/** Authored sources. Not shipped; they live in the portfolio repository. */
const AUTHORED = [
  'setup/START-HERE.md',
  'setup/ANDROID.md',
  'setup/FLUTTER.md',
  'setup/IOS.md',
  'setup/REACT-NATIVE.md',
  'setup/WEB.md',
];

const KIT_VERSION = '0.2.0';

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

/**
 * Symbols each setup file must genuinely resolve.
 *
 * The first Flutter prompt named `Brand` when the class is `BrandColors`,
 * and told a project to use Roboto as a cross-platform font when iOS uses
 * SF. Both were plausible, both were wrong, and neither produced any error —
 * an agent would simply have followed them. Prose cannot be reviewed for
 * this by eye, so it is checked mechanically: anything a setup file names
 * must exist in the adapter that file points at.
 */
const SETUP_SYMBOLS = {
  'ANDROID.md': {
    adapter: 'adapters/compose/Brand.kt',
    must: ['DammieTheme', 'Palette', 'Dimm.touchTarget', 'Dimm.touchGap'],
  },
  'FLUTTER.md': {
    adapter: 'adapters/flutter/brand.dart',
    must: ['brandTheme', 'BrandColors', 'BrandPalette', 'BrandDim', 'BrandText'],
  },
  'IOS.md': {
    adapter: 'adapters/swift/Brand.swift',
    must: ['Brand.Colors', 'Brand.Palette', 'Brand.Role'],
  },
  'REACT-NATIVE.md': {
    adapter: 'adapters/react-native/tokens.ts',
    must: ['theme', 'colors', 'space', 'radius', 'fontSize', 'lineHeight', 'fontWeight', 'touch', 'duration', 'touch.minimumAndroid', 'touch.minimumIOS', 'touch.gap'],
  },
  'WEB.md': {
    adapter: 'adapters/web.css',
    must: ['--bg', '--bg-2', '--bg-3', '--text', '--text-2', '--border', '--emerald', '--cyan', '--emerald-ink', '--cyan-ink', '--radius', '--space-lg', '--touch-min', '--touch-gap', '--motion-fast', '--page-max', '--content-max', '--gutter'],
  },
};

/** Framework, platform and language names a setup file may use that we do not define. */
const FOREIGN_SYMBOLS = new Set([
  'MaterialTheme', 'MaterialApp', 'ColorScheme', 'ThemeData', 'CardTheme', 'CardThemeData',
  'Typography', 'Shapes', 'Brightness', 'TextScaler', 'TextUnit', 'TextUnit.Unspecified',
  'isSystemInDarkTheme', 'darkColorScheme', 'lightColorScheme', 'darkTheme',
  'dynamicLightColorScheme', 'dynamicDarkColorScheme', 'Color', 'Dp', 'DpSize',
  'Font', 'Font.TextStyle', 'StyleSheet', 'View', 'Text', 'SafeArea', 's', 'ms', 'px', 'rem',
  'useColorScheme', 'allowFontScaling', 'minHeight', 'setContent', 'dynamicTypeSize',
  'ColorScheme.fromSeed', 'ColorScheme.surfaceVariant', 'copyWith', 'system', 'light', 'dark',
]);

/** Every dotted path in tokens.json, so Part 3 is not mistaken for code symbols. */
let _tokenPaths = null;
function allTokenPaths() {
  if (_tokenPaths) return _tokenPaths;
  const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens.json'), 'utf8'));
  const out = [];
  const walk = (node, trail) => {
    for (const [key, val] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      const next = trail ? `${trail}.${key}` : key;
      if (val && typeof val === 'object' && '$value' in val) out.push(next);
      else if (val && typeof val === 'object') walk(val, next);
    }
  };
  walk(tokens, '');
  _tokenPaths = out;
  return out;
}

/**
 * A shipped file must not reference any sibling file.
 *
 * The whole promise of this kit is that one file is enough. An agent handed
 * ANDROID.md that is told to also read `brand-kit/shared/BRAND.md` will
 * either fail or quietly proceed without it — which is precisely how the
 * previous, folder-based kit lost its rules. Any path pointing outside this
 * document is the bug, so it is checked rather than trusted.
 */
function checkSelfContained() {
  const problems = [];
  for (const name of Object.keys(KIT_SOURCES)) {
    const p = path.join(KIT, name);
    if (!fs.existsSync(p)) continue;
    // Strip HTML comments: the generator's own provenance footer names the
    // repository sources by path, which is correct for a maintainer reading
    // the file and not an instruction for an agent using it.
    const text = fs.readFileSync(p, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
    const refs = new Set();
    for (const m of text.matchAll(/`(?:brand-kit\/|setup\/|adapters\/|shared\/|tokens\.json|BRAND\.md)[^`]*`/g)) {
      refs.add(m[0].slice(1, -1));
    }
    for (const r of refs) {
      problems.push(`${name} references ${r}, but a shipped file has no siblings to read`);
    }
  }
  return problems;
}

/**
 * The theme source embedded in Part 5 must be byte-identical to the adapter.
 *
 * An agent told to copy a code block sometimes "improves" it, and a theme
 * is the one file where a silent edit is invisible until someone notices the
 * app looks slightly off months later. Comparing bytes catches it.
 */
function checkVerbatimAdapters() {
  const problems = [];
  for (const [name, spec] of Object.entries(KIT_SOURCES)) {
    const p = path.join(KIT, name);
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, 'utf8');
    // Part 1 contains code blocks in this same language, so the search has to
    // begin after the Part 5 heading. Anchoring on the first fence found the
    // setup example instead of the theme, and reported a false mismatch.
    const partFive = text.indexOf('## Part 5');
    const fence = '```' + spec.lang;
    const start = text.indexOf(fence, partFive === -1 ? 0 : partFive);
    if (start === -1) {
      problems.push(`${name} has no ${spec.lang} block for its theme file`);
      continue;
    }
    const bodyStart = start + fence.length + 1;
    const end = text.indexOf('\n```', bodyStart);
    if (end === -1) {
      problems.push(`${name} has an unterminated theme block`);
      continue;
    }
    const embedded = text.slice(bodyStart, end).trim();
    const source = fs.readFileSync(path.join(ROOT, spec.adapter), 'utf8').trim();
    if (embedded !== source) {
      problems.push(`${name} Part 5 does not match ${spec.adapter} byte for byte`);
    }
  }
  return problems;
}

/**
 * Every CSS custom property any kit document mentions must exist in web.css.
 *
 * `--radius-card` and `--text-body` were both named in shipped guidance and
 * neither exists; the real names are `--radius` and `--text`. Nothing failed
 * visibly — the guidance simply pointed at a token that was not there, and a
 * browser would have rendered the fallback. This walks every document instead
 * of trusting review to catch it.
 */
function checkCssTokens() {
  const css = fs.readFileSync(path.join(ROOT, 'adapters/web.css'), 'utf8');
  const problems = [];
  for (const name of Object.keys(KIT_SOURCES)) {
    const doc = path.join(KIT, name);
    if (!fs.existsSync(doc)) continue;
    const text = fs.readFileSync(doc, 'utf8');
    // Only genuine CSS usage: a var() reference or a declaration. Matching a
    // bare `--word` swept up markdown horizontal rules and shell flags, which
    // produced dozens of false alarms.
    const seen = new Set();
    for (const m of text.matchAll(/var\(\s*(--[a-z][a-z0-9-]*)\s*\)/g)) seen.add(m[1]);
    for (const m of text.matchAll(/^\s*(--[a-z][a-z0-9-]*)\s*:/gm)) seen.add(m[1]);
    for (const token of seen) {
      if (!new RegExp(`(^|[^\\w-])${token}\\s*:`, 'm').test(css)) {
        problems.push(`${name} names ${token}, which web.css does not define`);
      }
    }
  }
  return problems;
}

/** Check every symbol a setup file names actually exists. Returns a list of problems. */
function checkSetupSymbols() {
  const problems = [];
  for (const [file, spec] of Object.entries(SETUP_SYMBOLS)) {
    const setupPath = path.join(KIT, file);
    const adapterPath = path.join(ROOT, spec.adapter);
    if (!fs.existsSync(setupPath) || !fs.existsSync(adapterPath)) {
      problems.push(`${file} or ${spec.adapter} is missing`);
      continue;
    }
    const setup = fs.readFileSync(setupPath, 'utf8');
    const adapter = fs.readFileSync(adapterPath, 'utf8');

    // Anything the setup file claims must exist must exist in the adapter.
    // For a dotted path, the adapter spells it as nested declarations rather
    // than one literal — `object Dimm { val touchTarget }`, not
    // `Dimm.touchTarget` — so match on the final segment too.
    for (const sym of spec.must) {
      const leaf = sym.split('.').pop();
      if (!setup.includes(sym)) {
        problems.push(`${file} never mentions ${sym}`);
      }
      if (!adapter.includes(sym) && !adapter.includes(leaf)) {
        problems.push(`${spec.adapter} does not define ${sym} (named by ${file})`);
      }
    }

    // And nothing it names may be something we never made.
    const cited = new Set();
    for (const m of setup.matchAll(/`([A-Za-z_$][\w.$]*(?:\([^`]*\))?)`/g)) {
      const raw = m[1];
      const sym = raw.replace(/\(.*$/, '');
      if (!sym || FOREIGN_SYMBOLS.has(sym) || sym.startsWith('--')) continue;
      if (!/^[A-Z]/.test(sym) && !sym.includes('.')) continue;
      cited.add(sym);
    }
    const known = [...spec.must, ...FOREIGN_SYMBOLS, ...allTokenPaths()].join('\n');
    for (const sym of cited) {
      const base = sym.split('.').pop();
      if (known.includes(sym) || known.includes(base)) continue;
      if (adapter.includes(sym) || adapter.includes(base)) continue;
      if (fs.readFileSync(path.join(ROOT, 'BRAND.md'), 'utf8').includes(sym)) continue;
      problems.push(`${file} names \`${sym}\`, which is not defined in ${spec.adapter}`);
    }
  }
  return problems;
}

function buildVersion() {
  const crypto = require_crypto();
  const hash = crypto.createHash('sha256');
  // Hash the canonical sources, not the kit. Hashing the kit would be circular
  // because VERSION is itself part of it.
  //
  // START-HERE.md is included even though it is authored rather than copied.
  // It carries the starter prompts, and a prompt is instructions: a project
  // holding last month's prompt is meaningfully differently set up from one
  // holding this month's, even when every colour is identical. Leaving it out
  // meant two projects with different instructions recorded the same hash, so
  // "which version is this project on?" had an incomplete answer — which is
  // the one question the stamp exists to answer.
  // Hash exactly what determines the shipped files: the token source, the
  // brand doc, each platform's mechanics doc, each authored spine, and each
  // adapter. The spines are instructions rather than values, and a project on
  // last month's instructions is differently set up even when every colour is
  // identical — so they count, or the stamp answers the question only halfway.
  //
  // setup/START-HERE.md is excluded on purpose. It documents the kit to
  // contributors and never reaches a project, so editing it should not
  // invalidate the version a project records.
  const inputs = new Set(['tokens.json', 'BRAND.md']);
  for (const spec of Object.values(KIT_SOURCES)) {
    inputs.add(spec.setup);
    inputs.add(spec.adapter);
    for (const d of spec.docs) inputs.add(d);
  }
  for (const f of [...inputs].sort()) {
    hash.update(f);
    hash.update(fs.readFileSync(path.join(ROOT, f)));
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

  const version = KIT_VERSION;

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
 * Repoints a source document's repository-internal references at the Parts
 * of the composed file.
 *
 * BRAND.md and PLATFORM-mobile.md are written for someone standing in the
 * portfolio repository, so they say "read `tokens.json`" and link to
 * `./tokens.json`. Embedded verbatim in a standalone file those become
 * dangling: the reader has no tokens.json, they have Part 3. This is the
 * defect that made the first composed build unusable, and it is invisible
 * unless something checks for it.
 */
function rewriteRefs(text, spec) {
  const part = {
    'tokens.json': 'Part 3',
    'BRAND.md': 'Part 2',
    'PLATFORM-mobile.md': 'Part 4',
    'DESIGN_SYSTEM.md': 'Part 4',
  };
  let out = text;

  // Markdown links first, so the link and its label change together.
  for (const [file, target] of Object.entries(part)) {
    out = out.split(`[\`${file}\`](./${file})`).join(target);
    out = out.split(`[${file}](./${file})`).join(target);
  }
  for (const [file, target] of Object.entries(part)) {
    out = out.split(`\`${file}\``).join(target);
  }

  // The adapter table in BRAND.md lists all five platforms. In a file
  // serving one platform, four of those rows are noise pointing at things
  // the reader does not have — so keep only this platform's row. Filtering
  // line by line rather than through a replace callback, because returning
  // null from a callback writes the string "null" into the document.
  const mine = path.basename(spec.adapter);
  out = out
    .split('\n')
    .filter((line) => {
      const m = line.match(/^\|\s*`adapters\/[^`]+`/);
      return !m || line.includes(mine);
    })
    .map((line) => {
      if (!/^\|\s*`adapters\//.test(line)) return line;
      return line.replace(/`adapters\/[^`]+`/, `Part 5 (\`${mine}\`)`);
    })
    .join('\n');

  // Any remaining bare mention of an adapter path becomes this platform's.
  out = out.replace(/`adapters\/[^`]*`/g, 'Part 5');
  return out;
}

/**
 * Demotes headings so Parts sit at the top of the hierarchy.
 *
 * An embedded document's own `##` headings would otherwise be siblings of
 * `## Part 2`, and its `## 1. Who we are` would read as a peer of
 * `## Part 1`. Shifting everything down one level makes the composed file
 * navigable: H2 is always a Part.
 */
function demoteHeadings(text) {
  return text.replace(/^(#{1,5})(\s)/gm, (_, h) => '#' + h + ' ');
}

/** Strip the H1 and any provenance block, so an embedded doc reads as a section. */
function asSection(raw, spec) {
  let out = raw.replace(/<!--[\s\S]*?-->\n?/g, '');
  out = out.replace(/^#\s+.*\n+/, '');
  if (spec) out = rewriteRefs(out, spec);
  return demoteHeadings(out.trim());
}

/**
 * Every token as a flat reference table.
 *
 * Deliberately not filtered to the platform. A table of 130 rows costs
 * almost nothing, and filtering it means an agent needing a value that was
 * left out has to guess — which is the exact failure this kit exists to
 * prevent.
 */
function tokenTable() {
  const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens.json'), 'utf8'));
  const rows = [];
  const walk = (node, trail) => {
    for (const [key, val] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      const next = trail ? `${trail}.${key}` : key;
      if (val && typeof val === 'object' && '$value' in val) {
        const v = val.$value;
        let shown;
        if (v && typeof v === 'object' && v.colorSpace) shown = v.hex || '(colour)';
        else if (v && typeof v === 'object' && v.color && v.offsetX !== undefined) {
          // A shadow. Printed as raw JSON it was both unreadable and useless;
          // this is the same string web.css emits.
          const px = (n) => (n && n.value !== undefined ? n.value : 0);
          const alphaHex = v.color.alpha === undefined || v.color.alpha === 1
            ? ''
            : Math.round(v.color.alpha * 255).toString(16).padStart(2, '0');
          const base = (v.color.hex || '').replace('#', '').toUpperCase();
          shown = `${px(v.offsetX)}px ${px(v.offsetY)}px ${px(v.blur)}px ${px(v.spread)}px `
            + `#${base}${alphaHex}`.toUpperCase();
        } else if (v && typeof v === 'object' && v.unit) shown = `${v.value}${v.unit}`;
        else if (v && typeof v === 'object' && v.value !== undefined) shown = JSON.stringify(v.value);
        else if (typeof v === 'string') shown = v;
        else shown = JSON.stringify(v);
        shown = String(shown).replace(/^"(.*)"$/, '$1');
        rows.push([next, shown]);
      } else if (val && typeof val === 'object') walk(val, next);
    }
  };
  walk(tokens, '');
  const width = Math.max(...rows.map((r) => r[0].length));
  return [
    '| Token | Value |',
    '|---|---|',
    ...rows.map(([k, v]) => `| \`${k}\` | \`${v}\` |`),
  ].join('\n');
}

/**
 * Composes one platform file: instructions, brand, values, mechanics, and
 * the theme source, in that order, so the agent reads the rules before it
 * sees the numbers and the code last.
 */
function buildPlatformFile(name, spec) {
  const rawSpine = fs.readFileSync(path.join(ROOT, spec.setup), 'utf8').trim();

  // The spine ends with a platform-specific report-back block. It is lifted
  // out and re-emitted as the final Part, so the agent is told how to report
  // once, at the end, rather than twice in two different formats.
  const reportAt = rawSpine.search(/^#{1,3}\s+\d*\.?\s*Report back\b.*$/m);
  let spine = rawSpine;
  let report = '';
  if (reportAt !== -1) {
    const head = rawSpine.slice(0, reportAt);
    const tail = rawSpine.slice(reportAt);
    // Drop the heading itself; Part 6 supplies one.
    report = tail.replace(/^#{1,3}\s+.*$/m, '').trim();
    // Renumber the sections that remain, since the removed read-order block
    // used to be section 1.
    let n = 0;
    spine = head.replace(/^(#{1,3})\s+(\d+)\.\s+/gm, (m, h, num) => `${h} ${++n}. `);
  }
  const adapter = fs.readFileSync(path.join(ROOT, spec.adapter), 'utf8').trim();
  const version = buildVersion();

  const parts = [];
  parts.push(`# Dammie Optimus Solutions — ${spec.label}`);
  parts.push(
    '**This is the whole brand kit for this platform.** It is self-contained: everything an ' +
      'agent needs to build and style a correct app is in this one file. There is nothing else ' +
      'to download, copy or read.\n\n' +
      'Follow Part 1 to the letter. Several of its rules prevent failures that produce no error ' +
      'message at all, so a successful build is not evidence that you followed them.'
  );
  parts.push(
    '```\n' +
      `# kit version ${version.match(/version : (.+)/)[1]}` +
      `\n# content      ${version.match(/content : (.+)/)[1]}` +
      '\n```\n\n' +
      'Record that content hash in the project README. It changes whenever the colours, the ' +
      'spacing or these instructions change, so it will tell you months later whether the kit ' +
      'you copied is still the kit you have.'
  );

  parts.push(`## Part 1 — Set the project up\n\n${demoteHeadings(spine)}`);

  parts.push(
    '## Part 2 — The brand\n\n' +
      'Why the brand is the way it is. Read this before making a judgement call the rules above ' +
      'do not cover.\n\n' +
      asSection(fs.readFileSync(path.join(ROOT, 'BRAND.md'), 'utf8'), spec)
  );

  parts.push(
    '## Part 3 — Every value\n\n' +
      'The exact, canonical numbers. Reach for these rather than choosing your own. References ' +
      'in `{braces}` point at other rows in this table.\n\n' +
      tokenTable()
  );

  const docNames = spec.docs.filter((d) => d !== 'BRAND.md');
  for (const doc of docNames) {
    parts.push(
      `## Part 4 — Platform mechanics (${doc})\n\n` +
        asSection(fs.readFileSync(path.join(ROOT, doc), 'utf8'), spec)
    );
  }

  parts.push(
    `## Part 5 — The theme file, copied verbatim\n\n` +
      `Write this to \`${spec.target}\` exactly as it appears. Change the package or import ` +
      'path if it needs one, and change nothing else. Do not reformat it, do not "improve" it, ' +
      'and do not fix anything you think looks wrong — report it instead. Every value in it is ' +
      'the brand.\n\n' +
      '```' + spec.lang + '\n' + adapter + '\n```'
  );

  parts.push(
    '## Part 6 — Report back\n\n' +
      (report
        ? demoteHeadings(report).replace(
            /^End your reply with exactly this block:?\s*/im, '')
        : '```\n' +
          'Brand:    Dammie Optimus Solutions design kit <version> (<content hash>)\n' +
          `Theme:    ${spec.target}\n` +
          'Failures: <every checklist item that did not pass, or "none">\n' +
          'Assumed:  <anything you decided that this file did not tell you>\n' +
          '```') +
      '\n\nFill in every line, and do not claim a check you did not run. If something did not ' +
      'pass, say so plainly. An agent that reports its own failures is useful; one that hides ' +
      'them costs more time than it saves.'
  );

  return (
    parts.join('\n\n---\n\n').trim() +
    '\n\n<!--\n' +
    `  GENERATED FILE — composed by scripts/build-brand-kit.mjs from\n` +
    `    ${spec.setup}\n` +
    `    BRAND.md\n` +
    `    tokens.json\n` +
    docNames.map((d) => `    ${d}\n`).join('') +
    `    ${spec.adapter}\n\n` +
    '  Do not edit. Change a source in the portfolio repository and run\n' +
    '  `npm run kit:build`. Any edit here is overwritten.\n' +
    '-->\n'
  );
}

/**
 * brand-kit/ is entirely generated, so it is emptied rather than cleaned.
 * Nothing is authored inside it, which is what makes a flat, folder-free kit
 * possible — and it removes the earlier hazard where a build deleted an
 * authored file that happened to live in a subdirectory.
 */
function cleanGenerated() {
  fs.rmSync(KIT, { recursive: true, force: true });
  fs.mkdirSync(KIT, { recursive: true });
}

/* ------------------------------------------------------------------ check */

if (CHECK) {
  let stale = 0;
  console.log('Checking brand-kit is current\n');

  for (const [name, spec] of Object.entries(KIT_SOURCES)) {
    const target = path.join(KIT, name);
    if (!fs.existsSync(target)) {
      console.log(`  \x1b[31mFAIL\x1b[0m  ${name} — missing. Run: npm run kit:build`);
      stale++;
      continue;
    }
    const expected = buildPlatformFile(name, spec);
    const actual = fs.readFileSync(target, 'utf8');
    if (actual === expected) {
      console.log(`  \x1b[32mok\x1b[0m    ${name}`);
    } else {
      console.log(`  \x1b[31mFAIL\x1b[0m  ${name} — out of date with its sources`);
      stale++;
    }
  }

  const vPath = path.join(KIT, 'VERSION');
  if (!fs.existsSync(vPath)) {
    console.log('  \x1b[31mFAIL\x1b[0m  VERSION — missing. Run: npm run kit:build');
    stale++;
  } else if (fs.readFileSync(vPath, 'utf8') !== buildVersion()) {
    console.log('  \x1b[31mFAIL\x1b[0m  VERSION — stale. Run: npm run kit:build');
    stale++;
  } else {
    const h = fs.readFileSync(vPath, 'utf8').match(/content : (\w+)/);
    console.log(`  \x1b[32mok\x1b[0m    VERSION — content ${h ? h[1] : '?'}`);
  }

  // Nothing but the shipped files may exist: the kit promises one file per
  // platform, and a leftover folder would quietly reintroduce the multi-file
  // layout this replaced.
  const onDisk = fs.readdirSync(KIT).sort();
  const extra = onDisk.filter((f) => !SHIPPED.includes(f));
  if (extra.length === 0) {
    console.log('  \x1b[32mok\x1b[0m    brand-kit holds exactly the shipped files, no folders');
  } else {
    console.log(`  \x1b[31mFAIL\x1b[0m  brand-kit contains ${extra.length} unexpected entr(y/ies): ${extra.join(', ')}`);
    stale += extra.length;
  }

  const tokenProblems = checkCssTokens();
  if (tokenProblems.length === 0) {
    console.log('  \x1b[32mok\x1b[0m    every CSS token named in a shipped file exists in web.css');
  } else {
    for (const pr of tokenProblems) console.log(`  \x1b[31mFAIL\x1b[0m  ${pr}`);
    stale += tokenProblems.length;
  }

  const symbolProblems = checkSetupSymbols();
  if (symbolProblems.length === 0) {
    console.log('  \x1b[32mok\x1b[0m    every symbol a shipped file names is really defined');
  } else {
    for (const pr of symbolProblems) console.log(`  \x1b[31mFAIL\x1b[0m  ${pr}`);
    stale += symbolProblems.length;
  }

  const selfContained = checkSelfContained();
  if (selfContained.length === 0) {
    console.log('  \x1b[32mok\x1b[0m    every shipped file stands alone, referencing no sibling');
  } else {
    for (const pr of selfContained) console.log(`  \x1b[31mFAIL\x1b[0m  ${pr}`);
    stale += selfContained.length;
  }

  const verbatim = checkVerbatimAdapters();
  if (verbatim.length === 0) {
    console.log('  \x1b[32mok\x1b[0m    every embedded theme file is byte-identical to its adapter');
  } else {
    for (const pr of verbatim) console.log(`  \x1b[31mFAIL\x1b[0m  ${pr}`);
    stale += verbatim.length;
  }

  if (stale > 0) {
    console.log(`\n\x1b[31m${stale} problem(s).\x1b[0m Run: npm run kit:build\n`);
    process.exit(1);
  }
  console.log(`\n\x1b[32mbrand-kit is current — ${SHIPPED.length} files, no folders.\x1b[0m\n`);
} else {
  cleanGenerated();
  console.log('Building brand-kit\n');
  let n = 0;
  for (const [name, spec] of Object.entries(KIT_SOURCES)) {
    fs.writeFileSync(path.join(KIT, name), buildPlatformFile(name, spec));
    n++;
    console.log(`  composed  ${name}`);
  }
  fs.writeFileSync(path.join(KIT, 'VERSION'), buildVersion());
  n++;
  console.log('  wrote     VERSION');
  console.log(`\n\x1b[32m${n} file(s) composed — one per platform, plus the stamp.\x1b[0m\n`);
}
