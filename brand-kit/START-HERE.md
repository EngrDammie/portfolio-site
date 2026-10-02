# START HERE — using the Dammie Optimus Solutions design system

This folder is everything you need to make a **new, separate project** look like it came from the
same company as everything else you build.

It works whether that project is a website, a web app, an Android app, or an iOS app.

---

## First, the question you are actually asking

**Is copying these files the wrong approach?**

No. Copying is correct, and it is how every package manager, dependency manager and vendored
library works. When you `npm install` something, you are copying files into your project.

What I got wrong earlier was implying that copying *sources of truth* is safe. It is not. The
distinction that matters:

| | Verdict |
|---|---|
| Copying a **built artefact** — a finished, versioned snapshot | **Correct.** This is vendoring. |
| Copying **sources of truth** and letting four copies drift apart | **This is the trap.** |

So the arrangement is: the brand lives in **one place** (`tokens.json` and `BRAND.md` in the portfolio
repository). This folder is a **finished snapshot** of it, and this `VERSION` file says which one:

```
# Brand kit version 0.1.0
# Built from the portfolio repository at commit 69141f1.
```

**Record that version string in every project's README.** That single line is what makes copying a
snapshot safe, because months later you can answer "which version is this project on?" instead of
guessing.

---

## What is in this folder

```
brand-kit/
├── START-HERE.md          this file
├── VERSION                which snapshot this is
├── shared/
│   ├── BRAND.md           every project. The decisions.
│   └── tokens.json        every project. The values.
├── PLATFORM-mobile.md     Android, iOS, React Native. Not Flutter's adapter.
├── web/
│   ├── DESIGN_SYSTEM.md   the full web spec
│   └── web.css            the generated token layer
├── android/
│   └── Brand.kt           Jetpack Compose theme
├── ios/
│   └── Brand.swift        SwiftUI
└── react-native/
    └── tokens.ts          Expo theme
```

---

## Which files go where

### Website or web app

| Copy | Do not copy |
|---|---|
| `shared/BRAND.md` | `android/` `ios/` `react-native/` |
| `shared/tokens.json` | `PLATFORM-mobile.md` — it is mobile-only |
| `web/DESIGN_SYSTEM.md` | |
| `web/web.css` | |

**Then:** import `web.css` at the top of your global stylesheet and reference `var(--bg)`,
`var(--text-body)`, `var(--radius-card)` and the rest. Use `DESIGN_SYSTEM.md` as the spec and its
checklist as the review.

If your project genuinely cannot take an extra stylesheet, paste the `:root` block out of
`DESIGN_SYSTEM.md` instead. That copy is checked against `tokens.json` in the portfolio repo, so it
cannot silently drift. Do not mix the two conventions inside one component.

**Tailwind:** the token values *are* stock Tailwind colours. No configuration needed. Both styles
are correct; mixing them in one component is not.

### Android app (Jetpack Compose)

| Copy | Do not copy |
|---|---|
| `shared/BRAND.md` | `web/` `ios/` `react-native/` |
| `shared/tokens.json` | |
| `PLATFORM-mobile.md` | |
| `android/Brand.kt` | |

**Then:**
1. Move `Brand.kt` into your source set, e.g.
   `app/src/main/java/com/yourcompany/app/brand/Brand.kt`, and change the `package` line at the top
   to yours. The generator emits a placeholder package.
2. Wrap your tree once, near the root:

   ```kotlin
   setContent {
       DammieTheme {
           App()
       }
   }
   ```

3. Colour comes from `MaterialTheme.colorScheme` or `Palette`. Never a literal in a screen.
4. Text comes from `MaterialTheme.typography`. Never a hardcoded `sp`.
5. `Dimm.touchTarget` is 48dp — pad to reach it, never shrink the target to fit the visual.

### iOS app (SwiftUI)

| Copy | Do not copy |
|---|---|
| `shared/BRAND.md` | `web/` `android/` `react-native/` |
| `shared/tokens.json` | |
| `PLATFORM-mobile.md` | |
| `ios/Brand.swift` | |

**Then:**
1. Add `Brand.swift` to your target.
2. Type comes from `Brand.Role` — `Brand.Role.body`, `Brand.Role.heading`. These are
   `Font.TextStyle` values.
3. Colour comes from `Brand.Colors`, with `Brand.Colors.Light` for the light theme.
4. **Never use `.system(size:)`.** That is the single most common way Dynamic Type gets broken.
   The file deliberately carries no font sizes — that is the design, not an omission.

### React Native / Expo

| Copy | Do not copy |
|---|---|
| `shared/BRAND.md` | `web/` `ios/` `android/` |
| `shared/tokens.json` | |
| `PLATFORM-mobile.md` | |
| `react-native/tokens.ts` | |

**Then:**

```ts
import { theme } from './tokens';
import { useColorScheme } from 'react-native';

const t = theme(useColorScheme() === 'light' ? 'light' : 'dark');
<View style={{ backgroundColor: t.colors.background, padding: t.space.lg }}>
  <Text style={{ color: t.colors.textBody, fontSize: t.fontSize.body }}>…</Text>
```

Two React Native specifics that are easy to get wrong:
- **Do not set `allowFontScaling={false}`** on `Text`. It defaults to true and works.
- **Hit areas need `minHeight`**, not just padding, to reach `t.touch.minimumAndroid` (48).

### Flutter

| Copy | Do not copy |
|---|---|
| `shared/BRAND.md` | `web/` `android/` `ios/` `react-native/` |
| `shared/tokens.json` | |
| `PLATFORM-mobile.md` | |

There is **no Flutter adapter.** That is deliberate: an adapter nobody exercises rots, and it was
skipped until a project needed one.

Until then, `tokens.json` is plain JSON and trivially importable:

```dart
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

final tokens = json.decode(await rootBundle.loadString('assets/tokens.json'));
```

Map the roles the same way the other adapters do. **Do not set `textScaler` to a fixed value.**

---

## What to tell your AI agent

The files alone are not enough. An agent given them without instruction will reasonably invent
things. Paste this after the files are in place.

**Web:**

> Read `BRAND.md` and `DESIGN_SYSTEM.md` before writing any UI. `BRAND.md` decides what;
> `DESIGN_SYSTEM.md` is the web implementation. Use the token layer in `web.css` rather than raw
> values. Work through the checklist at the end of `DESIGN_SYSTEM.md` and tell me which items failed.

**Android:**

> Read `BRAND.md`, `tokens.json` and `PLATFORM-mobile.md` before writing UI, in that order.
> `Brand.kt` is the generated theme and must not be edited.
>
> Rules that override anything you would otherwise choose:
>
> 1. Colour comes from `MaterialTheme.colorScheme` or `Palette`. Never a literal hex in a screen.
> 2. Every text style maps to a Material typography style. Never a hardcoded `sp`.
> 3. Never disable font scaling.
> 4. Every interactive element meets a 48dp touch target, with at least 8dp between targets. The
>    target may be larger than the visual; pad to reach it.
> 5. Respect insets. No content under the status bar, cutout or gesture bar.
> 6. Roboto, not Geist. System font only.
> 7. Design loading, empty, offline and error states. On a phone these are most of the experience.
>
> When you finish, run the checklist in section 12 of `PLATFORM-mobile.md` and tell me which items
> failed.

**iOS:** as Android, substituting SwiftUI for Compose, `Brand.swift` for `Brand.kt`, and
`Brand.Role` for Material typography. Add: *never use `.system(size:)`.*

**React Native:** as Android, substituting `theme('dark' | 'light')` for `MaterialTheme`.

Point 7 is the one that matters most. An agent that reports its own failures is useful; one that
silently skips them is not.

---

## Verify you did it right

Do this before you write a single screen. It takes two minutes and catches a setup that would
otherwise surface as visual drift weeks later.

1. **Version recorded.** Your README names the version from `VERSION`.
2. **Both shared files present.** `BRAND.md` and `tokens.json` are at the project root.
3. **Provenance comments removed** from the copied `.md` files. They are noise once copied.
4. **The "generated" banners left in place** on `web.css`, `Brand.kt`, `Brand.swift`, `tokens.ts`.
   They are there so the next person knows not to edit them.
5. **The adapter is actually wired up**, not just present. Prove it: on web, set a background to
   `var(--bg)` and confirm it changes. On Compose, confirm `DammieTheme` wraps your tree. On SwiftUI,
   confirm `Brand.Role.body` compiles.
6. **One screen renders in both themes.** Switch the system appearance and look at it.

If step 5 or 6 fails, the adapter is not connected and the project will quietly look almost right,
which is worse than looking obviously wrong.

---

## When the brand changes

If `tokens.json` or `BRAND.md` changes in the portfolio repository, an existing project will be out
of date. There is no automatic push, and that is intentional — a design system that can change under
your feet without review is worse than one that lags.

**Upgrading a project:**

1. In the portfolio repo, run `npm run kit:build` and `npm run kit:check`. This rewrites `VERSION`.
2. Copy the changed files across.
3. Read the diff of `BRAND.md` before accepting it. A changed token is mechanical; a changed
   *rule* is not, and may require code changes rather than a file copy.
4. Re-run that project's checklist.
5. Update the version string in the project's README.

The adapters (`web.css`, `Brand.kt`, `Brand.swift`, `tokens.ts`) are safe to copy wholesale —
they are regenerated, never hand-edited, so there is nothing of yours in them to lose.

---

## Two things that are not negotiable

**Reference tokens, never values.** `palette.emerald.500` is raw material. `color.dark.textBody` is
a decision. Components consume decisions. This is what makes a theme switch a token swap instead of
a rewrite.

**If a build disagrees with `BRAND.md`, `BRAND.md` wins.** If it disagrees with the platform guide,
the platform guide wins on mechanics. Where you genuinely think the system is wrong, change it in the
portfolio repository so the next project inherits the improvement.

---

**Where edits go.** If you need a change that applies to every future project, make it in the
portfolio repository — in `tokens.json` or `BRAND.md` — and rebuild the kit. If you make it here, it
applies to this one project and will be overwritten. If it is a project-specific decision, keep it in
the project.

---

*Assembled by `scripts/build-brand-kit.mjs`. Source of truth: the `portfolio` repository,
`main` branch. The version is in `VERSION`.*
