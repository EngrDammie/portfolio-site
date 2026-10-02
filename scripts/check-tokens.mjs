/**
 * Design token consistency checker.
 *
 * The gap this closes: DESIGN_SYSTEM.md, docs.css and BRAND.md each
 * restated values from tokens.json by hand. Nothing checked that they
 * still agreed, so they drifted — and in this session it produced three
 * separate real defects:
 *
 *   1. A `--text-3` light-mode value that measured 4.12:1 and failed AA.
 *   2. A `&check;` entity that reached visitors as literal text.
 *   3. A `role.dark.*` reference in BRAND.md where the group is `color.dark.*`.
 *
 * None of those were visible by reading. Each was caught by a script that
 * was looking for something specific. This is that script, generalised.
 *
 * It checks four things, in increasing order of how much they matter:
 *
 *   1. tokens.json is valid against the DTCG 2025.10 format rules.
 *   2. Every internal reference in tokens.json resolves.
 *   3. Every token path named in the markdown docs exists in tokens.json.
 *   4. Hand-maintained value files (docs.css) still agree with tokens.json.
 *
 * Run: npm run tokens:check
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const TOKENS_FILE = 'tokens.json';
/** Docs that may reference token paths. BRAND.md and DESIGN_SYSTEM.md. */
const DOCS = ['BRAND.md', 'DESIGN_SYSTEM.md', 'PLATFORM-mobile.md'];
/** Files whose values are hand-written and must agree with the token file. */
const VALUE_FILES = [
  { file: 'public/assets/docs.css', scope: ':root' },
  // DESIGN_SYSTEM.md is the copy-paste artefact other projects use. It must stay
  // self-contained, which means it necessarily restates values by hand — so it
  // is checked rather than generated.
  { file: 'DESIGN_SYSTEM.md', scope: ':root', fromFence: true },
];

let failures = 0;
let warnings = 0;

const ok = (m) => console.log(`  \x1b[32mok\x1b[0m    ${m}`);
const bad = (m) => {
  failures++;
  console.log(`  \x1b[31mFAIL\x1b[0m  ${m}`);
};
const warn = (m) => {
  warnings++;
  console.log(`  \x1b[33mwarn\x1b[0m  ${m}`);
};
const head = (m) => console.log(`\n\x1b[1m${m}\x1b[0m`);

/* ------------------------------------------------------------------ load */

head('Design token check\n');

const tokensPath = path.join(ROOT, TOKENS_FILE);
if (!fs.existsSync(tokensPath)) {
  bad(`${TOKENS_FILE} not found at the project root`);
  console.log('\nCannot continue without it.\n');
  process.exit(1);
}

let tokens;
try {
  tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  ok(`${TOKENS_FILE} is valid JSON`);
} catch (e) {
  bad(`${TOKENS_FILE} is not valid JSON: ${e.message}`);
  console.log('\nCannot continue without it.\n');
  process.exit(1);
}

/* ------------------------------------------------- 1. DTCG format validity */

// Reference: Design Tokens Format Module 2025.10
//   5.1.1 names must not begin with $ or contain { } .
//   5.2.2 a token's type is its own $type, else the nearest parent group's.
//   8.2   dimension  -> { value, unit }, unit is px or rem
//   8.5   duration    -> { value, unit }, unit is ms or s
//   8.6   cubicBezier -> array of exactly 4 numbers
//   8.1   color       -> { colorSpace, components:[r,g,b] in 0..1 }

const formatErrors = [];
const refs = [];
let tokenCount = 0;

function checkValueValue(p, val, type) {
  if (typeof val === 'string') return;
  switch (type) {
    case 'color':
      if (!val || typeof val !== 'object' || !val.colorSpace || !val.components) {
        formatErrors.push(`${p}: malformed colour value`);
        return;
      }
      if (val.components.length !== 3) {
        formatErrors.push(`${p}: colour needs exactly 3 components`);
        return;
      }
      for (const c of val.components) {
        if (typeof c !== 'number' || c < 0 || c > 1) {
          formatErrors.push(`${p}: colour component ${c} outside srgb 0..1`);
        }
      }
      // Cross-check the human-readable hex against the authoritative
      // components. These drift independently when hand-edited, and a
      // mismatch means a tool reading one and a human reading the other
      // will see different colours.
      if (val.hex) {
        const h = String(val.hex).replace('#', '');
        if (!/^[0-9a-fA-F]{6}$/.test(h)) {
          formatErrors.push(`${p}: hex is not 6 digits: ${val.hex}`);
        } else {
          const expected = [0, 2, 4].map((i) =>
            Math.round((parseInt(h.slice(i, i + 2), 16) / 255) * 10000) / 10000,
          );
          if (expected.some((v, i) => Math.abs(v - val.components[i]) > 0.0002)) {
            formatErrors.push(
              `${p}: hex ${val.hex} does not match components ${JSON.stringify(val.components)}`,
            );
          }
        }
      }
      break;
    case 'dimension':
      if (!val || typeof val !== 'object' || val.value === undefined || !val.unit) {
        formatErrors.push(`${p}: malformed dimension, needs value and unit`);
      } else if (val.unit !== 'px' && val.unit !== 'rem') {
        formatErrors.push(`${p}: dimension unit must be px or rem, got "${val.unit}"`);
      }
      break;
    case 'duration':
      if (!val || typeof val !== 'object' || !val.unit || (val.unit !== 'ms' && val.unit !== 's')) {
        formatErrors.push(`${p}: duration unit must be ms or s`);
      }
      break;
    case 'cubicBezier':
      if (!Array.isArray(val) || val.length !== 4) {
        formatErrors.push(`${p}: cubicBezier needs exactly 4 numbers`);
      }
      break;
    case 'fontWeight':
      if (typeof val !== 'number' || val < 1 || val > 1000) {
        formatErrors.push(`${p}: fontWeight must be a number 1..1000`);
      }
      break;
    case 'number':
      if (typeof val !== 'number') formatErrors.push(`${p}: number expected`);
      break;
    case 'fontFamily':
      if (typeof val !== 'string' && !Array.isArray(val)) {
        formatErrors.push(`${p}: fontFamily must be a string or array`);
      }
      break;
    default:
      break;
  }
}

function walk(node, pathSoFar, inheritedType) {
  const type = node.$type ?? inheritedType;
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (key.startsWith('$') || /[{}.]/.test(key)) {
      formatErrors.push(`${pathSoFar}.${key}: illegal characters in a token name`);
      continue;
    }
    const p = pathSoFar ? `${pathSoFar}.${key}` : key;
    if (value && typeof value === 'object' && '$value' in value) {
      tokenCount++;
      const ownType = value.$type ?? type;
      if (!ownType) {
        formatErrors.push(`${p}: no determinable $type, and no parent group declares one`);
        continue;
      }
      const v = value.$value;
      if (typeof v === 'string' && /^\{[^}]+\}$/.test(v)) refs.push([p, v.slice(1, -1)]);
      checkValueValue(p, v, ownType);
    } else if (value && typeof value === 'object') {
      walk(value, p, type);
    }
  }
}

walk(tokens, '', undefined);

head('1. Format validity (DTCG 2025.10)');
if (formatErrors.length === 0) {
  ok(`${tokenCount} tokens conform`);
} else {
  bad(`${formatErrors.length} format violation(s)`);
  for (const e of formatErrors.slice(0, 12)) console.log(`          ${e}`);
  if (formatErrors.length > 12) console.log(`          …and ${formatErrors.length - 12} more`);
}

/* ------------------------------------------------- 2. reference resolution */

head('2. Internal references');

/**
 * Resolves a path to a group. A doc may legitimately name a group — for
 * example motion.duration, which holds instant/fast/normal/slow and is
 * never itself a token. Treating that as an unknown token was a false
 * positive.
 */
function resolveGroup(ref) {
  let cur = tokens;
  for (const seg of ref.split('.')) {
    if (!cur || typeof cur !== 'object' || !(seg in cur)) return undefined;
    cur = cur[seg];
  }
  return cur && typeof cur === 'object' && !('$value' in cur) ? cur : undefined;
}

/**
 * Renders a resolved token value the way a CSS declaration would spell it, so
 * colour, dimension and duration tokens can all be compared the same way.
 * Returns null when the type has no CSS equivalent, which the caller must
 * treat as unverified rather than as a pass.
 */
function cssValue(v) {
  if (typeof v === 'string') return v.toLowerCase();
  if (!v || typeof v !== 'object') return null;
  if (v.colorSpace) {
    const h = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
    return ('#' + h(v.components[0]) + h(v.components[1]) + h(v.components[2])).toLowerCase();
  }
  if (v.unit === 'px' || v.unit === 'rem') return `${round(v.value)}${v.unit}`;
  if (v.unit === 'ms' || v.unit === 's') return `${round(v.unit === 's' ? v.value * 1000 : v.value)}ms`;
  return null;
}
const round = (n, p = 4) => String(Number(Number(n).toFixed(p)));

/** Resolves an alias chain to a literal, or returns the value unchanged. */
function resolve(v) {
  if (typeof v !== 'string') return v;
  const m = /^\{([^}]+)\}$/.exec(v);
  if (!m) return v;
  const t = resolveToken(m[1]);
  return t ? resolve(t.$value) : v;
}

function resolveToken(ref) {
  let cur = tokens;
  for (const seg of ref.split('.')) {
    if (!cur || typeof cur !== 'object' || !(seg in cur)) return undefined;
    cur = cur[seg];
  }
  return cur && typeof cur === 'object' && '$value' in cur ? cur : undefined;
}

const dangling = refs.filter(([, r]) => resolveToken(r) === undefined);
if (dangling.length === 0) {
  ok(`${refs.length} reference(s) all resolve`);
} else {
  bad(`${dangling.length} dangling reference(s)`);
  for (const [p, r] of dangling) console.log(`          ${p} -> {${r}}`);
}

/* --------------------------------------- 3. token paths named in the docs */

head('3. Token paths referenced in documentation');

for (const doc of DOCS) {
  const full = path.join(ROOT, doc);
  if (!fs.existsSync(full)) {
    warn(`${doc} not found, skipped`);
    continue;
  }
  const text = fs.readFileSync(full, 'utf8');
  // Backticked things that look like dotted token paths.
  const candidates = new Set(
    [...text.matchAll(/`([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z0-9*-]+)+)`/g)].map((m) => m[1]),
  );
  const unresolved = [];
  for (const ref of candidates) {
    // Filenames, not token paths.
    if (/\.(md|json|css|ts|tsx|swift|kt|dart|mjs|html)$/.test(ref)) continue;
    // Platform API and type names, e.g. Font.TextStyle or
    // MaterialTheme.typography. These are PascalCase at the first segment,
    // which is the convention for a type rather than a token path. Token
    // groups and tokens are always lowerCamelCase.
    if (/^[A-Z]/.test(ref)) continue;
    // A wildcard names a group and everything under it. Strip the `.*` and
    // check the group exists — skipping them entirely would let a doc
    // reference `color.typo.*` without complaint.
    if (ref.endsWith('.*')) {
      if (resolveGroup(ref.slice(0, -2)) === undefined) unresolved.push(ref);
      continue;
    }
    // A group reference is legitimate and resolves to a group, not a token.
    if (resolveGroup(ref) !== undefined) continue;
    if (resolveToken(ref) === undefined) unresolved.push(ref);
  }
  if (unresolved.length === 0) {
    ok(`${doc}: every token path it names exists`);
  } else {
    bad(`${doc}: ${unresolved.length} unknown token path(s)`);
    for (const r of unresolved) console.log(`          ${r}`);
  }
}

/* ------------------------------- 4. hand-maintained value files vs tokens */

head('4. Hand-maintained values agree with the token file');

for (const { file, scope, fromFence } of VALUE_FILES) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) {
    warn(`${file} not found, skipped`);
    continue;
  }
  const raw = fs.readFileSync(full, 'utf8');
  // Markdown keeps its CSS inside a fenced block; take the first one.
  const css = fromFence ? (raw.match(/```css\n([\s\S]*?)```/) || [, raw])[1] : raw;
  const block = css.match(new RegExp(`${scope}\\s*\\{([^}]*)\\}`));
  if (!block) {
    bad(`${file}: no ${scope} block found to compare against`);
    continue;
  }
  const declared = {};
  for (const m of block[1].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    declared[m[1]] = m[2].trim();
  }

  // Map a docs.css custom property to its token path.
  const MAP = {
    '--bg': 'color.dark.background',
    '--bg-2': 'color.dark.surface',
    '--bg-3': 'color.dark.surfaceRaised',
    '--border': 'color.dark.border',
    '--border-soft': 'color.dark.borderStrong',
    '--text': 'color.dark.text',
    '--text-2': 'color.dark.textBody',
    '--text-3': 'color.dark.textMuted',
    '--emerald': 'color.dark.brand',
    '--cyan': 'color.dark.accent',
    '--emerald-ink': 'color.dark.brandText',
    '--cyan-ink': 'color.dark.accentText',
    '--radius': 'radius.card',
  };

  const drifted = [];
  for (const [prop, tokenPath] of Object.entries(MAP)) {
    if (!(prop in declared)) continue;
    const tok = resolveToken(tokenPath);
    if (!tok) continue;
    const expected = cssValue(resolve(tok.$value));
    // A mapped property whose token has no comparable form would otherwise be
    // skipped silently. The earlier version compared colours only, so a
    // dimension drift — a changed radius, a changed spacing step — passed the
    // check while looking like it was being verified.
    if (expected === null) {
      failed();
      drifted.push(`${prop}: no comparable form for ${tokenPath}, so it is UNVERIFIED`);
      continue;
    }
    const actual = declared[prop].trim().toLowerCase();
    if (actual !== expected) {
      drifted.push(`${prop}: declared "${declared[prop]}" but ${tokenPath} is ${expected}`);
    }
  }

  if (drifted.length === 0) {
    ok(`${file}: all mapped values match ${TOKENS_FILE}`);
  } else {
    bad(`${file}: ${drifted.length} value(s) have drifted from ${TOKENS_FILE}`);
    for (const d of drifted) console.log(`          ${d}`);
  }
}

/* ------------------------------------------- 5. generated adapters are fresh */

head('5. Generated adapters match the token file');

try {
  const out = execFileSync('node', ['scripts/build-adapters.mjs', '--check'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const n = (out.match(/\x1b\[32mok/g) || []).length;
  ok(`${n} generated adapter(s) are up to date`);
} catch (err) {
  bad('a generated adapter is stale — run: npm run tokens:build');
  console.log(
    String(err.stdout || '')
      .split('\n')
      .filter((l) => l.includes('FAIL') || l.includes('stale'))
      .slice(0, 6)
      .map((l) => '          ' + l.replace(/\u001b\[\d+m/g, ''))
      .join('\n'),
  );
}

/* ------------------------------------------------------------- summary */

console.log('');
if (failures > 0) {
  console.log(
    `\x1b[31m${failures} failure(s)\x1b[0m${warnings ? `, ${warnings} warning(s)` : ''}. ` +
      `Brand values have drifted from ${TOKENS_FILE}. Fix before shipping.\n`,
  );
  process.exit(1);
}
console.log(
  `\x1b[32mAll token checks passed.\x1b[0m${warnings ? ` (${warnings} warning(s))` : ''}\n`,
);
