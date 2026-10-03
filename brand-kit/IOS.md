# Dammie Optimus Solutions — iOS — SwiftUI

---

**This is the whole brand kit for this platform.** It is self-contained: everything an agent needs to build and style a correct app is in this one file. There is nothing else to download, copy or read.

Follow Part 1 to the letter. Several of its rules prevent failures that produce no error message at all, so a successful build is not evidence that you followed them.

---

```
# kit version 0.2.0
# content      bafdc310a4fd
```

Record that content hash in the project README. It changes whenever the colours, the spacing or these instructions change, so it will tell you months later whether the kit you copied is still the kit you have.

---

## Part 1 — Set the project up

### 1. Wire it up

#### 2.1 Add the theme to your target

Add Part 5 to the app target in Xcode. Nothing else is required — the file
carries no fonts and no assets, so there is nothing to register.

#### 2.2 Read values from the theme, not from constants you invent

```swift
Text("Hello")
    .font(Brand.Role.body)
    .foregroundStyle(Brand.Colors.textBody)
```

`Brand.Role` members are `Font.TextStyle` values, so Dynamic Type keeps working. `Brand.Colors`
holds the palette, and `Brand.Colors.Light` is the light-theme set.

#### 2.3 Support both appearances

The brand is dark-native, but iOS users expect both. Resolve against the environment rather than
hardcoding, and confirm both look right before you report.

### 2. Rules that override anything you would otherwise choose

0. **Never use `.system(size:)`.** That is the single most common way Dynamic Type gets broken, and
   it is the reason `Brand.swift` carries no font sizes at all — that absence is the design, not an
   oversight. Use `Brand.Role`, or another `Font.TextStyle`, so the size can scale.
1. Colour comes from `Brand.Colors` (or `Brand.Palette` for a raw swatch). Never a literal hex in a
   view.
2. Never pin a fixed frame height on text. Let it grow with Dynamic Type, and test at the largest
   accessibility size.
3. Never disable Dynamic Type, and never clamp with `.dynamicTypeSize(...)` to stop a layout
   breaking. Fix the layout instead.
4. Every interactive element reaches a 44x44pt touch target, with at least 8pt between targets. The
   target may be larger than the visual — pad to reach it. Never shrink the target to fit.
5. Respect safe areas. No content under the notch, home indicator or status bar.
6. System font only — San Francisco. Do not bundle Geist or any custom font.
7. Design loading, empty, offline and error states. On a phone these are most of the experience,
   not the polish at the end of it.

### 3. Check every one of these before you report

Run each check. Report every failure with its file and line. Do not claim a pass you have not
verified.

- [ ] `Brand.swift` is in the target and compiles.
- [ ] No `.system(size:` anywhere in your code.
- [ ] No `Color(hex:` or raw hex literal in any view.
- [ ] No `.dynamicTypeSize(` clamp and no fixed frame height on text.
- [ ] Every tappable element measures at least 44x44pt.
- [ ] Nothing is drawn under the notch or home indicator.
- [ ] Every screen that fetches anything has loading, empty, offline and error states.
- [ ] You have run or previewed the app at the **largest** accessibility text size and nothing is
      clipped or overlapping.
- [ ] You have checked both light and dark appearance.
- [ ] The project builds. Paste the real result.



---

## Part 2 — The brand

Why the brand is the way it is. Read this before making a judgement call the rules above do not cover.

The platform-agnostic half of our design system. This file contains only decisions that hold on a
website, in a web app, in an Android app, in an iOS app, and in anything we build next year.

**No syntax belongs in this file.** If it would only make sense in CSS, it belongs in the web
platform guide instead. That separation is the entire point — see Part 12.

Values live in Part 3, in the W3C Design Tokens format. This file explains
what the values *mean* and when to reach for which one. It does not repeat them, because a document
that duplicates numbers is a document that will be wrong.

---

### How to use this

**You are an LLM asked to build or restyle something for this company.** Work in this order:

1. Read this file. It tells you what to decide.
2. Read Part 3. It tells you the values.
3. Read the platform guide for your target (Part 12). It tells you how to express them.
4. Work through the checklist at the end. Report what failed rather than quietly skipping it.

**Two rules override everything else in this file:**

- **Never reference a raw palette value in a component.** Use a semantic role. `palette.emerald.500`
  is a raw material; `color.dark.brandText` is a decision. Components consume decisions.
- **Never invent a value.** Not a radius, not a spacing step, not a duration. Pick the nearest one
  that exists. If nothing fits, the answer is a new token in Part 3, not a one-off number.

---

### 1. Who we are

Dammie Optimus Solutions is a software engineering business. We build AI automations, web
applications, and mobile applications for businesses whose work is still running through
spreadsheets and manual effort.

We are one engineer, not an agency. That is not a limitation to apologise for in the product — it is
the reason a client talks to the person doing the work. Our positioning depends on being direct,
specific, and free of the vocabulary that agencies use to obscure rather than clarify.

**What we consistently refuse:** lock-in, licence bloat, surprise invoices, and work we cannot hand
over cleanly. Those refusals are brand decisions. They shape how the product is built, not just how
it is described.

---

### 2. The three ideas

Everything below is a consequence of these. If a design decision cannot be justified by one of them,
it is probably decoration.

**Dark-native, not dark-themed.** Most brand systems are light-first because print and marketing
needed them to be. Ours is the other way round: the default surface is near-black with a blue
undertone, and light mode is the adaptation. This is unusually well suited to phones — OLED panels,
low-light use, and long reading sessions.

**One gradient, used sparingly.** A single green-to-cyan ramp appears on primary actions and active
states. At most two gradient elements per screen. Beyond that it stops signalling and starts
decorating, and the eye stops landing on the thing you wanted it to land on.

**Density with air.** Compact controls inside generous padding. Text is small but leading is
generous, so a screen feels precise rather than cramped. This is the detail most often lost when
someone copies our colours and invents their own spacing.

---

### 3. Colour

#### Roles, not colours

Every colour a component may use has a **role** that describes its job. There are three tiers, and
you reference the middle one:

| Tier | Example | Who may use it |
|---|---|---|
| Palette | `palette.emerald.500` | Nobody, in a component |
| Role | `color.dark.brandText` | Components |
| Apply | a button's pressed state | The component |

The tier that exists is `color.dark.*` and `color.light.*`. Both themes use **identical role names**
with different values. That is what makes a theme switch a token swap rather than a rewrite, and it
is why a component never needs to know which theme is active.

#### The fill-versus-text distinction

Our brand colours come in pairs, and the distinction is not cosmetic:

- **`brand` / `accent`** — the saturated value. For **fills, borders and glows only.**
- **`brandText` / `accentText`** — the lighter step. For **text only.**

Putting text in `brand` is the single most common way a build of ours ends up failing contrast.
`palette.emerald.500` on a near-black surface is legible; on a white one it measures about 2.5:1 and
fails accessibility standards outright. The `-Text` variants exist to make the wrong choice hard to
reach for.

#### Light mode takes a darker step

This is counter-intuitive and people get it wrong. The light-mode accent is **darker**, not lighter
than the dark-mode one. The dark-mode values are tuned for a near-black background; the same values
on white are too pale to read.

Light mode also makes **borders stronger**, not weaker. A dark border that reads as a crisp edge on
near-black disappears entirely on white.

#### Text has three weights of emphasis, not two

- `text` — headings and emphasis. Too bright for body copy over a long read.
- `textBody` — the default reading colour. This is what paragraphs use.
- `textMuted` — labels, captions, timestamps, table headers. **Not for paragraphs.**

#### Colour is never the only signal

Every state carried by colour is also carried by a word, an icon, a border, or a shape. This is an
accessibility requirement, not a style preference, and it applies identically on every platform.

---

### 4. Typography

#### Roles, not sizes

Typography is defined as **roles** — `display`, `title`, `heading`, `bodyLarge`, `body`, `label`,
`meta`, `eyebrow`. Components use a role. They never set a size.

This matters more on mobile than anywhere else. Native platforms scale text according to the user's
own accessibility settings — iOS Dynamic Type reaches roughly 200%, and Android has its own font
scale. An app that pins pixel sizes fights the user and, eventually, clips. An app that uses
semantic styles at the right rank scales properly for free.

**The mapping rule:** each role corresponds to the platform's own semantic style of the same rank.
Display maps to a large title style. Body maps to the body style. The *rank* is ours; the *number* is
the platform's.

#### The typeface changes; the roles do not

We use Geist on the web because we load it. **We do not ship Geist in a native app.** iOS users
expect the system face, Android users expect Roboto, and shipping a bundled face over the top is a
familiarity tax the user pays for our aesthetic preference.

Part 3 carries both: a web family and a native system stack. Use the right one.

#### The details that make it look right

- **Generous line height is the signature.** Small text needs a lot of leading. Our body role sits
  around 1.7. Tight leading on small text is the most common reason an interface ends up looking
  cheap, and it is a one-line fix.
- **Headings take negative tracking, body copy takes none.** Large text needs its letters pulled
  together; small text already is. Adding tracking to body copy is a mistake.
- **Uppercase micro-text needs a lot of positive tracking.** Around `0.13em` is the minimum for
  legibility at the sizes we use for eyebrows and labels. Without it, uppercase reads as shouting
  and is genuinely hard to parse.
- **Cap paragraph width.** Around 70 characters. Full-width paragraphs are tiring to track.
- **Monospace is reserved** for anything machine-generated: code, hashes, identifiers, file paths,
  timestamps inside technical labels. Never for body copy.

---

### 5. Space, radius, elevation

**Spacing is a 4-point base scale**, from 2 to 64. The values transfer to Android and iOS without
conversion: dp and pt map one-to-one to pixels at nominal density. Pick the nearest step; never
reach for a number that is not on the scale.

**Radius has exactly four values** — chip, control, card, pill. The progression is deliberate:
containers are generously rounded, controls slightly less, chips least, pills fully round. A radius
invented between two of these will read as an accident.

**Elevation comes from surface lightness first and shadow second.** A raised surface usually needs
no shadow at all. Shadows are for elements that genuinely float above the page — cards, modals,
menus — and never for every bordered box.

**Glow shadows are for accent elements only.** A glow on a neutral element reads as an error state,
because that is where users have learned to expect one.

---

### 6. Touch and pointer

This is the first place where the platforms genuinely diverge, and the rule is that **the brand
adapts; it does not weaken.**

**Hover exists on the web and nowhere else.** If a web interface reveals an action on hover, a phone
user cannot reach that action at all. Every hover affordance therefore needs a persistent
equivalent — visible on touch, or reachable another way. This is not a mobile-only concern: it is a
requirement for any build that has to work on both.

**Hit areas are not the same as visual size.** An icon may render at 24 units while its target is
48, achieved with padding around it. The visual and the hit area are separate decisions, and
`touchTarget.minimumIOS` and `touchTarget.minimumAndroid` exist to make the second one explicit.

**Space between targets matters as much as the targets themselves.** A finger is roughly 7–10mm
across and obscures what it covers. Adjacent targets need a gap, or they get tapped wrongly.

**On mobile, show less.** The same spacing scale, but far fewer items per screen. A four-column
desktop layout is a two-column phone layout, not a scrolling four-column one.

---

### 7. Motion

Motion in this system is short, subtle, and exists to explain a change. It never performs.

**Durations are a brand decision and they travel:** instant for micro-feedback, fast as the default
for any state change, normal for something entering or leaving, and a hard ceiling beyond which
interaction feels sluggish.

**Curves are not portable.** The easing curves we use on the web encode how a pointer device feels.
Copying those four numbers into a native animation produces something subtly wrong that is hard to
name. Use each platform's own motion vocabulary — the system's own spring or emphasised curve.

**State changes get a gentle brightness shift and a slight scale-down on press.** Not a colour
swap. Not a bounce.

**Reduced motion is a requirement, not a preference.** Roughly one user in four has it enabled, and
unsolicited fast movement is genuinely unpleasant rather than merely unwelcome. On the web that
means honouring the user's system setting. Natively, it means the equivalent. Any animation we ship
must have a still, legible fallback.

---

### 8. The logo

**Three approved lockups**, and nothing else:

1. **Full lockup** — monogram, wordmark, and the `SOFTWARE ENGINEERING` descriptor.
2. **Wordmark** — name and descriptor, no monogram.
3. **Monogram alone** — only at sizes where the wordmark would be illegible, and never on a surface
   where the brand is unknown to the viewer.

**Rules that are not negotiable:**

- **Never redraw, re-letter, or reconstruct the monogram.** It is used as authored. If a new size or
  colour is needed, that is a request, not a workaround.
- **Never recolour it arbitrarily.** It is the gradient, or it is reversed on a light surface. It is
  never amber, never rose, never a flat single colour.
- **Never place it on a busy or low-contrast area.** It needs clear space around it.
- **Never use the monogram alone as the primary brand mark** for an audience that does not already
  know us. The mark is unrecognisable cold; the wordmark is not.
- **Never stretch or rotate it.** Aspect ratio is fixed.

---

### 9. Voice

Our product should sound like us, and so should everything around it.

**Plain.** Short sentences. Familiar words. If a client cannot understand a sentence on first read, it
is too long or too abstract. We do not say "digital transformation", we say "the spreadsheet that
runs your business".

**Specific over impressive.** A number beats an adjective. "Removes about six hours a week" is
persuasive; "streamlines your workflow" is noise.

**Confident, not boastful.** State what we do and what it costs. No superlatives, no "leading",
no "cutting-edge", no "passionate about".

**Honest about limits — always.** We say when a project is not worth doing, when a deadline is
unrealistic, and when a cheaper option is better. This is a brand decision, not just honesty: it is
the thing that makes the rest of the claims credible.

**No fear-based framing.** We do not describe the client's current situation as a crisis in order to
create urgency.

**Second person, present tense.** "You own the code." Not "the code is owned by the client".

**British English.** "Colour", "behaviour", "organise". This is the house style, and it is not
negotiable.

---

### 10. The accessibility floor

These are not preferences and they do not vary by platform. Every product we ship meets all of them.

- **Text contrast meets AA** for its size, against every surface it appears on. Both themes are
  already checked; do not introduce a colour that has not been.
- **Colour is never the only carrier of meaning.** Every state conveyed by colour is also conveyed
  by a word, icon, border or shape.
- **Text scales with the user's settings.** No fixed-height text containers, no pinned sizes in
  native apps.
- **Reduced motion is honoured**, and every animation has a still fallback.
- **Every interactive element is large enough to hit** with the platform minimum, with space around
  it.
- **Focus is visible** on every interactive element, for keyboard and switch users.
- **Nothing is conveyed by a flash.** No rapid blinking.
- **Every image has a text alternative**, and decorative images are marked as such.

---

### 11. Do and do not

**Do**

- Reach for the nearest existing value rather than a close-enough one.
- Use a role token, so the component survives a theme change and a future palette revision.
- Pair every state colour with a non-colour signal.
- Keep the gradient to primary actions and active states.
- Give body copy generous leading and a capped width.
- Say the awkward thing plainly in the interface copy — an error message that admits a problem is
  better than one that says "something went wrong".

**Do not**

- Put text in a fill colour instead of its `-Text` counterpart.
- Use light-mode accent values in dark mode, or the reverse.
- Invent a radius, spacing step, or duration.
- Make an action reachable only on hover.
- Ship a bundled typeface in a native app.
- Use the gradient as decoration, or more than twice on one screen.
- Put a glow on a neutral element.
- Depend on colour alone to say whether something succeeded.
- Write error messages that blame the user or expose internal jargon.

---

### 12. Platform map

This file decides *what*. The platform guide decides *how*. Read both.

| You are building | Read | Express tokens as |
|---|---|---|
| A website or web app | Part 4 + this file | CSS custom properties; Tailwind theme |
| A React Native / Expo app | Part 4 + this file | A typed object |
| A native iOS app | Part 4 + this file | Swift |
| A native Android app | Part 4 + this file | Kotlin |
| A Flutter app | Part 4 + this file | Dart |
| A document, guide, or report | Part 4 + this file | CSS, plus the document layout shell |

**Status of the platform guides:**

| File | State |
|---|---|
| Part 3 | Complete — 130 tokens, DTCG 2025.10 |
| Part 2 (this file) | Complete |
| Part 4 | Complete — covers web and documents |
| Part 4 | Complete — iOS and Android, with Jetpack Compose as the primary worked path |
| `scripts/check-tokens.mjs` | Complete — run `npm run tokens:check` |

**Platform adapters exist and are generated.** Part 5 holds a token layer per platform, all
produced from Part 3 by `npm run tokens:build`:

| Adapter | For |
|---|---|
| Part 5 (`Brand.swift`) | SwiftUI |

They are **generated files. Editing one by hand is a mistake**, because `npm run adapters:check`
compares them against Part 3 and fails when they disagree. To change a value, change
Part 3 and rebuild.

Part 4 and `docs.css` still restate values by hand — they must, since both are
self-contained artefacts — so `npm run tokens:check` compares them and fails on drift.

Flutter was originally left out because no project needed it yet. It now exists, built against
Flutter 3.32 or later. Check that version before adopting it: the Material theming API has had
breaking changes recently.

---

### 13. Verification checklist

Run through this before calling any screen finished. Report anything that fails.

**Brand**

- [ ] Every colour comes from a role token, not a palette value
- [ ] No text sits on a fill colour instead of its `-Text` counterpart
- [ ] At most two gradient elements on the screen
- [ ] Radius, spacing, and durations all come from the token set
- [ ] The typeface is Geist on web, the system stack on native
- [ ] Body copy has generous leading and a capped width
- [ ] Uppercase micro-text is letter-spaced
- [ ] Monospace is used only for machine-generated content

**Platform**

- [ ] Every interactive element meets the platform minimum hit area
- [ ] Adjacent targets have space between them
- [ ] No action is reachable only by hover
- [ ] Text scales with the user's system settings without clipping
- [ ] Safe areas are respected on native
- [ ] Native components are used as the platform intends, not replaced wholesale

**Accessibility**

- [ ] All text meets AA contrast against every surface it appears on, in both themes
- [ ] No state is carried by colour alone
- [ ] Reduced motion is honoured and every animation has a still fallback
- [ ] Focus is visible on every interactive element
- [ ] Images have text alternatives

---

*Values: Part 3. Web specifics: Part 4.
If a build disagrees with this file, this file wins.*

---

## Part 3 — Every value

The exact, canonical numbers. Reach for these rather than choosing your own. References in `{braces}` point at other rows in this table.

| Token | Value |
|---|---|
| `palette.slate.50` | `#F8FAFC` |
| `palette.slate.100` | `#F1F5F9` |
| `palette.slate.300` | `#CBD5E1` |
| `palette.slate.400` | `#94A3B8` |
| `palette.slate.600` | `#475569` |
| `palette.slate.700` | `#334155` |
| `palette.slate.800` | `#1E293B` |
| `palette.slate.900` | `#0F172A` |
| `palette.slate.950` | `#020617` |
| `palette.emerald.400` | `#34D399` |
| `palette.emerald.500` | `#10B981` |
| `palette.emerald.700` | `#047857` |
| `palette.cyan.400` | `#22D3EE` |
| `palette.cyan.500` | `#06B6D4` |
| `palette.cyan.700` | `#0E7490` |
| `palette.amber.400` | `#FBBF24` |
| `palette.amber.500` | `#F59E0B` |
| `palette.amber.700` | `#B45309` |
| `palette.rose.400` | `#FB7185` |
| `palette.rose.500` | `#F43F5E` |
| `palette.rose.700` | `#E11D48` |
| `color.dark.background` | `"{palette.slate.950}"` |
| `color.dark.surface` | `"{palette.slate.900}"` |
| `color.dark.surfaceRaised` | `"{palette.slate.800}"` |
| `color.dark.border` | `"{palette.slate.800}"` |
| `color.dark.borderStrong` | `"{palette.slate.700}"` |
| `color.dark.text` | `"{palette.slate.100}"` |
| `color.dark.textBody` | `"{palette.slate.300}"` |
| `color.dark.textMuted` | `"{palette.slate.400}"` |
| `color.dark.brand` | `"{palette.emerald.500}"` |
| `color.dark.brandText` | `"{palette.emerald.400}"` |
| `color.dark.accent` | `"{palette.cyan.500}"` |
| `color.dark.accentText` | `"{palette.cyan.400}"` |
| `color.dark.warning` | `"{palette.amber.500}"` |
| `color.dark.warningText` | `"{palette.amber.400}"` |
| `color.dark.danger` | `"{palette.rose.500}"` |
| `color.dark.dangerText` | `"{palette.rose.400}"` |
| `color.dark.onBrand` | `"{palette.slate.950}"` |
| `color.light.background` | `#EAEFF5` |
| `color.light.surface` | `#FFFFFF` |
| `color.light.surfaceRaised` | `"{palette.slate.50}"` |
| `color.light.border` | `"{palette.slate.300}"` |
| `color.light.borderStrong` | `"{palette.slate.400}"` |
| `color.light.text` | `"{palette.slate.950}"` |
| `color.light.textBody` | `"{palette.slate.700}"` |
| `color.light.textMuted` | `#556070` |
| `color.light.brand` | `"{palette.emerald.700}"` |
| `color.light.brandText` | `"{palette.emerald.700}"` |
| `color.light.accent` | `"{palette.cyan.700}"` |
| `color.light.accentText` | `"{palette.cyan.700}"` |
| `color.light.warning` | `"{palette.amber.700}"` |
| `color.light.warningText` | `"{palette.amber.700}"` |
| `color.light.danger` | `"{palette.rose.700}"` |
| `color.light.dangerText` | `"{palette.rose.700}"` |
| `color.light.onBrand` | `"{palette.slate.950}"` |
| `gradient.brand` | `[{"color":"{palette.emerald.500}","position":0},{"color":"{palette.cyan.500}","position":1}]` |
| `typography.family.web` | `["Geist","system-ui","sans-serif"]` |
| `typography.family.native` | `["-apple-system","Roboto","system-ui","sans-serif"]` |
| `typography.family.mono` | `["Geist Mono","ui-monospace","Menlo","Consolas","monospace"]` |
| `typography.weight.regular` | `400` |
| `typography.weight.medium` | `500` |
| `typography.weight.semibold` | `600` |
| `typography.weight.bold` | `700` |
| `typography.weight.extrabold` | `800` |
| `typography.role.display.fontSize` | `3rem` |
| `typography.role.display.lineHeight` | `1.2` |
| `typography.role.display.fontWeight` | `"{typography.weight.extrabold}"` |
| `typography.role.display.tracking` | `-0.02` |
| `typography.role.title.fontSize` | `2rem` |
| `typography.role.title.lineHeight` | `1.2` |
| `typography.role.title.fontWeight` | `"{typography.weight.extrabold}"` |
| `typography.role.title.tracking` | `-0.02` |
| `typography.role.heading.fontSize` | `1.375rem` |
| `typography.role.heading.lineHeight` | `1.3` |
| `typography.role.heading.fontWeight` | `"{typography.weight.bold}"` |
| `typography.role.heading.tracking` | `-0.015` |
| `typography.role.bodyLarge.fontSize` | `1rem` |
| `typography.role.bodyLarge.lineHeight` | `1.6` |
| `typography.role.bodyLarge.fontWeight` | `"{typography.weight.regular}"` |
| `typography.role.bodyLarge.tracking` | `0` |
| `typography.role.body.fontSize` | `0.9375rem` |
| `typography.role.body.lineHeight` | `1.7` |
| `typography.role.body.fontWeight` | `"{typography.weight.regular}"` |
| `typography.role.body.tracking` | `0` |
| `typography.role.label.fontSize` | `0.8125rem` |
| `typography.role.label.lineHeight` | `1.5` |
| `typography.role.label.fontWeight` | `"{typography.weight.semibold}"` |
| `typography.role.label.tracking` | `0` |
| `typography.role.meta.fontSize` | `0.75rem` |
| `typography.role.meta.lineHeight` | `1.5` |
| `typography.role.meta.fontWeight` | `"{typography.weight.medium}"` |
| `typography.role.meta.tracking` | `0` |
| `typography.role.eyebrow.fontSize` | `0.6875rem` |
| `typography.role.eyebrow.lineHeight` | `1.4` |
| `typography.role.eyebrow.fontWeight` | `"{typography.weight.extrabold}"` |
| `typography.role.eyebrow.tracking` | `0.13` |
| `typography.measure` | `70` |
| `space.none` | `0px` |
| `space.3xs` | `2px` |
| `space.2xs` | `4px` |
| `space.xs` | `8px` |
| `space.sm` | `12px` |
| `space.md` | `16px` |
| `space.lg` | `24px` |
| `space.xl` | `32px` |
| `space.2xl` | `48px` |
| `space.3xl` | `64px` |
| `radius.chip` | `8px` |
| `radius.control` | `11px` |
| `radius.card` | `16px` |
| `radius.pill` | `999px` |
| `touchTarget.minimumIOS` | `44px` |
| `touchTarget.minimumAndroid` | `48px` |
| `touchTarget.spacing` | `8px` |
| `borderWidth.default` | `1.5px` |
| `borderWidth.emphasis` | `2px` |
| `shadow.card` | `{"color":{"colorSpace":"srgb","components":[0,0,0],"alpha":0.6,"hex":"#000000"},"offsetX":{"value":0,"unit":"px"},"offsetY":{"value":18,"unit":"px"},"blur":{"value":40,"unit":"px"},"spread":{"value":-12,"unit":"px"}}` |
| `shadow.brandGlow` | `{"color":{"colorSpace":"srgb","components":[0.0627,0.7255,0.5059],"alpha":0.25,"hex":"#10B981"},"offsetX":{"value":0,"unit":"px"},"offsetY":{"value":18,"unit":"px"},"blur":{"value":40,"unit":"px"},"spread":{"value":-12,"unit":"px"}}` |
| `motion.duration.instant` | `100ms` |
| `motion.duration.fast` | `150ms` |
| `motion.duration.normal` | `250ms` |
| `motion.duration.slow` | `400ms` |
| `motion.easing.standard` | `[0.2,0,0,1]` |
| `motion.easing.decelerate` | `[0,0,0,1]` |
| `motion.easing.accelerate` | `[0.3,0,1,1]` |
| `layout.pageMax` | `1240px` |
| `layout.contentMax` | `1024px` |
| `layout.gutter` | `22px` |
| `layout.sidebarWidth` | `252px` |
| `layout.sidebarGap` | `44px` |

---

## Part 4 — Platform mechanics (PLATFORM-mobile.md)

How the brand system applies to phones. Read this with Part 2 (what to decide) and
Part 3 (the values).

**This file contains platform-specific mechanics on purpose.** Part 2 has none, which is what
makes it portable. This one is for phones and only phones.

**Every number below was checked against Apple's and Google's current guidance. Where a value may
drift, this file says so rather than implying permanence. Re-check the platform minimums before a
release — they change.**

---

### 0. Your toolchain — and one thing to act on now

You are building Android apps with Google's AI tooling. That is a reasonable choice, and it is
also a temporary one. Read this section before you commit to a workspace.

#### Firebase Studio is being sunset

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

**That last point is why this system is shaped the way it is.** Part 3, Part 2 and this
file are plain files in Git. They are not a Firebase Studio preference, not an Android Studio theme,
and not anything an AI tool owns. If you switch tool, they work unchanged. If you switch platform,
they work unchanged. Nothing here needs re-entering anywhere.

**Practical instruction: keep every Android project in its own Git repository from the first
commit.** Not for version control niceness — so that a tool sunset is a checkout away rather than a
rewrite.

#### The prompt that gets you a correct build

You are working with an AI agent, which means the quality of this system depends on what you tell it.
Paste this at the start of any build, with the file paths corrected to wherever you put them:

> Before writing UI, read Part 2, Part 3 and this file, in that order. Part 2 decides
> what; Part 3 holds the values; this file covers the mobile mechanics.
>
> Rules that override anything you would otherwise choose:
>
> 0. Use the provided theme function unchanged. Do **not** use
>    `dynamicLightColorScheme` / `dynamicDarkColorScheme`, and do not write your own
>    `MaterialTheme(...)` call. Android 12+ can derive an entire palette from the user
>    wallpaper, which silently replaces the brand with no error and no crash. It also
>    looks right on your own device and wrong on everyone else's, because it depends on
>    which wallpaper they happen to have. A brand that changes per user is not a brand.
>    If you want a wallpaper accent, reference it explicitly as a deliberate role, never
>    as the scheme.
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

### 1. The three things that break when a web design becomes an app

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

### 2. Touch targets

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

**Also true on the web.** A touch-capable browser is a phone. Anything in Part 4 that
depends on hover needs a touch equivalent.

---

### 3. Type: map roles to native styles

**Never set a font size in a native app.** Use the platform's semantic style and let it scale. This
is not a preference — it is how the app remains usable for someone who needs 200% text.

#### Role mapping

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

#### The finding that changes how you test

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

#### Letter-spacing does not scale

Tracking is applied as a fixed value in both platforms, so it stays the same absolute width while
the glyphs grow. At large text sizes a fixed tracking value becomes proportionally tighter. For the
`eyebrow` role especially, check it at the largest size and allow for wrapping to two lines rather
than truncating.

#### Padding that grows with the text

On iOS, spacing around a text element should scale with it, or the text crowds its container as the
user enlarges it. SwiftUI's scaled-metric helper does this; the equivalent exists on both platforms.
For values that must not scale — a minimum hit area, a fixed toolbar height — use the raw token.

---

### 4. Space and safe areas

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

### 5. Navigation

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

### 6. Motion

**Durations carry over** from `motion.duration` — fast, normal, and a hard ceiling. What does not
carry over is the curve. The easing values in Part 3 encode how a pointer device feels and
should not be ported. Use the platform's motion vocabulary: a spring on iOS, the emphasised
decelerate curve on Android.

**Reduced motion is a requirement.** Both platforms expose the user's preference, and roughly one
person in four has it enabled. Every animation needs a still, legible fallback — not a faster
version, a *different* one. An animation that only runs half-speed is still an animation.

**Keep it cheaper on a phone.** Continuous glows and large blurs cost battery on OLED panels and can
drop frames on older hardware. Our signature background gradient is fine as a static treatment; it
should not animate continuously.

---

### 7. States that a website does not have

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

### 8. Forms and the keyboard

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

### 9. Dark mode is our default

Our brand is dark-native, which is an unusually good fit for phones: OLED panels, low-light use, and
long reading sessions.

**Both platforms default to following the system appearance**, so a dark-native brand gets the
benefit without doing anything. Do not force a theme.

Follow the system setting to light when the user asks, using the `color.light.*` roles. Our
light-mode accent values are darker steps precisely so they remain legible on white — see
Part 2.

---

### 10. Worked examples

Each maps Part 3 roles onto one platform. These are patterns, not drop-in libraries — the
adapters directory will hold proper ones once a project needs them.

#### React Native / Expo

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

#### SwiftUI

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

#### Jetpack Compose — your primary path

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

#### Flutter

**Use Part 5.** It is generated from Part 3 and covers both colour
schemes, the type roles, dimensions, and a `brandTheme()` builder.

```dart
MaterialApp(
  theme: brandTheme(Brightness.light),
  darkTheme: brandTheme(Brightness.dark),
  // themeMode defaults to ThemeMode.system, which is what we want.
)
```

Two Flutter-specific rules:

- **Never set `textScaler`.** Flutter scales text from the user's accessibility settings, and
  pinning it makes the app unusable for someone who needs larger text. The adapter deliberately
  leaves it alone.
- **Type sizes come from Material's scale, not from the token file.** The tokens hold the web
  baseline, and a phone is not a small browser. What the adapter does take from the tokens is the
  generous line height and the tracking, which are the parts that carry the brand.

**Requires Flutter 3.32 or later.** The Material theming API has had breaking changes: `CardTheme`
became `CardThemeData`, and `ColorScheme.background` and `ColorScheme.surfaceVariant` were removed
in favour of the `surfaceContainer*` family and an explicit `scaffoldBackgroundColor`. On an older
Flutter you will get compile errors; the fix is to upgrade, not to patch the adapter.

This has **not been compile-verified** — no Dart toolchain was available where it was written. It is
checked structurally (colour literal widths, identifier validity, balanced delimiters, and the API
names above) but you should run `dart analyze` on it before relying on it.

---

### 11. What not to do

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

### 12. Checklist

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

*Decisions: Part 2. Values: Part 3. Web:
Part 4.*

*Platform minimums and API names in this file were verified against Apple and Google guidance on
30 September 2026. Re-check them before a release: they change.*

---

## Part 5 — The theme file, copied verbatim

Write this to `Brand.swift (add to your app target)` exactly as it appears. Change the package or import path if it needs one, and change nothing else. Do not reformat it, do not "improve" it, and do not fix anything you think looks wrong — report it instead. Every value in it is the brand.

```swift
// GENERATED FILE - DO NOT EDIT BY HAND.
// Produced by scripts/build-adapters.mjs from tokens.json.
// Edit tokens.json, then run: npm run tokens:build
// Checked for staleness by: npm run adapters:check
//
// Note on type: this adapter deliberately does NOT carry font sizes. iOS
// scales text through Dynamic Type, so a pinned point size fights the
// user. Roles map to Font.TextStyle instead - see Brand.Role.
//
// Source of truth: tokens.json

import SwiftUI

enum Brand {

    // MARK: - Palette (internal use only)
    enum Palette {
        static let Amber400 = Color(hex: 0xFBBF24)
        static let Amber500 = Color(hex: 0xF59E0B)
        static let Amber700 = Color(hex: 0xB45309)
        static let Cyan400 = Color(hex: 0x22D3EE)
        static let Cyan500 = Color(hex: 0x06B6D4)
        static let Cyan700 = Color(hex: 0x0E7490)
        static let Emerald400 = Color(hex: 0x34D399)
        static let Emerald500 = Color(hex: 0x10B981)
        static let Emerald700 = Color(hex: 0x047857)
        static let Paper = Color(hex: 0xEAEFF5)
        static let Rose400 = Color(hex: 0xFB7185)
        static let Rose500 = Color(hex: 0xF43F5E)
        static let Rose700 = Color(hex: 0xE11D48)
        static let Slate100 = Color(hex: 0xF1F5F9)
        static let Slate300 = Color(hex: 0xCBD5E1)
        static let Slate400 = Color(hex: 0x94A3B8)
        static let Slate50 = Color(hex: 0xF8FAFC)
        static let Slate700 = Color(hex: 0x334155)
        static let Slate800 = Color(hex: 0x1E293B)
        static let Slate900 = Color(hex: 0x0F172A)
        static let Slate950 = Color(hex: 0x020617)
        static let Swatch556070 = Color(hex: 0x556070)
        static let SwatchEAEFF5 = Color(hex: 0xEAEFF5)
        static let SwatchFFFFFF = Color(hex: 0xFFFFFF)
        static let white = Color(hex: 0xFFFFFF)
    }

    // MARK: - Colour roles
    //
    // Screens use these, never Palette directly. A plain name is for fills
    // and borders; the Text-suffixed one is the only variant permitted for
    // coloured text. That distinction is the same on every platform.
    //
    // Declared as nested enums of assignments rather than a struct with a
    // memberwise initialiser: an initialiser can only be correct if every
    // palette name it references exists, and that is exactly the bug this
    // shape was rewritten to remove.
    enum Colors {
        static let background = Palette.Slate950
        static let surface = Palette.Slate900
        static let surfaceRaised = Palette.Slate800
        static let border = Palette.Slate800
        static let borderStrong = Palette.Slate700
        static let text = Palette.Slate100
        static let textBody = Palette.Slate300
        static let textMuted = Palette.Slate400
        static let brand = Palette.Emerald500
        static let brandText = Palette.Emerald400
        static let accent = Palette.Cyan500
        static let accentText = Palette.Cyan400
        static let warning = Palette.Amber500
        static let warningText = Palette.Amber400
        static let danger = Palette.Rose500
        static let dangerText = Palette.Rose400
        static let onBrand = Palette.Slate950

        /// Light theme. Accent values take a DARKER step, never the dark
        /// value above. Reusing the dark accents here is the single most
        /// common way this brand is broken on a light background.
        enum Light {
            static let background = Palette.SwatchEAEFF5
            static let surface = Palette.SwatchFFFFFF
            static let surfaceRaised = Palette.Slate50
            static let border = Palette.Slate300
            static let borderStrong = Palette.Slate400
            static let text = Palette.Slate950
            static let textBody = Palette.Slate700
            static let textMuted = Palette.Swatch556070
            static let brand = Palette.Emerald700
            static let brandText = Palette.Emerald700
            static let accent = Palette.Cyan700
            static let accentText = Palette.Cyan700
            static let warning = Palette.Amber700
            static let warningText = Palette.Amber700
            static let danger = Palette.Rose700
            static let dangerText = Palette.Rose700
            static let onBrand = Palette.Slate950
        }
    }

    // MARK: - Dimensions
    enum Dimension {
        static let touchTargetIOS: CGFloat = 44
        static let touchGap: CGFloat = 8
        static let radiusChip: CGFloat = 8
        static let radiusControl: CGFloat = 11
        static let radiusCard: CGFloat = 16
        static let borderWidth: CGFloat = 1.5
        static let gutter: CGFloat = 22

        enum Spacing {
            static let Xxxs: CGFloat = 2
            static let Xxs: CGFloat = 4
            static let Xs: CGFloat = 8
            static let Sm: CGFloat = 12
            static let Md: CGFloat = 16
            static let Lg: CGFloat = 24
            static let Xl: CGFloat = 32
            static let Xxl: CGFloat = 48
            static let Xxxl: CGFloat = 64
        }
    }

    // MARK: - Type roles
    //
    // A role, not a size. Using these lets Dynamic Type do its job; setting
    // .system(size:) instead will silently break accessibility text sizes.
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

    // MARK: - Theme
    static func background(_ scheme: ColorScheme) -> Color {
        scheme == .dark ? Palette.Slate950 : Palette.Paper
    }

    static func surface(_ scheme: ColorScheme) -> Color {
        scheme == .dark ? Palette.Slate900 : Palette.white
    }
}

/// Convenience: the role set for a colour scheme.
extension Brand {
    static func colors(_ scheme: ColorScheme) -> Brand.Colors {
        scheme == .dark ? .dark : .light
    }
}
extension Color {
    /// Accepts 0xRRGGBB or 0xAARRGGBB. Used by the generated palette above.
    init(hex: UInt32) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: 1
        )
    }
}
```

---

## Part 6 — Report back

When you have finished, end your reply with exactly the block below. Fill in every line, and do not claim a check you did not run.

End your reply with exactly this block:

```
Brand:    Dammie Optimus Solutions design kit <version> (<content hash>)
Theme:    Brand.swift (target: <your target name>)
Build:    <pass, or the exact error>
Failures: <list, or "none">
Assumed:  <anything you decided that this file did not tell you>
```

If a check failed, say so plainly. An agent that reports its own failures is useful. One that hides
them costs more time than it saves.

If something did not pass, say so plainly. An agent that reports its own failures is useful; one that hides them costs more time than it saves.

<!--
  GENERATED FILE — composed by scripts/build-brand-kit.mjs from
    setup/IOS.md
    BRAND.md
    tokens.json
    PLATFORM-mobile.md
    adapters/swift/Brand.swift

  Do not edit. Change a source in the portfolio repository and run
  `npm run kit:build`. Any edit here is overwritten.
-->
