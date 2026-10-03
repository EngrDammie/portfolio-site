**This project targets Flutter 3.32 or later.** `CardTheme` became `CardThemeData`, and
`ColorScheme.background` was removed. If you hit a compile error on those names, upgrade Flutter
rather than patching the adapter.

## 2. Wire it up

### 2.1 Copy the theme file

Copy Part 5 into your `lib/` beside the code that uses it, so:

```dart
import 'brand.dart';
```

resolves. Leave the file otherwise untouched.

### 2.2 Hand it to `MaterialApp`

```dart
MaterialApp(
  theme:    brandTheme(Brightness.light),
  darkTheme: brandTheme(Brightness.dark),
  // themeMode is left at its default, ThemeMode.system, which is what we want.
)
```

### 2.3 Check it compiles before you build anything on top

The adapter is generated and structurally checked, but it has not been compile-verified. Run:

```bash
dart analyze
```

Do this **first**, before writing a single screen. If it reports errors in `brand.dart`, say so and
stop — that is a kit fault, not yours, and it should not be patched locally.

## 3. Rules that override anything you would otherwise choose

0. Use `brandTheme(Brightness.light)` and `brandTheme(Brightness.dark)` as `theme` and `darkTheme`
   on `MaterialApp`, and leave `themeMode` at its default. Do not write your own `ThemeData(...)`,
   and do **not** reach for `ColorScheme.fromSeed` — it generates a perfectly plausible palette
   that is not this brand, and it will look fine to you and wrong to everyone else.
1. Colour comes from `Theme.of(context).colorScheme`, or from `BrandColors` / `BrandPalette`
   directly. Never a literal `Color(0xFF...)` in a widget.
2. Text comes from `Theme.of(context).textTheme`, with sizes from `BrandText`. Never a hardcoded
   `fontSize`.
3. Never set `textScaleFactor`, never clamp with `TextScaler`, and never disable font scaling.
4. Every interactive element reaches the target in `BrandDim` with at least the gap in `BrandDim`
   between targets — 48dp and 8dp on Android. The target may be larger than the visual — pad to
   reach it. Never shrink the target to fit.
5. Respect insets. Nothing under the status bar, display cutout or gesture bar.
6. System font family only — never bundle Geist or any custom font. `BrandText` supplies the size
   scale; let the platform supply the family, which is Roboto on Android and SF on iOS.
7. Design loading, empty, offline and error states. On a phone these are most of the experience,
   not the polish at the end of it.

## 4. Check every one of these before you report

Run each check. Report every failure with its file and line. Do not claim a pass you have not
verified.

- [ ] `dart analyze` is clean, including on `brand.dart`.
- [ ] `brandTheme(Brightness.light)` and `brandTheme(Brightness.dark)` are both on `MaterialApp`,
      and `themeMode` is not overridden.
- [ ] No `ThemeData(`, `ColorScheme.fromSeed`, or `copyWith(seed:` anywhere in your code.
- [ ] No `Color(0xFF...)` in any widget file.
- [ ] No hardcoded `fontSize` in any widget file.
- [ ] No `textScaleFactor` and no `TextScaler` clamp.
- [ ] Every tappable element measures at least 48dp — measured, not judged by eye.
- [ ] Nothing is drawn under the status bar, cutout or gesture bar.
- [ ] Every screen that fetches anything has loading, empty, offline and error states.
- [ ] The app runs on a real device or emulator, in **both** light and dark.

## 5. Report back

End your reply with exactly this block:

```
Brand:    Dammie Optimus Solutions design kit <version> (<content hash>)
Theme:    lib/brand.dart
Analyze:  <clean, or the exact errors>
Failures: <list, or "none">
Assumed:  <anything you decided that this file did not tell you>
```

If a check failed, say so plainly. An agent that reports its own failures is useful. One that hides
them costs more time than it saves.
