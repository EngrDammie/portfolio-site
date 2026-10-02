# PLATFORM — Mobile (iOS and Android)

How the brand system applies to phones. Read this with [`BRAND.md`](./BRAND.md) (what to decide) and
[`tokens.json`](./tokens.json) (the values).

**This file contains platform-specific mechanics on purpose.** `BRAND.md` has none, which is what
makes it portable. This one is for phones and only phones.

**Every number below was checked against Apple's and Google's current guidance. Where a value may
drift, this file says so rather than implying permanence. Re-check the platform minimums before a
release — they change.**

---

## 0. Your toolchain — and one thing to act on now

You are building Android apps with Google's AI tooling. That is a reasonable choice, and it is
also a temporary one. Read this section before you commit to a workspace.

### Firebase Studio is being sunset

**Firebase Studio — the browser-based cloud development environment, previously Project IDX — stops
accepting new workspaces on 22 March 2027.** Google states the migration paths as Google AI Studio or
Google Antigravity. Existing workspaces are unaffected until then.

This matters for three reasons:

- **A workspace you start late may not be startable at all.** Anything you begin building near that
  date may have nowhere to live.
- **Anything not in Git dies with the workspace.** Firebase Studio can import an existing GitHub
  repository, so the fix is simple and worth doing from day one.
- **You should not encode the brand in workspace settings.** Settings are workspace state. The brand
  must be files in the repository, so that it survives whichever tool comes next.

**That last point is why this system is shaped the way it is.** `tokens.json`, `BRAND.md` and this
file are plain files in Git. They are not a Firebase Studio preference, not an Android Studio theme,
and not anything an AI tool owns. If you switch tool, they work unchanged. If you switch platform,
they work unchanged. Nothing here needs re-entering anywhere.

**Practical instruction: keep every Android project in its own Git repository from the first
commit.** Not for version control niceness — so that a tool sunset is a checkout away rather than a
rewrite.

### The prompt that gets you a correct build

You are working with an AI agent, which means the quality of this system depends on what you tell it.
Paste this at the start of any build, with the file paths corrected to wherever you put them:

> Before writing UI, read `BRAND.md`, `tokens.json` and this file, in that order. `BRAND.md` decides
> what; `tokens.json` holds the values; this file covers the mobile mechanics.
>
> Rules that override anything you would otherwise choose:
>
> 1. Colours come from the `color.dark.*` or `color.light.*` role tokens. Never from
>    `palette.*` and never as a literal hex.
> 2. Every text style maps to a Material typography style. Never a hardcoded `sp`.
> 3. Never disable font scaling.
> 4. Every interactive element meets a 48dp touch target, with at least 8dp between targets. The
>    target may be larger than the visual; pad to reach it.
> 5. Respect insets. No content under the status bar, cutout or gesture bar.
> 6. Roboto, not Geist. System font only.
> 7. Use `MaterialTheme` rather than hand-rolled theming.
> 8. Design loading, empty, offline and error states. On a phone these are most of the experience.
>
> When you finish, run the checklist in section 12 and tell me which items failed.

Point 8 is the one that matters most. An agent that reports its own failures is useful; one that
silently skips them is not.

---

## 1. The three things that break when a web design becomes an app

Every failed port comes down to one of these. Read them before writing any UI.

**1. Hover does not exist.** A web interface that reveals an action on hover leaves phone users with
no way to reach it. Every hover affordance needs a persistent equivalent. This is the single most
common defect.

**2. Text size is the user's decision, not yours.** Both platforms scale text through accessibility
settings, and they do not scale linearly. A layout designed at one size will clip at another. Fixed
heights on text containers are the cause, not the text.

**3. The screen is a thumb, not a cursor.** Primary actions belong low on the screen where a thumb
reaches. A four-column desktop layout is a two-column phone layout, not a scrolling four-column one.

---

## 2. Touch targets

**The hit area is not the visual size.** They are separate decisions and both must be specified. An
icon may render at 24 units while its target is 48, achieved with padding.

| Platform | Minimum target | Notes |
|---|---|---|
| iOS | **44 × 44 pt** | Apple HIG |
| Android | **48 × 48 dp** | Material. Roughly 9 mm, which accommodates the large majority of adult fingertips |
| WCAG 2.2 | 24 × 24 CSS px (AA), 44 × 44 (AAA) | The web floor; mobile platforms are stricter |

Tokens: `touchTarget.minimumIOS`, `touchTarget.minimumAndroid`.

**Space between targets matters as much as the targets.** Material recommends at least 8 dp of gap —
token `touchTarget.spacing`. A finger is roughly 7–10 mm across and obscures what it touches, so
adjacent targets without a gap get tapped wrongly.

**A visible button may be shorter than its target.** Material's own table shows a 48 dp target with a
36 dp button height. Never shrink the target to fit the visual.

**Also true on the web.** A touch-capable browser is a phone. Anything in `DESIGN_SYSTEM.md` that
depends on hover needs a touch equivalent.

---

## 3. Type: map roles to native styles

**Never set a font size in a native app.** Use the platform's semantic style and let it scale. This
is not a preference — it is how the app remains usable for someone who needs 200% text.

### Role mapping

| Our role | iOS (`Font.TextStyle`) | Material 3 | Web baseline |
|---|---|---|---|
| `display` | `largeTitle` | `headlineLarge` | 3 rem |
| `title` | `title` | `headlineMedium` | 2 rem |
| `heading` | `headline` | `titleLarge` | 1.375 rem |
| `bodyLarge` | `body` | `bodyLarge` | 1 rem |
| `body` | `body` | `bodyMedium` | 0.9375 rem |
| `label` | `subheadline` | `labelLarge` | 0.8125 rem |
| `meta` | `footnote` | `bodySmall` | 0.75 rem |
| `eyebrow` | `caption` + uppercase + tracking | `labelSmall` + uppercase + tracking | 0.6875 rem |

Note on `display`: Material's `displayLarge` is 57 sp, which is enormous on a phone. Use
`headlineLarge` (32 sp) for phones and reserve `displayLarge` for tablets. iOS `largeTitle` at 34 pt
is the closer equivalent on a phone.

### The finding that changes how you test

**Text scaling is non-linear, and smaller styles scale harder.** This is the part people miss.

| iOS style | Default | At the largest accessibility size | Reaches 200%? |
|---|---|---|---|
| Large Title | 34 pt | ~76 pt | Yes, ~224% |
| Body | 17 pt | ~53 pt | **Yes, ~312%** |
| Caption | 12 pt | ~38 pt | **Yes, ~317%** |

| Android | Default | At 2.0× font scale | Reaches 200%? |
|---|---|---|---|
| 8 sp | 8 sp | ~17 sp | Yes, ~210% |
| 12 sp | 12 sp | ~21 sp | No, ~175% |
| 16 sp | 16 sp | ~25 sp | No, ~156% |

**What this means in practice:** the roles with the smallest base size grow by the largest factor.
An eyebrow at caption size more than triples. If your layout clips, it will clip on the small
styles first, and it will only happen for users who have deliberately enlarged their text — so it
will never show up in your own testing unless you turn the setting up.

**Test at the largest accessibility size, not the default.** On both platforms, before shipping.

### Letter-spacing does not scale

Tracking is applied as a fixed value in both platforms, so it stays the same absolute width while
the glyphs grow. At large text sizes a fixed tracking value becomes proportionally tighter. For the
`eyebrow` role especially, check it at the largest size and allow for wrapping to two lines rather
than truncating.

### Padding that grows with the text

On iOS, spacing around a text element should scale with it, or the text crowds its container as the
user enlarges it. SwiftUI's scaled-metric helper does this; the equivalent exists on both platforms.
For values that must not scale — a minimum hit area, a fixed toolbar height — use the raw token.

---

## 4. Space and safe areas

**The 4-point spacing scale transfers without conversion.** dp and pt map one-to-one to pixels at
nominal density, so tokens in `space` are usable as-is.

**Respect safe areas on both platforms.** Content must not sit under a notch, a camera cutout, a
home indicator, or the Android gesture bar. Every platform provides a way to inset for this; use it
rather than guessing a fixed padding.

The practical rules:

- Full-screen backgrounds and images may extend edge to edge.
- **Text and interactive controls may not.**
- Bottom-anchored controls clear the home indicator.
- Top-anchored content clears the status bar and any cutout.

**A four-column desktop layout is a two-column phone layout.** Not a scrolling four-column one. Show
fewer things, not smaller ones.

---

## 5. Navigation

Use the platform's own navigation. Users arrive with expectations formed over years of using their
own phone, and an app that fights them feels broken before they read a word.

**Top-level destinations belong in a tab bar.** Never a hamburger menu for a small number of sections
— it hides what the app can do. This applies on iOS as well as Android, and on both platforms the
tab bar should stay visible while moving within a section.

**Stack for hierarchy, sheets for scoped tasks.** Pushing for a drill-down; presenting a sheet for
something self-contained that should be dismissible. A sheet must always be dismissible — by a
visible control and by gesture.

**Put the primary action where the thumb is.** Bottom of the screen, or a clear bottom-anchored
control. Not in a top corner, which is the hardest place to reach one-handed on a large phone.

**Never hide a necessary gesture.** Swipe-to-delete and long-press must have a visible alternative,
or they are unavailable to anyone who cannot perform them.

---

## 6. Motion

**Durations carry over** from `motion.duration` — fast, normal, and a hard ceiling. What does not
carry over is the curve. The easing values in `tokens.json` encode how a pointer device feels and
should not be ported. Use the platform's motion vocabulary: a spring on iOS, the emphasised
decelerate curve on Android.

**Reduced motion is a requirement.** Both platforms expose the user's preference, and roughly one
person in four has it enabled. Every animation needs a still, legible fallback — not a faster
version, a *different* one. An animation that only runs half-speed is still an animation.

**Keep it cheaper on a phone.** Continuous glows and large blurs cost battery on OLED panels and can
drop frames on older hardware. Our signature background gradient is fine as a static treatment; it
should not animate continuously.

---

## 7. States that a website does not have

A phone is offline by default, on unreliable signal, and often mid-task. Every screen needs all of
these designed, not defaulted:

- **Loading** — a skeleton matching the final layout, so nothing jumps when data arrives.
- **Empty** — say what belongs here and how to create the first one. Never a blank screen.
- **Offline** — this is where our offline-first work pays off. Say what still works, not just that
  something failed.
- **Error** — say what happened in plain language and what to do next. Never an error code, and never
  a message that blames the user.
- **Success** — confirm the action happened, briefly.

An app that only ever shows the happy path is not finished.

---

## 8. Forms and the keyboard

The keyboard covers roughly half the screen and it appears without warning. This is where most
mobile forms break.

- **Scroll the focused field into view above the keyboard.** Every time, without exception.
- **Set the correct keyboard type per field.** Email, phone, number. It is a large usability win and
  it is free.
- **Never put a submit button where the keyboard will cover it.**
- **Labels sit above fields, not in them.** Placeholder text disappears exactly when it is needed.
- **Errors appear next to the field that caused them**, not as a summary at the top of the form.
- **Do not validate on every keystroke.** Validate on blur, and on submit.

---

## 9. Dark mode is our default

Our brand is dark-native, which is an unusually good fit for phones: OLED panels, low-light use, and
long reading sessions.

**Both platforms default to following the system appearance**, so a dark-native brand gets the
benefit without doing anything. Do not force a theme.

Follow the system setting to light when the user asks, using the `color.light.*` roles. Our
light-mode accent values are darker steps precisely so they remain legible on white — see
`BRAND.md`.

---

## 10. Worked examples

Each maps `tokens.json` roles onto one platform. These are patterns, not drop-in libraries — the
adapters directory will hold proper ones once a project needs them.

### React Native / Expo

```ts
import { useColorScheme } from 'react-native';
import tokens from '../tokens.json';

export const theme = (() => {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const c = tokens.color[scheme];

  return {
    color: {
      background:   c.background,
      surface:      c.surface,
      surfaceRaised:c.surfaceRaised,
      border:       c.border,
      borderStrong: c.borderStrong,
      text:         c.text,
      textBody:     c.textBody,
      textMuted:    c.textMuted,
      brand:        c.brand,
      brandText:    c.brandText,
      accent:       c.accent,
      accentText:   c.accentText,
      danger:       c.danger,
      dangerText:   c.dangerText,
      onBrand:      c.onBrand,
    },
    // Font sizes come from allowFontScaling on the Text component, which
    // defaults to true. Never set it false to make a layout fit.
    space:  tokens.space,
    radius: tokens.radius,
    // Hit areas: pad to the minimum, and let the touchable be larger than the view.
    touch: {
      minIOS:     tokens.touchTarget.minimumIOS.value,
      minAndroid: tokens.touchTarget.minimumAndroid.value,
      gap:        tokens.touchTarget.spacing.value,
    },
  };
})();
```

```tsx
// A button whose hit area is larger than its visual box. This is the pattern
// that satisfies the touch minimum without making the button look huge.
<Pressable
  style={{
    backgroundColor: theme.color.brand,
    borderRadius: tokens.radius.control.value,
    paddingVertical: tokens.space.sm.value,
    paddingHorizontal: tokens.space.md.value,
    minHeight: Platform.select({
      ios: tokens.touchTarget.minimumIOS.value,
      android: tokens.touchTarget.minimumAndroid.value,
    }),
    // Leave FontScaling alone. Setting allowFontScaling={false} makes the app
    // unusable for someone who needs larger text.
  }}
>
  <Text style={{ color: theme.color.onBrand, fontWeight: '700' }}>
    Submit
  </Text>
</Pressable>
```

### SwiftUI

```swift
import SwiftUI

enum Brand {
    // Colours come from the same roles as every other platform.
    static func background(_ scheme: ColorScheme) -> Color {
        scheme == .dark ? Color(hex: 0x020617) : Color(hex: 0xEAEFF5)
    }

    /// Maps a role to the platform style of the same rank. Never a raw size:
    /// that is what breaks Dynamic Type.
    enum Role {
        static let display: Font.TextStyle = .largeTitle
        static let title: Font.TextStyle = .title
        static let heading: Font.TextStyle = .headline
        static let bodyLarge: Font.TextStyle = .body
        static let body: Font.TextStyle = .body
        static let label: Font.TextStyle = .subheadline
        static let meta: Font.TextStyle = .footnote
        static let eyebrow: Font.TextStyle = .caption
    }
}

struct PrimaryButton: View {
    var body: some View {
        Text("Submit")
            .font(.system(.subheadline, design: .default, weight: .bold))
            .padding(.horizontal, 16)
            // The target is the minimum; the visual can be smaller.
            .frame(minHeight: 44)
            .background(Brand.background(.dark))
    }
}
```

```swift
// Padding that grows with the user's text size, so the text does not crowd
// its container as they enlarge it.
@ScaledMetric(relativeTo: .body) private var pad: CGFloat = 16
```

### Jetpack Compose — your primary path

This is the one to copy. It maps every token onto `MaterialTheme`, so the whole app inherits the
brand from one place and individual screens never hardcode a colour or a size.

```kotlin
// Brand.kt — generated by hand from tokens.json. Do not put values in
// screens. If you need a new one, add it here and to tokens.json.
package com.dammieoptimus.brand

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp

// Raw palette. Never referenced by a screen.
internal object Palette {
    val Emerald500 = Color(0xFF10B981)
    val Emerald400 = Color(0xFF34D399)
    val Cyan500    = Color(0xFF06B6D4)
    val Cyan400    = Color(0xFF22D3EE)
    val Amber500   = Color(0xFFF59E0B)
    val Amber400   = Color(0xFFFBBF24)
    val Rose500    = Color(0xFFF43F5E)
    val Rose400    = Color(0xFFFB7185)
    val Slate950   = Color(0xFF020617)
    val Slate900   = Color(0xFF0F172A)
    val Slate800   = Color(0xFF1E293B)
    val Slate700   = Color(0xFF334155)
    val Slate500   = Color(0xFF64748B)
    val Slate400   = Color(0xFF94A3B8)
    val Slate300   = Color(0xFFCBD5E1)
    val Slate100   = Color(0xFFF1F5F9)
    val Slate50    = Color(0xFFF8FAFC)
    val Paper      = Color(0xFFEAEFF5)
}

// Roles. Screens use these, via MaterialTheme.
private val DarkColors = darkColorScheme(
    primary            = Palette.Emerald500,
    onPrimary          = Palette.Slate950,   // dark text on the brand fill
    primaryContainer   = Palette.Emerald500.copy(alpha = 0.12f),
    onPrimaryContainer = Palette.Emerald400,
    secondary          = Palette.Cyan500,
    onSecondary        = Palette.Slate950,
    onSecondaryContainer = Palette.Cyan400,
    background         = Palette.Slate950,
    onBackground       = Palette.Slate100,
    surface            = Palette.Slate900,
    onSurface          = Palette.Slate100,
    surfaceVariant     = Palette.Slate800,
    onSurfaceVariant   = Palette.Slate400,
    surfaceContainer   = Palette.Slate900,
    surfaceContainerHigh = Palette.Slate800,
    outline            = Palette.Slate800,
    outlineVariant     = Palette.Slate700,
    error              = Palette.Rose500,
    onError            = Palette.Slate950,
    errorContainer     = Palette.Rose500.copy(alpha = 0.12f),
    onErrorContainer   = Palette.Rose400,
)

// Light takes a DARKER accent step. Reusing the dark values here is the
// single most common way this brand is broken on a light background.
private val LightColors = lightColorScheme(
    primary            = Color(0xFF047857),
    onPrimary          = Palette.Slate950,
    secondary          = Color(0xFF0E7490),
    onSecondary        = Palette.Slate950,
    background         = Palette.Paper,
    onBackground       = Palette.Slate950,
    surface            = Color.White,
    onSurface          = Palette.Slate950,
    surfaceVariant     = Palette.Slate50,
    onSurfaceVariant   = Color(0xFF556070),
    outline            = Palette.Slate300,
    outlineVariant     = Palette.Slate400,
    error              = Color(0xFFE11D48),
    onError            = Palette.Slate950,
)

// Four radii, no invention between them.
private val BrandShapes = Shapes(
    extraSmall = RoundedCornerShape(8.dp),
    small      = RoundedCornerShape(8.dp),
    medium     = RoundedCornerShape(11.dp),
    large      = RoundedCornerShape(16.dp),
    extraLarge = RoundedCornerShape(16.dp),
)

// Roles, mapped to Material typography. Line heights are generous by
// design — that is the brand, not an oversight. letterSpacing is in em so
// it stays proportional if the type scale changes.
private val BrandTypography = Typography(
    displayLarge  = TextStyle(fontSize = 32.sp, lineHeight = 38.sp,
                              fontWeight = FontWeight.W800, letterSpacing = (-0.02).em),
    headlineMedium= TextStyle(fontSize = 22.sp, lineHeight = 28.sp,
                              fontWeight = FontWeight.W700, letterSpacing = (-0.02).em),
    headlineSmall = TextStyle(fontSize = 18.sp, lineHeight = 24.sp, fontWeight = FontWeight.W700),
    titleLarge    = TextStyle(fontSize = 18.sp, lineHeight = 24.sp, fontWeight = FontWeight.W700),
    titleMedium   = TextStyle(fontSize = 16.sp, lineHeight = 24.sp, fontWeight = FontWeight.W600),
    bodyLarge     = TextStyle(fontSize = 16.sp, lineHeight = 24.sp),
    bodyMedium    = TextStyle(fontSize = 14.sp, lineHeight = 22.sp),
    bodySmall     = TextStyle(fontSize = 12.sp, lineHeight = 18.sp),
    labelLarge    = TextStyle(fontSize = 14.sp, lineHeight = 20.sp, fontWeight = FontWeight.W600),
    labelMedium   = TextStyle(fontSize = 12.sp, lineHeight = 16.sp, fontWeight = FontWeight.W600),
    labelSmall    = TextStyle(fontSize = 11.sp, lineHeight = 16.sp,
                              fontWeight = FontWeight.W800, letterSpacing = 0.13.em),
)

@Composable
fun DammieTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),  // follow the system; never force
    content: @Composable () -> Unit,
) = MaterialTheme(
    colorScheme = if (darkTheme) DarkColors else LightColors,
    shapes = BrandShapes,
    typography = BrandTypography,
    content = content,
)
```

Apply it once, at the top of the tree:

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()   // then respect insets; do not ignore them
        setContent {
            DammieTheme {
                App()
            }
        }
    }
}
```

A button that meets the touch minimum without looking oversized:

```kotlin
@Composable
fun PrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Button(
        onClick = onClick,
        shape = MaterialTheme.shapes.medium,
        colors = ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.primary,
            contentColor   = MaterialTheme.colorScheme.onPrimary,  // dark, always
        ),
        modifier = modifier
            // The target is the platform minimum even when the button looks shorter.
            .heightIn(min = 48.dp)
            .padding(horizontal = 4.dp),   // visual padding, target stays 48dp
    ) {
        Text(text, style = MaterialTheme.typography.labelLarge)
    }
}
```

Respecting insets, since `enableEdgeToEdge()` means the system draws behind them:

```kotlin
@Composable
fun Screen(content: @Composable () -> Unit) {
    Scaffold { padding ->
        Box(
            Modifier
                .fillMaxSize()
                // Scaffold's padding already carries the system bar insets.
                .padding(padding)
        ) { content() }
    }
}
```

**A note on Compose versions.** The Material3 type and colour APIs above are stable. Google has been
adding a Styles API for unified component styling, and Compose BOM releases monthly — the current BOM
at the time of writing is `2026.08.00`. Check the release notes before upgrading the BOM, because the
theme surface is the part most likely to move.

---

### Flutter

```dart
abstract final class Brand {
  static const background = Color(0xFF020617);
  static const textBody    = Color(0xFFCBD5E1);
  static const brand      = Color(0xFF10B981);
  static const onBrand    = Color(0xFF020617);

  static const radiusControl = 11.0;
  static const minTargetIOS  = 44.0;
  static const minTargetAndroid = 48.0;
  static const targetGap = 8.0;
}

// Roles map to the platform text theme, and textScaler is left alone.
// Setting textScaler to a fixed value makes the app unusable for someone
// who needs larger text.
ThemeData buildTheme(Brightness brightness) => ThemeData(
  colorScheme: brightness == Brightness.dark
      ? const ColorScheme.dark(primary: Brand.brand, onPrimary: Brand.onBrand)
      : const ColorScheme.light(),
  textTheme: const TextTheme(
    displayLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.w800),
    titleLarge:   TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
    bodyLarge:    TextStyle(fontSize: 16, height: 1.5),
    bodyMedium:   TextStyle(fontSize: 14, height: 1.5),
    labelSmall:   TextStyle(fontSize: 11, letterSpacing: 1.4),
  ),
);
```

---

## 11. What not to do

- **Do not replace native components with custom ones to match the brand.** A restyled back gesture,
  a custom alert, a hand-built switch — all fight the platform, break expectations, and cost you
  accessibility. Let the brand show through colour, type, spacing, and a few signature components.
- **Do not disable font scaling.** There is no layout problem that `allowFontScaling={false}`,
  `textScaler`, or a hardcoded `sp` solves that reflowing does not.
- **Do not ship Geist.** Use the system typeface. The brand is recognised by colour, spacing and
  structure, not by the typeface, and users notice when an app fights their phone.
- **Do not use the gradient on every surface.** At most two gradient elements per screen, and far
  more sparingly than on the web, because it costs battery on OLED and legibility in sunlight.
- **Do not rely on hover, long-press, or swipe as the only route to anything.**
- **Do not put content under the notch or the home indicator.**
- **Do not ignore the loading, empty, offline and error states.** They are not edge cases; on a
  phone they are most of the experience.

---

## 12. Checklist

Run before any release. Report failures rather than skipping them.

**Touch**

- [ ] Every interactive element meets the platform minimum hit area
- [ ] Adjacent targets have at least 8 dp of space between them
- [ ] Every gesture has a visible alternative
- [ ] Primary actions are reachable by a thumb
- [ ] Hit areas are separated from visual sizes in the code, not assumed equal

**Type**

- [ ] No hardcoded font sizes — every role maps to a native semantic style
- [ ] Tested at the largest accessibility text size on both platforms
- [ ] No text clipped or truncated at that size
- [ ] Font scaling is enabled everywhere
- [ ] Padding around text scales with it
- [ ] Letter-spacing checked at large text sizes

**Layout**

- [ ] Safe areas respected; no content under a notch, cutout or home indicator
- [ ] Keyboard never covers the focused field or the submit control
- [ ] Column count reduced rather than shrunk
- [ ] Loading, empty, offline and error states all designed

**Brand**

- [ ] Colours come from `color.dark.*` / `color.light.*` roles
- [ ] At most two gradient elements per screen
- [ ] Radius, spacing and durations from the token set
- [ ] System typeface, not Geist
- [ ] Platform navigation and components used as intended

**Accessibility**

- [ ] Text contrast meets AA against every surface it appears on, in both themes
- [ ] No state carried by colour alone
- [ ] VoiceOver and TalkBack labels present on every control
- [ ] Reduced motion honoured, every animation has a still fallback
- [ ] Focus order is logical

---

*Decisions: [`BRAND.md`](./BRAND.md). Values: [`tokens.json`](./tokens.json). Web:
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).*

*Platform minimums and API names in this file were verified against Apple and Google guidance on
30 September 2026. Re-check them before a release: they change.*
