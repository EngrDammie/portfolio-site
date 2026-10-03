# Android (Jetpack Compose) — brand setup

You are applying the Dammie Optimus Solutions brand to this Android project. Work through this file
in order and finish all of it. Several rules below prevent failures that produce **no error message
at all**, so "it compiles" is not evidence that you followed them.

Read `brand-kit/VERSION` and report both of its values at the end.

## 1. Read these, in this order

1. `brand-kit/shared/BRAND.md` — what the brand is and why. Decisions, not values.
2. `brand-kit/shared/tokens.json` — the exact values, for any number this file does not give you.
3. `brand-kit/PLATFORM-mobile.md` — mobile mechanics, plus the full checklist in its section 12.
4. `brand-kit/android/Brand.kt` — the generated theme. **Never edit this file.**

## 2. Wire it up

### 2.1 Move the theme file

Copy `brand-kit/android/Brand.kt` to:

```
app/src/main/java/<your/package>/brand/Brand.kt
```

Change the `package` declaration at the top to your own package. The generator emits a placeholder.
Change nothing else in the file.

### 2.2 Wrap the tree once, at the root

```kotlin
setContent {
    DammieTheme {
        App()
    }
}
```

Once. At the root. Never wrap individual screens — nested themes are how two different greys end up
in one app.

### 2.3 Leave dark mode following the system

`DammieTheme` already defaults `darkTheme` to `isSystemInDarkTheme()`. Leave it. The brand is
dark-native, which suits phones well, so following the user costs nothing.

## 3. Rules that override anything you would otherwise choose

0. Use the provided `DammieTheme` unchanged. Do **not** use `dynamicLightColorScheme` or
   `dynamicDarkColorScheme`, and do not write your own `MaterialTheme(...)` call. Android 12+ can
   derive an entire palette from the user's wallpaper, which replaces the brand with no error and no
   crash. It looks right on your own device and wrong on everyone else's, because it depends on
   which wallpaper they happen to have. A brand that changes per user is not a brand.
1. Colour comes from `MaterialTheme.colorScheme`, or `Palette` where you need a raw swatch. Never
   a literal hex in a screen.
2. Text comes from `MaterialTheme.typography`. Never a hardcoded `sp`.
3. Never disable font scaling, and never set `TextUnit.Unspecified` to dodge a layout problem.
4. Every interactive element reaches `Dimm.touchTarget` (48dp), with at least `Dimm.touchGap`
   (8dp) between targets. The touch target may be larger than the visual — pad to reach it. Never
   shrink the target to fit.
5. Respect insets. Nothing under the status bar, display cutout or gesture bar.
6. Roboto, not Geist. System font family only; do not bundle a font.
7. Design loading, empty, offline and error states. On a phone these are most of the experience,
   not the polish at the end of it.

## 4. Check every one of these before you report

Run each check. Report every failure with its file and line. Do not claim a pass you have not
verified.

- [ ] `Brand.kt` is in your source set and its `package` line is yours.
- [ ] `DammieTheme {` appears exactly once in the project, at the root.
- [ ] No `dynamicLightColorScheme`, `dynamicDarkColorScheme`, or bare `ColorScheme(` outside
      `Brand.kt`.
- [ ] No `MaterialTheme(` call outside `Brand.kt`.
- [ ] No colour literal (`Color(0x`, or a hex string) in any screen or component file.
- [ ] No hardcoded `sp` in any screen or component file.
- [ ] No font-scaling override and no `TextUnit.Unspecified`.
- [ ] Every clickable element measures at least 48dp — check by measurement or the layout inspector,
      not by eye.
- [ ] Nothing is drawn under the status bar, cutout or gesture bar.
- [ ] Every screen that fetches anything has loading, empty, offline and error states.
- [ ] The project builds. Run the Gradle build and paste the real result.

## 5. Report back

End your reply with exactly this block:

```
Brand:    Dammie Optimus Solutions design kit <version> (<content hash>)
Theme:    app/src/main/java/<your/package>/brand/Brand.kt
Wrapped:  DammieTheme at <file>:<line>
Build:    <pass, or the exact error>
Failures: <list, or "none">
Assumed:  <anything you decided that this file did not tell you>
```

If a check failed, say so plainly. An agent that reports its own failures is useful. One that hides
them costs more time than it saves.
