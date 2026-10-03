# React Native / Expo — brand setup

You are applying the Dammie Optimus Solutions brand to this project. Work through this file in order
and finish all of it. Several rules below prevent failures that produce **no error message at all**,
so "it renders" is not evidence that you followed them.

Read `brand-kit/VERSION` and report both of its values at the end.

## 1. Read these, in this order

1. `brand-kit/shared/BRAND.md` — what the brand is and why. Decisions, not values.
2. `brand-kit/shared/tokens.json` — the exact values, for any number this file does not give you.
3. `brand-kit/PLATFORM-mobile.md` — mobile mechanics, plus the full checklist in its section 12.
4. `brand-kit/react-native/tokens.ts` — the generated theme. **Never edit this file.**

## 2. Wire it up

### 2.1 Copy the tokens file

Copy `brand-kit/react-native/tokens.ts` into your source tree and import it. Leave it otherwise
untouched.

### 2.2 Build the theme once, from the colour scheme

```tsx
import { theme } from './tokens';
import { useColorScheme } from 'react-native';

export function useBrand() {
  return theme(useColorScheme() === 'light' ? 'light' : 'dark');
}
```

The returned object is `{ mode, colors, space, radius, fontSize, lineHeight, fontWeight, touch,
duration, isDark }`.

### 2.3 Use it

```tsx
const t = useBrand();

<View style={{ backgroundColor: t.colors.background, padding: t.space.lg }}>
  <Text style={{ color: t.colors.textBody, fontSize: t.fontSize.body }}>…</Text>
</View>
```

Colour keys are `background`, `surface`, `surfaceRaised`, `border`, `borderStrong`, `text`,
`textBody`, `textMuted`, `brand`, `brandText`, `accent`, `accentText`, `warning`, `warningText`,
`danger`, `dangerText`, `onBrand`.

## 3. Rules that override anything you would otherwise choose

0. Resolve the theme from `useColorScheme()` and nothing else. Do not hardcode `'dark'`, and do not
   read a colour from anywhere but the theme object.
1. Colour comes from `t.colors`. Never a literal hex or `rgba()` string in a component.
2. Text comes from `t.fontSize`, `t.lineHeight` and `t.fontWeight`. Never a hardcoded number.
3. **Never set `allowFontScaling={false}` on `Text`.** It defaults to true and works. Setting it
   false is the single most common way this platform breaks accessibility.
4. Every interactive element reaches `t.touch.minimumAndroid` (48) or `t.touch.minimumIOS` (44),
   with at least `t.touch.gap` between targets. Hit areas need `minHeight`, not just padding, to
   reach the minimum.
5. Respect insets. Nothing under the status bar, cutout or gesture bar.
6. System font only. Do not bundle Geist or any custom font.
7. Design loading, empty, offline and error states. On a phone these are most of the experience,
   not the polish at the end of it.
8. Put static styles in `StyleSheet.create`. Inline objects in a large list are a performance
   problem, not a style choice.

## 4. Check every one of these before you report

Run each check. Report every failure with its file and line. Do not claim a pass you have not
verified.

- [ ] `tokens.ts` is in your source tree and is unmodified.
- [ ] The theme is built once from `useColorScheme()` and consumed from there.
- [ ] No `allowFontScaling={false}` anywhere.
- [ ] No colour literal (`#`, `rgb(`, `rgba(`) in any component.
- [ ] No hardcoded font size, line height or spacing number in any component.
- [ ] Every tappable element meets its platform minimum — measured, not judged by eye.
- [ ] Nothing is drawn under the status bar, cutout or gesture bar.
- [ ] Every screen that fetches anything has loading, empty, offline and error states.
- [ ] TypeScript compiles: `tsc --noEmit` is clean.
- [ ] You have run it on a **real device**, in both light and dark.

## 5. Report back

End your reply with exactly this block:

```
Brand:    Dammie Optimus Solutions design kit <version> (<content hash>)
Theme:    <path>/tokens.ts
Types:    <tsc --noEmit result>
Failures: <list, or "none">
Assumed:  <anything you decided that this file did not tell you>
```

If a check failed, say so plainly. An agent that reports its own failures is useful. One that hides
them costs more time than it saves.
