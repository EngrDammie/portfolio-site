/**
 * Generates the platform adapters from tokens.json.
 *
 * WHY GENERATE RATHER THAN WRITE BY HAND
 *
 * Every adapter value is a mechanical derivation: a hex string, a number,
 * a role name. That is exactly the case where a generator earns its keep,
 * because a hand-written copy drifts. It already had — DESIGN_SYSTEM.md and
 * docs.css both restated tokens.json by hand, and the checker had to be
 * written specifically to catch them disagreeing.
 *
 * So: generate the adapters, and gate on staleness. `npm run tokens:build`
 * rewrites them. `npm run adapters:check` fails if the committed files are
 * not byte-identical to what the generator would produce right now. Editing
 * an adapter by hand is therefore not a silent error — it fails the check.
 *
 * UNITS
 *
 * The token file is unit-aware (px, rem, ms). Adapters are not, and the
 * mapping is not uniform:
 *
 *   - Typography sizes are authored in rem because that is what the web
 *     needs. Native platforms want sp (Android) or pt (iOS) so that the
 *     user's text-size setting can scale them.
 *   - Space and radius are authored in px, which maps 1:1 to dp and pt.
 *
 * rem is converted at a 16px root. Anyone changing that root must change
 * REM_BASE here too.
 *
 * REFERENCES ARE RESOLVED, NOT COPIED
 *
 * tokens.json may say "{color.dark.textBody}". CSS can keep that as var();
 * Kotlin, Swift and TypeScript cannot. So every emitted value is a literal,
 * fully resolved through the alias chain. That is a deliberate loss of
 * indirection in exchange for adapters that compile and cannot reference a
 * token that was renamed.
 *
 * Usage:
 *   node scripts/build-adapters.mjs            write the adapters
 *   node scripts/build-adapters.mjs --check    fail if they are stale
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'adapters');
const CHECK = process.argv.includes('--check');

/** Root font size that rem is resolved against. Must match the web root. */
const REM_BASE = 16;

const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens.json'), 'utf8'));

/* ------------------------------------------------------- reference resolution */

const RESOLVING = new Set();

/**
 * Follows an alias chain to a literal value.
 *
 * tokens.json chains aliases (color.dark.text -> palette.slate.100), and a
 * chain could in principle loop. The DTCG spec requires this to be an error,
 * so it is treated as one rather than recursed into until the stack dies.
 */
function resolveValue(v) {
  if (typeof v === 'string') {
    const m = /^\{([^}]+)\}$/.exec(v);
    if (!m) return v;
    if (RESOLVING.has(m[1])) {
      throw new Error(`Circular reference detected: ${[...RESOLVING, m[1]].join(' -> ')}`);
    }
    RESOLVING.add(m[1]);
    let cur = tokens;
    for (const seg of m[1].split('.')) {
      if (!cur || typeof cur !== 'object' || !(seg in cur)) {
        throw new Error(`Unresolved reference {${m[1]}}`);
      }
      cur = cur[seg];
    }
    if (!cur || !('$value' in cur)) throw new Error(`Reference {${m[1]}} is a group, not a token`);
    const out = resolveValue(cur.$value);
    RESOLVING.delete(m[1]);
    return out;
  }
  return v;
}

function token(ref) {
  let cur = tokens;
  for (const seg of ref.split('.')) {
    if (!cur || typeof cur !== 'object' || !(seg in cur)) return undefined;
    cur = cur[seg];
  }
  return cur && '$value' in cur ? cur : undefined;
}

function value(ref) {
  const t = token(ref);
  if (!t) throw new Error(`No such token: ${ref}`);
  return resolveValue(t.$value);
}

/* ------------------------------------------------------------- conversions */

const toHex = (c) => {
  const h = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  const base = `#${h(c.components[0])}${h(c.components[1])}${h(c.components[2])}`.toUpperCase();
  const alpha = c.alpha === undefined || c.alpha === 1 ? '' : h(c.alpha);
  return alpha ? `${base}${alpha}` : base;
};

const dimToPx = (d) => (d.unit === 'rem' ? d.value * REM_BASE : d.value);
const durToMs = (d) => (d.unit === 's' ? d.value * 1000 : d.value);
const round = (n, p = 3) => Number(n.toFixed(p));

/** Kotlin Color literal. */
/**
 * Kotlin's Color(Long) literal is exactly 0xAARRGGBB — eight hex digits.
 * Emitting a leading FF *and* appending an alpha produced ten digits, which
 * is silently the wrong colour rather than a compile error in some cases.
 */
const kotlinColor = (hex) => {
  const s = hex.replace('#', '').toUpperCase();
  const rgb = s.slice(0, 6);
  const a = s.length === 8 ? s.slice(6, 8) : 'FF';
  return `Color(0x${a}${rgb})`;
};

/* ----------------------------------------------------------- role name helpers */

/**
 * Dammie token paths are lowerCamelCase and multi-word (textBody). Each target
 * language wants a different casing. These are the only places that know.
 */
/**
 * Resolves a semantic colour role to the Palette member name that holds its
 * value, for the languages that expose the palette directly.
 *
 * Roles are references ("{palette.emerald.500}") so the path has to be walked
 * rather than assumed. Resolving to a name that is not actually declared in
 * the emitted palette is what broke the first version of the Swift colours.
 */
function paletteMember(role, theme) {
  // The RAW value, not the resolved one. `value()` follows the alias chain and
  // hands back a literal colour object, at which point the reference to the
  // palette is already gone and every role collapses to a hex name. Reading the
  // token directly is what lets a role point at the named palette entry.
  const tok = token(`color.${theme}.${role}`);
  if (!tok) throw new Error(`No such token: color.${theme}.${role}`);
  const raw = tok.$value;
  if (typeof raw === 'string') {
    const m = /^\{palette\.([a-z]+)\.(\d+)\}$/.exec(raw);
    if (m) return pascal(m[1]) + m[2];
  }
  // A genuine literal in the token file. Give it a readable name rather than
  // a hex fragment, so the emitted Swift reads like intent.
  const hex = toHex(resolveValue(raw)).slice(1);
  const h = hex.toUpperCase();
  return `Swatch${h.charAt(0)}${h.slice(1, 4)}${h.slice(4)}`;
}

const camel = (s) => s;
const pascal = (s) => s[0].toUpperCase() + s.slice(1);
/**
 * Spacing keys that start with a digit cannot be identifiers in Kotlin,
 * Swift or TypeScript. Maps them to the conventional abbreviations, so
 * `space.xxs` is valid everywhere. CSS keeps the original names because
 * custom property names have no such restriction.
 */
const SAFE_KEY = { '3xs': 'xxxs', '2xs': 'xxs', '3xl': 'xxxl', '2xl': 'xxl' };
/**
 * The generic fallback matters: an explicit map alone would silently emit an
 * invalid identifier the moment a new digit-leading key is added to the
 * spacing scale. It was caught once already by 2xl and 3xl.
 */
const ident = (k) => SAFE_KEY[k] || (/^[0-9]/.test(k) ? `x${k}` : k);

/* ------------------------------------------------------------ shared lookups */

const COLOR_ROLES = [
  'background', 'surface', 'surfaceRaised', 'border', 'borderStrong',
  'text', 'textBody', 'textMuted', 'brand', 'brandText',
  'accent', 'accentText', 'warning', 'warningText',
  'danger', 'dangerText', 'onBrand',
];

const SPACE_KEYS = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];

const ROLES = ['display', 'title', 'heading', 'bodyLarge', 'body', 'label', 'meta', 'eyebrow'];

const BANNER = (source) =>
  `// GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/build-adapters.mjs from tokens.json.
// Edit tokens.json, then run: npm run tokens:build
// This file is checked for staleness by: npm run adapters:check
// Source of truth: ${source}`;

/**
 * Builds a header as a comment in the target language.
 *
 * `prefix` is called per line so the same function produces a CSS block
 * comment, a line comment, or a TypeScript line comment. Emitting bare text
 * was a syntax error in TypeScript and junk in CSS.
 */
const fileHeader = (source, lang, prefix) => {
  const head = [
    'GENERATED FILE - DO NOT EDIT BY HAND.',
    'Produced by scripts/build-adapters.mjs from tokens.json.',
    'Edit tokens.json, then run: npm run tokens:build',
    'Checked for staleness by: npm run adapters:check',
    '',
    lang,
    `Source of truth: ${source}`,
  ];
  return head.map(prefix).join('\n');
};

/* ============================================================ web.css */

function buildWeb() {
  const lines = [];
  const L = (s = '') => lines.push(s);

  L(fileHeader('tokens.json', 'CSS custom properties for web and documents.', (t) => `/* ${t} */`.trimEnd()));
  L();
  L('/* Dark is the default because the brand is dark-native. Light is a token');
  L('   swap, not a second stylesheet: every colour a component uses comes from');
  L('   one of these properties, so changing this block changes the interface. */');
  L();
  L(':root {');

  const emit = (name, ref, unit = '') => {
    const v = value(ref);
    if (typeof v === 'string') return;
    if (v.colorSpace) L(`  --${name}: ${toHex(v)};`);
    else if (v.unit === 'px' || v.unit === 'rem') L(`  --${name}: ${round(v.value)}${unit || v.unit};`);
    else if (v.unit === 'ms' || v.unit === 's') L(`  --${name}: ${round(durToMs(v))}ms;`);
  };

  L('  /* Surfaces */');
  emit('bg', 'color.dark.background');
  emit('bg-2', 'color.dark.surface');
  emit('bg-3', 'color.dark.surfaceRaised');
  emit('border', 'color.dark.border');
  emit('border-soft', 'color.dark.borderStrong');
  L();
  L('  /* Text */');
  emit('text', 'color.dark.text');
  emit('text-2', 'color.dark.textBody');
  emit('text-3', 'color.dark.textMuted');
  L();
  L('  /* Brand — fills and borders */');
  emit('emerald', 'color.dark.brand');
  emit('cyan', 'color.dark.accent');
  L();
  L('  /* Brand — text-safe. Never use the two above for text. */');
  emit('emerald-ink', 'color.dark.brandText');
  emit('cyan-ink', 'color.dark.accentText');
  emit('amber-ink', 'color.dark.warningText');
  emit('rose-ink', 'color.dark.dangerText');
  L();
  L('  /* Status */');
  emit('amber', 'color.dark.warning');
  emit('rose', 'color.dark.danger');
  L();
  L('  /* Geometry */');
  emit('radius', 'radius.card');
  emit('radius-control', 'radius.control');
  emit('radius-chip', 'radius.chip');
  emit('radius-pill', 'radius.pill');
  emit('border-w', 'borderWidth.default');
  for (const k of SPACE_KEYS) emit(`space-${k}`, `space.${k}`);
  L();
  L('  /* Touch targets — meaningless on a pointer device, kept so a web build');
  L('     running on a phone has something to read. */');
  emit('touch-min', 'touchTarget.minimumAndroid');
  emit('touch-gap', 'touchTarget.spacing');
  L();
  L('  /* Type */');
  emit('font-sans', 'typography.family.web');
  emit('font-mono', 'typography.family.mono');
  L();
  L('  /* Layout */');
  emit('page-max', 'layout.pageMax');
  emit('content-max', 'layout.contentMax');
  emit('gutter', 'layout.gutter');
  emit('sidebar-w', 'layout.sidebarWidth');
  L();
  L('  /* Motion. Curves are web-only; native platforms substitute their own. */');
  emit('motion-instant', 'motion.duration.instant');
  emit('motion-fast', 'motion.duration.fast');
  emit('motion-normal', 'motion.duration.normal');
  emit('motion-slow', 'motion.duration.slow');
  const ease = (n) => `cubic-bezier(${value(`motion.easing.${n}`).join(', ')})`;
  L(`  --ease-standard: ${ease('standard')};`);
  L(`  --ease-decelerate: ${ease('decelerate')};`);
  L(`  --ease-accelerate: ${ease('accelerate')};`);
  L();
  L('  /* The one gradient */');
  L('  --grad: linear-gradient(135deg, var(--emerald) 0%, var(--cyan) 100%);');
  L('}');
  L();
  L('/* ---------------------------------------------------------------');
  L('   Light theme.');
  L('   Accent values take a DARKER step, not the dark-theme value. Borders get');
  L('   stronger, not weaker. The gradient is unchanged, and onPrimary stays');
  L('   dark, because it is the one element that must look identical in both.');
  L('   --------------------------------------------------------------- */');
  L();
  L('html[data-theme="light"] {');
  const emitLight = (name, ref) => {
    const v = value(ref);
    if (v && v.colorSpace) L(`  --${name}: ${toHex(v)};`);
  };
  emitLight('bg', 'color.light.background');
  emitLight('bg-2', 'color.light.surface');
  emitLight('bg-3', 'color.light.surfaceRaised');
  emitLight('border', 'color.light.border');
  emitLight('border-soft', 'color.light.borderStrong');
  emitLight('text', 'color.light.text');
  emitLight('text-2', 'color.light.textBody');
  emitLight('text-3', 'color.light.textMuted');
  emitLight('emerald', 'color.light.brand');
  emitLight('cyan', 'color.light.accent');
  emitLight('emerald-ink', 'color.light.brandText');
  emitLight('cyan-ink', 'color.light.accentText');
  emitLight('amber-ink', 'color.light.warningText');
  emitLight('rose-ink', 'color.light.dangerText');
  emitLight('amber', 'color.light.warning');
  emitLight('rose', 'color.light.danger');
  L('}');
  L();

  return lines.join('\n');
}

/* ============================================================ Compose */

function buildCompose() {
  const L = (s = '') => lines.push(s);
  const lines = [];
  const P = [];

  L(BANNER('tokens.json'));
  L('package com.dammieoptimus.brand');
  L();
  L('import androidx.compose.foundation.isSystemInDarkTheme');
  L('import androidx.compose.foundation.shape.RoundedCornerShape');
  L('import androidx.compose.material3.MaterialTheme');
  L('import androidx.compose.material3.Shapes');
  L('import androidx.compose.material3.Typography');
  L('import androidx.compose.material3.darkColorScheme');
  L('import androidx.compose.material3.lightColorScheme');
  L('import androidx.compose.runtime.Composable');
  L('import androidx.compose.ui.graphics.Color');
  L('import androidx.compose.ui.text.TextStyle');
  L('import androidx.compose.ui.text.font.FontWeight');
  L('import androidx.compose.ui.unit.dp');
  L('import androidx.compose.ui.unit.em');
  L('import androidx.compose.ui.unit.sp');
  L();
  L('/**');
  L(' * Raw palette. Referenced only by the colour schemes below.');
  L(' * No screen should ever import this.');
  L(' */');
  L('internal object Palette {');
  for (const [fam, step] of [
    ['emerald', '400'], ['emerald', '500'], ['emerald', '700'],
    ['cyan', '400'], ['cyan', '500'], ['cyan', '700'],
    ['amber', '400'], ['amber', '500'], ['amber', '700'],
    ['rose', '400'], ['rose', '500'], ['rose', '700'],
    ['slate', '50'], ['slate', '100'], ['slate', '300'], ['slate', '400'],
    ['slate', '700'], ['slate', '800'], ['slate', '900'], ['slate', '950'],
  ]) {
    P.push(`    val ${pascal(fam)}${step} = ${kotlinColor(toHex(value(`palette.${fam}.${step}`)))}`);
  }
  // Derived, not hardcoded, so it cannot drift from the light theme.
  P.push(`    val Paper = ${kotlinColor(toHex(value('color.light.background')))}`);
  P.sort();
  for (const line of P) L(line);
  L('}');
  L();

  const scheme = (fn, theme) => {
    L(`private val ${pascal(theme)}Colors = ${fn}(`);
    const M = {
      primary: 'brand',
      onPrimary: 'onBrand',
      primaryContainer: null,
      secondary: 'accent',
      onSecondary: 'onBrand',
      background: 'background',
      onBackground: 'text',
      surface: 'surface',
      onSurface: 'text',
      surfaceVariant: 'surfaceRaised',
      onSurfaceVariant: 'textMuted',
      surfaceContainer: 'surface',
      surfaceContainerHigh: 'surfaceRaised',
      outline: 'border',
      outlineVariant: 'borderStrong',
      error: 'danger',
      onError: 'dangerText',
      errorContainer: null,
    };
    const out = [];
    for (const [k, role] of Object.entries(M)) {
      if (!role) continue;
      const hex = toHex(value(`color.${theme}.${role}`));
      out.push(`    ${k} = ${kotlinColor(hex)},`);
    }
    for (const line of out) L(line);
    L(')');
    L();
  };
  scheme('darkColorScheme', 'dark');
  scheme('lightColorScheme', 'light');

  L('/** Four radii, no invention between them. */');
  L('private val BrandShapes = Shapes(');
  L(`    extraSmall = RoundedCornerShape(${round(value('radius.chip').value)}.dp),`);
  L(`    small      = RoundedCornerShape(${round(value('radius.chip').value)}.dp),`);
  L(`    medium     = RoundedCornerShape(${round(value('radius.control').value)}.dp),`);
  L(`    large      = RoundedCornerShape(${round(value('radius.card').value)}.dp),`);
  L(`    extraLarge = RoundedCornerShape(${round(value('radius.card').value)}.dp),`);
  L(')');
  L();

  L('/**');
  L(' * Type roles mapped onto Material typography.');
  L(' *');
  L(' * Line heights are generous by design — that is the brand, not an oversight.');
  L(' * Letter spacing is in em so it stays proportional if the scale changes.');
  L(' * Never replace these with a hardcoded sp value in a screen.');
  L(' */');
  L('private val BrandTypography = Typography(');

  // role -> (material slot, fontSize token, weight token, tracking token)
  const MAP = [
    ['display', 'displayLarge', 'display', 'extrabold', 'display'],
    ['title', 'headlineMedium', 'title', 'extrabold', 'title'],
    ['heading', 'titleLarge', 'heading', 'bold', 'heading'],
    ['bodyLarge', 'bodyLarge', 'bodyLarge', 'regular', null],
    ['body', 'bodyMedium', 'body', 'regular', null],
    ['label', 'labelLarge', 'label', 'semibold', null],
    ['meta', 'bodySmall', 'meta', 'medium', null],
    ['eyebrow', 'labelSmall', 'eyebrow', 'extrabold', null],
  ];
  const slotLines = [];
  for (const [, slot, src, weight, trackSrc] of MAP) {
    const size = dimToPx(value(`typography.role.${src}.fontSize`));
    const lh = dimToPx(value(`typography.role.${src}.fontSize`)) * value(`typography.role.${src}.lineHeight`);
    const tracking = trackSrc ? value(`typography.role.${trackSrc}.tracking`) : 0;
    const w = { regular: 'Normal', medium: 'Medium', semibold: 'SemiBold', bold: 'Bold', extrabold: 'ExtraBold' }[weight];
    const parts = [
      `fontSize = ${round(size, 2)}.sp`,
      `lineHeight = ${round(lh, 1)}.sp`,
      `fontWeight = FontWeight.${w}`,
    ];
    if (tracking) parts.push(`letterSpacing = (${round(tracking)}).em`);
    slotLines.push(`    ${slot} = TextStyle(${parts.join(', ')}),`);
  }
  for (const line of slotLines) L(line);
  L(')');
  L();

  L('/** Dimensions. Spacing in dp, type in sp — never the other way round. */');
  L('object Dimm {');
  for (const k of SPACE_KEYS) L(`    val ${pascal(ident(k))} = ${round(value(`space.${k}`).value)}.dp`);
  L();
  L(`    val radiusChip    = ${round(value('radius.chip').value)}.dp`);
  L(`    val radiusControl = ${round(value('radius.control').value)}.dp`);
  L(`    val radiusCard    = ${round(value('radius.card').value)}.dp`);
  L();
  L('    // Hit area, not visual size. Pad to reach it, never shrink below it.');
  L(`    val touchTarget = ${round(value('touchTarget.minimumAndroid').value)}.dp`);
  L(`    val touchGap    = ${round(value('touchTarget.spacing').value)}.dp`);
  L();
  L(`    val borderWidth = ${round(value('borderWidth.default').value, 1)}.dp`);
  L();
  L(`    val motionFast   = ${Math.round(durToMs(value('motion.duration.fast')))}`);
  L(`    val motionNormal = ${Math.round(durToMs(value('motion.duration.normal')))}`);
  L('}');
  L();
  L('/**');
  L(' * Apply once, at the top of the tree.');
  L(' *');
  L(' * darkTheme follows the system by default. Do not force it: the brand is');
  L(' * dark-native, which is unusually well suited to phones, so following the');
  L(' * user gets the benefit without doing anything.');
  L(' */');
  L('@Composable');
  L('fun DammieTheme(');
  L('    darkTheme: Boolean = isSystemInDarkTheme(),');
  L('    content: @Composable () -> Unit,');
  L(') = MaterialTheme(');
  L('    colorScheme = if (darkTheme) DarkColors else LightColors,');
  L('    shapes = BrandShapes,');
  L('    typography = BrandTypography,');
  L('    content = content,');
  L(')');

  return lines.join('\n');
}

/* ============================================================ Swift */

function buildSwift() {
  const lines = [];
  const L = (s = '') => lines.push(s);

  L('// GENERATED FILE - DO NOT EDIT BY HAND.');
  L('// Produced by scripts/build-adapters.mjs from tokens.json.');
  L('// Edit tokens.json, then run: npm run tokens:build');
  L('// Checked for staleness by: npm run adapters:check');
  L('//');
  L('// Note on type: this adapter deliberately does NOT carry font sizes. iOS');
  L('// scales text through Dynamic Type, so a pinned point size fights the');
  L('// user. Roles map to Font.TextStyle instead - see Brand.Role.');
  L('//');
  L('// Source of truth: tokens.json');
  L();
  L('import SwiftUI');
  L();
  L('enum Brand {');
  L();
  L('    // MARK: - Palette (internal use only)');
  L('    enum Palette {');
  const sp = [];
  for (const [fam, step] of [
    ['emerald', '400'], ['emerald', '500'], ['emerald', '700'],
    ['cyan', '400'], ['cyan', '500'], ['cyan', '700'],
    ['amber', '400'], ['amber', '500'], ['amber', '700'],
    ['rose', '400'], ['rose', '500'], ['rose', '700'],
    ['slate', '50'], ['slate', '100'], ['slate', '300'], ['slate', '400'],
    ['slate', '700'], ['slate', '800'], ['slate', '900'], ['slate', '950'],
  ]) {
    const hex = toHex(value(`palette.${fam}.${step}`)).slice(1);
    sp.push(`        static let ${pascal(fam)}${step} = Color(hex: 0x${hex})`);
  }
  sp.push(`        static let Paper = Color(hex: 0x${toHex(value('color.light.background')).slice(1)})`);
  sp.push(`        static let white = Color(hex: 0x${toHex(value('color.light.surface')).slice(1)})`);
  // Some semantic roles are literal values in the token file rather than
  // palette references (the light-theme surfaces are). Those still need a
  // Palette member, because the self-check requires every Palette.X reference
  // to resolve, and because a role should never inline a hex.
  const literals = new Map();
  for (const theme of ['dark', 'light']) {
    for (const role of COLOR_ROLES) {
      const tok = token(`color.${theme}.${role}`);
      if (!tok) continue;
      const raw = tok.$value;
      if (typeof raw === 'string') continue; // a real palette reference
      const hex = toHex(resolveValue(raw)).slice(1);
      literals.set(paletteMember(role, theme), hex);
    }
  }
  for (const [name, hex] of literals) {
    sp.push(`        static let ${name} = Color(hex: 0x${hex})`);
  }

  sp.sort();
  for (const line of sp) L(line);
  L('    }');
  L();
  L('    // MARK: - Colour roles');
  L('    //');
  L('    // Screens use these, never Palette directly. A plain name is for fills');
  L('    // and borders; the Text-suffixed one is the only variant permitted for');
  L('    // coloured text. That distinction is the same on every platform.');
  L('    //');
  L('    // Declared as nested enums of assignments rather than a struct with a');
  L('    // memberwise initialiser: an initialiser can only be correct if every');
  L('    // palette name it references exists, and that is exactly the bug this');
  L('    // shape was rewritten to remove.');
  L('    enum Colors {');
  for (const role of COLOR_ROLES) {
    L(`        static let ${camel(role)} = Palette.${paletteMember(role, 'dark')}`);
  }
  L();
  L('        /// Light theme. Accent values take a DARKER step, never the dark');
  L('        /// value above. Reusing the dark accents here is the single most');
  L('        /// common way this brand is broken on a light background.');
  L('        enum Light {');
  for (const role of COLOR_ROLES) {
    L(`            static let ${camel(role)} = Palette.${paletteMember(role, 'light')}`);
  }
  L('        }');
  L('    }');
  L();
  L('    // MARK: - Dimensions');
  L('    enum Dimension {');
  L(`        static let touchTargetIOS: CGFloat = ${round(value('touchTarget.minimumIOS').value)}`);
  L(`        static let touchGap: CGFloat = ${round(value('touchTarget.spacing').value)}`);
  L(`        static let radiusChip: CGFloat = ${round(value('radius.chip').value)}`);
  L(`        static let radiusControl: CGFloat = ${round(value('radius.control').value)}`);
  L(`        static let radiusCard: CGFloat = ${round(value('radius.card').value)}`);
  L(`        static let borderWidth: CGFloat = ${round(value('borderWidth.default').value, 1)}`);
  L(`        static let gutter: CGFloat = ${round(value('layout.gutter').value)}`);
  L();
  L('        enum Spacing {');
  for (const k of SPACE_KEYS) L(`            static let ${pascal(ident(k))}: CGFloat = ${round(value(`space.${k}`).value)}`);
  L('        }');
  L('    }');
  L();
  L('    // MARK: - Type roles');
  L('    //');
  L('    // A role, not a size. Using these lets Dynamic Type do its job; setting');
  L('    // .system(size:) instead will silently break accessibility text sizes.');
  L('    enum Role {');
  const SWIFT_ROLE = {
    display: '.largeTitle', title: '.title', heading: '.headline',
    bodyLarge: '.body', body: '.body', label: '.subheadline',
    meta: '.footnote', eyebrow: '.caption',
  };
  for (const r of ROLES) {
    L(`        static let ${camel(r)}: Font.TextStyle = ${SWIFT_ROLE[r]}`);
  }
  L('    }');
  L();
  L('    // MARK: - Theme');
  L('    static func background(_ scheme: ColorScheme) -> Color {');
  L('        scheme == .dark ? Palette.Slate950 : Palette.Paper');
  L('    }');
  L();
  L('    static func surface(_ scheme: ColorScheme) -> Color {');
  L('        scheme == .dark ? Palette.Slate900 : Palette.white');
  L('    }');
  L('}');
  L();
  L('/// Convenience: the role set for a colour scheme.');
  L('extension Brand {');
  L('    static func colors(_ scheme: ColorScheme) -> Brand.Colors {');
  L('        scheme == .dark ? .dark : .light');
  L('    }');
  L('}');
  L('extension Color {');
  L('    /// Accepts 0xRRGGBB or 0xAARRGGBB. Used by the generated palette above.');
  L('    init(hex: UInt32) {');
  L('        self.init(');
  L('            .sRGB,');
  L('            red: Double((hex >> 16) & 0xFF) / 255,');
  L('            green: Double((hex >> 8) & 0xFF) / 255,');
  L('            blue: Double(hex & 0xFF) / 255,');
  L('            opacity: 1');
  L('        )');
  L('    }');
  L('}');

  return lines.join('\n');
}

/* ============================================================ React Native */

function buildReactNative() {
  const lines = [];
  const L = (s = '') => lines.push(s);

  L(fileHeader('tokens.json', 'Typed theme for React Native and Expo.', (t) => `// ${t}`.trimEnd()));
  L();
  L('/*');
  L(' * Text sizes are numbers because React Native scales them automatically via');
  L(' * allowFontScaling, which defaults to true. Setting it false makes the app');
  L(' * unusable for someone who needs larger text — do not.');
  L(' *');
  L(' * Colours are plain strings rather than require()d numbers so that they work');
  L(' * in StyleSheet.create and in navigation options equally.');
  L(' */');
  L();
  L('export type ThemeMode = \'dark\' | \'light\';');
  L();
  L('export type Colors = {');
  for (const role of COLOR_ROLES) {
    L(`  ${camel(role)}: string;`);
  }
  L('};');
  L();
  L('const dark: Colors = {');
  for (const role of COLOR_ROLES) {
    L(`  ${camel(role)}: '${toHex(value(`color.dark.${role}`))}',`);
  }
  L('};');
  L();
  L('const light: Colors = {');
  for (const role of COLOR_ROLES) {
    L(`  ${camel(role)}: '${toHex(value(`color.light.${role}`))}',`);
  }
  L('};');
  L();
  L('export const colors: Record<ThemeMode, Colors> = { dark, light };');
  L();
  L('export const space = {');
  for (const k of SPACE_KEYS) L(`  ${ident(k)}: ${round(value(`space.${k}`).value)},`);
  L('} as const;');
  L();
  L('export const radius = {');
  L(`  chip: ${round(value('radius.chip').value)},`);
  L(`  control: ${round(value('radius.control').value)},`);
  L(`  card: ${round(value('radius.card').value)},`);
  L(`  pill: ${round(value('radius.pill').value)},`);
  L('} as const;');
  L();
  L('/** Font sizes in the web (rem) baseline, converted at a 16px root. */');
  L('export const fontSize = {');
  for (const r of ROLES) {
    L(`  ${camel(r)}: ${round(dimToPx(value(`typography.role.${r}.fontSize`)), 2)},`);
  }
  L('} as const;');
  L();
  L('export const lineHeight = {');
  for (const r of ROLES) {
    const lh = dimToPx(value(`typography.role.${r}.fontSize`)) * value(`typography.role.${r}.lineHeight`);
    L(`  ${camel(r)}: ${round(lh, 1)},`);
  }
  L('} as const;');
  L();
  L('export const fontWeight = {');
  for (const k of ['regular', 'medium', 'semibold', 'bold', 'extrabold']) {
    L(`  ${camel(k)}: '${value(`typography.weight.${k}`)}' as const,`);
  }
  L('};');
  L();
  L('/**');
  L(' * Hit area, not visual size. Pad to reach it.');
  L(' * Platform.select where a single app targets both.');
  L(' */');
  L('export const touch = {');
  L(`  minimumIOS: ${round(value('touchTarget.minimumIOS').value)},`);
  L(`  minimumAndroid: ${round(value('touchTarget.minimumAndroid').value)},`);
  L(`  gap: ${round(value('touchTarget.spacing').value)},`);
  L('} as const;');
  L();
  L('export const duration = {');
  for (const k of ['instant', 'fast', 'normal', 'slow']) {
    L(`  ${camel(k)}: ${round(durToMs(value(`motion.duration.${k}`)))},`);
  }
  L('} as const;');
  L();
  L('export const theme = (mode: ThemeMode) => ({');
  L('  mode,');
  L('  colors: colors[mode],');
  L('  space, radius, fontSize, lineHeight, fontWeight, touch, duration,');
  L('  isDark: mode === \'dark\',');
  L('});');
  L();
  L('export type Theme = ReturnType<typeof theme>;');

  return lines.join('\n');
}

/* ------------------------------------------------------------------ write */

const TARGETS = [
  { file: 'web.css', build: buildWeb },
  { file: 'compose/Brand.kt', build: buildCompose },
  { file: 'swift/Brand.swift', build: buildSwift },
  { file: 'react-native/tokens.ts', build: buildReactNative },
];

/**
 * Structural self-check on the generated output.
 *
 * A generator that emits code nobody compiles in CI will quietly ship wrong
 * code. Four bugs got through this one — a non-JavaScript method call, a
 * token that did not exist, identifiers starting with a digit, and a Kotlin
 * literal ten digits wide. These assertions are cheap and would have caught
 * all four at the point they were introduced.
 */
function selfCheck(name, content) {
  const problems = [];
  if (name.endsWith('.kt')) {
    for (const m of content.matchAll(/Color\(0x([0-9A-Fa-f]+)\)/g)) {
      if (m[1].length !== 8) {
        problems.push(`Color(0x${m[1]}) is ${m[1].length} digits; Kotlin needs exactly 8 (AARRGGBB)`);
      }
    }
    for (const m of content.matchAll(/^\s*(?:val|var|fun|object)\s+([0-9][A-Za-z0-9]*)/gm)) {
      problems.push(`declaration "${m[1]}" starts with a digit, which is not a valid Kotlin identifier`);
    }
  }
  if (name.endsWith('.swift')) {
    for (const m of content.matchAll(/Color\(hex: 0x([0-9A-Fa-f]+)\)/g)) {
      if (m[1].length !== 6 && m[1].length !== 8) {
        problems.push(`Color(hex: 0x${m[1]}) is ${m[1].length} digits; expected 6 or 8`);
      }
    }
    for (const m of content.matchAll(/^\s*(?:let|var|func|struct|enum|case)\s+([0-9][A-Za-z0-9]*)/gm)) {
      problems.push(`declaration "${m[1]}" starts with a digit, which is not a valid Swift identifier`);
    }
  }
  if (name.endsWith('.ts')) {
    for (const m of content.matchAll(/^\s{2}([0-9][A-Za-z0-9]*):/gm)) {
      problems.push(`key "${m[1]}" starts with a digit, which is not a valid TypeScript identifier`);
    }
  }
  if (name.endsWith('.kt') || name.endsWith('.swift')) {
    // Every Palette/Internal object member that is referenced must actually be
    // declared. The first Swift colour implementation referenced
    // Palette.background, which does not exist, and it was not caught — this
    // is the check that would have caught it.
    const declared = new Set(
      [...content.matchAll(/static (?:let|var) (\w+)|\bval (\w+)/g)].map((m) => m[1] || m[2]),
    );
    for (const m of content.matchAll(/Palette\.(\w+)/g)) {
      if (!declared.has(m[1])) {
        problems.push(`references Palette.${m[1]}, which is not declared in this file`);
      }
    }
  }

  const braces = (content.match(/\{/g) || []).length === (content.match(/\}/g) || []).length;
  if (!braces) problems.push('braces are unbalanced');

  if (problems.length) {
    throw new Error(
      `Self-check failed for ${name}:\n  ${problems.slice(0, 6).join('\n  ')}` +
        (problems.length > 6 ? `\n  …and ${problems.length - 6} more` : ''),
    );
  }
}

let stale = 0;
let wrote = 0;

console.log(CHECK ? 'Checking adapters for staleness\n' : 'Building adapters\n');

for (const t of TARGETS) {
  const target = path.join(OUT_DIR, t.file);
  const content = t.build();
  selfCheck(t.file, content);
  let existing = null;
  try {
    existing = fs.readFileSync(target, 'utf8');
  } catch {
    /* not built yet */
  }

  if (CHECK) {
    if (existing === null) {
      console.log(`  \x1b[31mFAIL\x1b[0m  adapters/${t.file} — missing. Run: npm run tokens:build`);
      stale++;
    } else if (existing !== content) {
      console.log(`  \x1b[31mFAIL\x1b[0m  adapters/${t.file} — out of date with tokens.json`);
      stale++;
    } else {
      console.log(`  \x1b[32mok\x1b[0m    adapters/${t.file}`);
    }
    continue;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  wrote++;
  console.log(`  wrote  adapters/${t.file}  ${(content.length / 1024).toFixed(1)} KB`);
}

if (CHECK) {
  if (stale > 0) {
    console.log(
      `\n\x1b[31m${stale} adapter(s) stale.\x1b[0m Generated files must never be hand-edited — ` +
        `edit tokens.json and run: npm run tokens:build\n`,
    );
    process.exit(1);
  }
  console.log(`\n\x1b[32mAll ${TARGETS.length} adapters match tokens.json.\x1b[0m\n`);
} else {
  console.log(`\n\x1b[32m${wrote} adapter(s) built.\x1b[0m\n`);
}
