// GENERATED FILE - DO NOT EDIT BY HAND.
// Produced by scripts/build-adapters.mjs from tokens.json.
// Edit tokens.json, then run: npm run tokens:build
// Checked for staleness by: npm run adapters:check
//
// Typed theme for React Native and Expo.
// Source of truth: tokens.json

/*
 * Text sizes are numbers because React Native scales them automatically via
 * allowFontScaling, which defaults to true. Setting it false makes the app
 * unusable for someone who needs larger text — do not.
 *
 * Colours are plain strings rather than require()d numbers so that they work
 * in StyleSheet.create and in navigation options equally.
 */

export type ThemeMode = 'dark' | 'light';

export type Colors = {
  background: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  borderStrong: string;
  text: string;
  textBody: string;
  textMuted: string;
  brand: string;
  brandText: string;
  accent: string;
  accentText: string;
  warning: string;
  warningText: string;
  danger: string;
  dangerText: string;
  onBrand: string;
};

const dark: Colors = {
  background: '#020617',
  surface: '#0F172A',
  surfaceRaised: '#1E293B',
  border: '#1E293B',
  borderStrong: '#334155',
  text: '#F1F5F9',
  textBody: '#CBD5E1',
  textMuted: '#94A3B8',
  brand: '#10B981',
  brandText: '#34D399',
  accent: '#06B6D4',
  accentText: '#22D3EE',
  warning: '#F59E0B',
  warningText: '#FBBF24',
  danger: '#F43F5E',
  dangerText: '#FB7185',
  onBrand: '#020617',
};

const light: Colors = {
  background: '#EAEFF5',
  surface: '#FFFFFF',
  surfaceRaised: '#F8FAFC',
  border: '#CBD5E1',
  borderStrong: '#94A3B8',
  text: '#020617',
  textBody: '#334155',
  textMuted: '#556070',
  brand: '#047857',
  brandText: '#047857',
  accent: '#0E7490',
  accentText: '#0E7490',
  warning: '#B45309',
  warningText: '#B45309',
  danger: '#E11D48',
  dangerText: '#E11D48',
  onBrand: '#020617',
};

export const colors: Record<ThemeMode, Colors> = { dark, light };

export const space = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radius = {
  chip: 8,
  control: 11,
  card: 16,
  pill: 999,
} as const;

/** Font sizes in the web (rem) baseline, converted at a 16px root. */
export const fontSize = {
  display: 48,
  title: 32,
  heading: 22,
  bodyLarge: 16,
  body: 15,
  label: 13,
  meta: 12,
  eyebrow: 11,
} as const;

export const lineHeight = {
  display: 57.6,
  title: 38.4,
  heading: 28.6,
  bodyLarge: 25.6,
  body: 25.5,
  label: 19.5,
  meta: 18,
  eyebrow: 15.4,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

/**
 * Hit area, not visual size. Pad to reach it.
 * Platform.select where a single app targets both.
 */
export const touch = {
  minimumIOS: 44,
  minimumAndroid: 48,
  gap: 8,
} as const;

export const duration = {
  instant: 100,
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

export const theme = (mode: ThemeMode) => ({
  mode,
  colors: colors[mode],
  space, radius, fontSize, lineHeight, fontWeight, touch, duration,
  isDark: mode === 'dark',
});

export type Theme = ReturnType<typeof theme>;