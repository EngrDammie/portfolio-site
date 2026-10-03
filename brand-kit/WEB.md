# Dammie Optimus Solutions — Web — CSS

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

#### 2.1 Write the token layer, then import it

Write Part 5 to `src/styles/brand.css` exactly as it appears, then import it once at the root:

```css
@import './brand.css';
```

It defines the custom properties on `:root` and the dark scheme; nothing else is needed.

If your build genuinely cannot take an extra stylesheet, paste the `:root` block out of Part 4
instead. Do not mix the two conventions inside one component.

#### 2.2 Reference tokens, never raw values

```css
.card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-lg);
  color: var(--text);
}
```

Surfaces are `--bg`, `--bg-2`, `--bg-3`. Text is `--text`, `--text-2`, `--text-3`. Borders are
`--border` and `--border-soft`. Accents are `--emerald` and `--cyan`, with `--emerald-ink` and
`--cyan-ink` for text sitting on those accents. Radii are `--radius-chip`, `--radius-control`,
`--radius` for cards and sections, `--radius-control` for buttons and inputs,
`--radius-chip` for tags, and `--radius-pill` for pills and avatars. Spacing runs `--space-3xs` to `--space-3xl`. Motion is
`--motion-instant`, `--motion-fast`, `--motion-normal`, `--motion-slow`, with `--ease-standard`,
`--ease-decelerate` and `--ease-accelerate`. Layout is `--page-max`, `--content-max`, `--gutter`
and `--sidebar-w`. Touch is `--touch-min` and `--touch-gap`. Read `web.css` for the full set rather
than guessing a name.

#### 2.3 Tailwind

The token values *are* stock Tailwind colours, so no configuration is needed. Both styles are
correct. Mixing them inside one component is not.

### 2. Rules that override anything you would otherwise choose

0. Colour, spacing, radius, type size, shadow and duration all come from a token. Never a raw hex,
   `px`, `rem`, `ms` or `s` in a component. This is the whole mechanism — a hardcoded value is a
   brand bug even when it looks right.
1. Use semantic roles, not palette names. A role survives a palette change; a swatch does not.
2. `--emerald` and `--cyan` are accents for one or two things per view. They are not decoration. A
   screen with four accent-coloured elements has none.
3. Respect `prefers-reduced-motion`. The motion tokens exist; disabling them wholesale is not the
   answer, honouring the user's setting is.
4. Meet `--touch-min` (48px) for every interactive element, with `--touch-gap` (8px) between
   targets. The target may be larger than the visual — pad to reach it.
5. Respect the safe area on mobile viewports, and keep body text at a readable size and measure. Do
   not set a `max-width` on text so tight that long words overflow.
6. Never hardcode `font-family` to Geist or a bundled file. The system stack in `web.css` is the
   design; Geist belongs to this portfolio's own pages, not to client work.
7. Design loading, empty, offline and error states. On a phone these are most of the experience,
   not the polish at the end of it.
8. Dark is the default and the native mode. Light mode is the supported alternative, not an
   afterthought — check both.

### 3. Check every one of these before you report

Run each check. Report every failure with its file and line. Do not claim a pass you have not
verified.

- [ ] `web.css` is imported once at the root and is unmodified.
- [ ] No raw hex, `px`, `rem`, `ms` or `s` in any component file — grep for it.
- [ ] No palette-style names outside the token file.
- [ ] No custom `font-family` declaration.
- [ ] Every interactive element meets `--touch-min`.
- [ ] `prefers-reduced-motion` is honoured, not globally disabled.
- [ ] Light and dark both look intentional. Check them.
- [ ] Every view that fetches anything has loading, empty, offline and error states.
- [ ] It builds and the production bundle has no console errors.



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
| Part 5 (`web.css`) | Web and documents. The maintained alternative to the hand-written block in Part 4 |

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

## Part 4 — Platform mechanics (DESIGN_SYSTEM.md)

A single, self-contained specification for building interfaces that match **the portfolio site**
and **the internal documents**. Copy this file into any project. It assumes nothing about your
stack — plain HTML, CSS, JavaScript, React, Vue, or anything else.

**It is a specification, not a suggestion.** If an existing app in your portfolio does not match this
file, the app is wrong and this file is right. Follow the tokens, not the old markup.

---

### How to apply this

1. **Paste the token block** (Part 2) into your global stylesheet, usually at the very top.
2. **Use the component CSS** (Part 5) or map it onto your framework's equivalent classes.
3. **Check the checklist** (Part 11) before you call the work done.

Two rules that matter more than the rest:

- **Never write a raw hex value in a component.** Use a token. If you need a colour that is not in
  the list, add a token to `:root` first, then use it.
- **Never invent a second radius, shadow, or spacing value.** Pick the nearest one from the scale.

---

### 1. The shape of the design

Three ideas, and everything else follows from them.

**Dark by default, with a real light mode.** The base surface is nearly black with a blue undertone,
not pure black. The interface is designed to be read for a long time, so surfaces step *up* in
lightness as they come forward rather than relying on heavy shadows.

**One accent gradient, used sparingly.** A green-to-cyan diagonal gradient. It appears on primary
buttons, active states, borders and glows — nowhere else. If a screen has more than about two
gradient elements, it is over-decorated.

**Density with air.** Compact controls, generous padding around them. Text is small but line height
is generous, so screens feel precise rather than cramped.

---

### 2. Tokens

Paste this whole block. Everything else in this document refers to these names.

> **If you are working in a repo that has the adapter, use Part 5 instead of copying
> this block.** It is generated from Part 3, so it cannot drift from the brand. This block is
> the self-contained copy for projects that do not have it, which is why it is checked rather than
> generated — `npm run tokens:check` fails if the two disagree.

```css
:root {
  /* ---- Surfaces ---------------------------------------------- */
  --bg:            #020617;   /* page background — slate-950 */
  --bg-2:          #0f172a;   /* raised: cards, inputs, nav  — slate-900 */
  --bg-3:          #1e293b;   /* raised further: chips, code — slate-800 */
  --border:        #1e293b;   /* default border                — slate-800 */
  --border-soft:   #334155;   /* interactive / hover borders   — slate-700 */

  /* ---- Text ---------------------------------------------------- */
  --text:          #f1f5f9;   /* primary                       — slate-100 */
  --text-2:        #cbd5e1;   /* secondary, body copy          — slate-300 */
  --text-3:        #94a3b8;   /* muted, meta, labels           — slate-400 */

  /* ---- Brand --------------------------------------------------- */
  --emerald:       #10b981;   /* emerald-500 — borders, glows  */
  --cyan:          #06b6d4;   /* cyan-500    — borders, glows  */
  --amber:         #f59e0b;   /* warnings                      */
  --rose:          #f43f5e;   /* errors, destructive           */

  /* Text-safe variants. Use THESE for coloured text, never the ones above.
     #10b981 on white is 2.54:1 and fails WCAG AA; #34d399 is 2.28:1 better
     and is the correct choice on dark surfaces. On light surfaces you need
     a *darker* step, not a lighter one — see Part 9. */
  --emerald-ink:   #34d399;
  --cyan-ink:      #22d3ee;
  --amber-ink:     #fbbf24;
  --rose-ink:      #fb7185;

  /* The one gradient. */
  --grad: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);

  /* ---- Geometry ------------------------------------------------ */
  --radius:        16px;   /* cards, sections */
  --radius-control: 11px;  /* buttons, inputs */
  --radius-chip:     8px;  /* chips, tags */
  --radius-pill:  999px;   /* pills, avatars */
  --border-w:     1.5px;

  /* ---- Elevation ----------------------------------------------- */
  --shadow:      0 18px 40px -12px rgba(0, 0, 0, .6);
  --shadow-glow: 0 18px 40px -12px rgba(16, 185, 129, .25);

  /* ---- Type ---------------------------------------------------- */
  --font-sans: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* ---- Layout -------------------------------------------------- */
  --page-max:     1240px;
  --gutter:      22px;
}
```

#### Measured contrast

Verified with the WCAG relative-luminance formula against every surface each colour is used on.
All pairs are AA for normal text (4.5:1).

| Pair | Dark | Light |
|---|---|---|
| Heading on background | 18.41:1 | 17.45:1 |
| Body on background | 13.59:1 | 8.96:1 |
| Body on card | 12.02:1 | 10.35:1 |
| Muted on background | 7.87:1 | 5.52:1 |
| Emerald ink on background | 10.49:1 | 4.74:1 |
| Cyan ink on background | 11.16:1 | 4.63:1 |
| Button text on gradient start | 7.95:1 | 7.95:1 |
| Button text on gradient end | 8.31:1 | 8.31:1 |

Two values were corrected while producing this table, and the comments in the light-mode block
record them. Light-mode `--text-3` was `#64748b` at 4.12:1 and `--emerald-ink` was `#059669` at
3.26:1 — both below AA. Anyone reusing the old values will ship a failing page.

#### Loading the fonts

Geist is free and on Google Fonts. No bundler required:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

The fallbacks in the token block are deliberate. If the network font fails, the page must still look
correct rather than falling to Times.

#### Tailwind users

You do not need to reconfigure anything. The token values **are** stock Tailwind colours:

| Token | Tailwind class |
|---|---|
| `--bg` | `slate-950` |
| `--bg-2` | `slate-900` |
| `--bg-3` / `--border` | `slate-800` |
| `--border-soft` | `slate-700` |
| `--text` | `slate-100` |
| `--text-2` | `slate-300` |
| `--text-3` | `slate-400` |
| `--emerald` | `emerald-500` |
| `--cyan` | `cyan-500` |

So you may write either `bg-slate-950` or `var(--bg)`. Both are correct. **Do not mix the two within
a single component** — pick one convention per file and stay in it.

---

### 3. Typography

Geist Sans throughout, Geist Mono for anything machine-generated: code, hashes, identifiers,
numbers inside technical labels, file paths.

#### Scale

| Use | Size | Weight | Notes |
|---|---|---|---|
| Display | `clamp(1.875rem, 5vw, 3.75rem)` | 800 | Page hero only. One per page. |
| Section heading | `1.25rem` – `1.5rem` | 700–800 | |
| Card heading | `1rem` | 700 | |
| Body | `0.9375rem` – `1rem` | 400–500 | Line height `1.6` – `1.75`. |
| Secondary body | `0.875rem` | 400 | Colour `--text-2`. |
| Label / meta | `0.75rem` | 500–600 | Colour `--text-3`. |
| Micro / eyebrow | `0.6875rem` | 700–800 | Uppercase, `letter-spacing: .13em` |
| Micro / mono | `0.6875rem` – `0.75rem` | 500 | Font mono. |

#### Rules

- **Line height is what makes this look right.** Small text needs generous leading. Body copy at
  `0.9375rem` should sit at `line-height: 1.7`. Tight leading on small text is the single most common
  way an interface ends up looking cheap.
- **Body measure:** cap paragraphs at `70ch`. Full-width paragraphs are hard to track.
- **Letter spacing:** uppercase micro text needs `0.1em` – `0.15em` added. Without it, uppercase
  small text looks like shouting and is hard to read.
- **Display headings** get `letter-spacing: -0.02em`. Body text gets none — do not add tracking to
  body copy.

---

### 4. Surfaces, borders, elevation

**Borders are `1.5px`, not `1px`.** The fractional width is deliberate: at 1px the borders read as
noise on a dark background, at 2px they read as heavy. `1.5px` is the settled middle.

**Default border is `--border`, not `--border-soft`.** The soft variant is only for elements the user
can interact with, where the border itself should read as clickable.

**Elevation comes from surface lightness first, shadow second.** A card on `--bg` uses `--bg-2` plus
`--shadow`. A card on `--bg-2` uses `--bg-3` and usually needs no shadow at all.

**Glow shadows are for accent elements only.** Primary buttons and active states get
`--shadow-glow`. A glow on a neutral element looks like an error state.

**The page background is not flat.** Both the site and the documents put two very soft radial
gradients behind everything:

```css
body::before {
  content: '';
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(760px 420px at 12% -8%, rgba(16,185,129,.10), transparent 62%),
    radial-gradient(700px 400px at 92% 4%,  rgba(6,182,212,.08),  transparent 60%);
}
```

Content must sit above it with `position: relative; z-index: 1`. This is what stops a near-black page
reading as flat and cheap.

**A faint grid** sits behind the document pages at 60px, at about 5% white. Optional elsewhere.

---

### 5. Components

Copy-paste ready. These are the components the existing apps actually use.

#### Buttons

```css
.btn {
  display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
  padding: 11px 18px; border-radius: var(--radius-control);
  font-size: 0.84375rem; font-weight: 700; line-height: 1;
  border: none; text-decoration: none; white-space: nowrap;
  transition: transform .15s ease, filter .15s ease;
}
.btn-primary {
  background: var(--grad); color: #020617;
  box-shadow: var(--shadow-glow);
}
.btn-secondary {
  background: transparent; color: var(--text);
  border: var(--border-w) solid var(--border-soft);
}
.btn-ghost {
  background: var(--bg-2); color: var(--text-2);
  border: var(--border-w) solid var(--border-soft);
  padding: 8px 13px; font-size: 0.8125rem; border-radius: 10px;
}
.btn:hover  { filter: brightness(1.08); }
.btn:active { transform: scale(.98); }
.btn:focus-visible { outline: 2px solid var(--emerald-ink); outline-offset: 3px; }
.btn[disabled] { opacity: .5; cursor: not-allowed; filter: none; }
```

**Primary buttons carry dark text.** The gradient is too light for white text to be legible. This is
the most commonly botched detail when copying the brand.

#### Cards

```css
.card {
  background: var(--bg-2);
  border: var(--border-w) solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow);
}
.card-title {
  font-size: 1rem; font-weight: 700; color: var(--text);
  margin: 0 0 10px;
  display: flex; align-items: center; gap: 9px;
}
.card-body { font-size: 0.9375rem; line-height: 1.7; color: var(--text-2); margin: 0; }

/* Grid children must be allowed to shrink, or long words force a scrollbar. */
.card > * { min-width: 0; }
```

#### Chips, pills, badges

```css
.chip {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 0.75rem; font-weight: 600;
  padding: 6px 12px; border-radius: var(--radius-chip);
  background: var(--bg-3); border: var(--border-w) solid var(--border);
  color: var(--text-3);
}
.pill {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 0.75rem; font-weight: 600;
  padding: 6px 13px; border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--emerald) 12%, transparent);
  border: var(--border-w) solid color-mix(in srgb, var(--emerald) 34%, transparent);
  color: var(--emerald-ink);
}
/* Eyebrow / kicker text above a heading. */
.eyebrow {
  font-size: 0.6875rem; font-weight: 800;
  letter-spacing: .13em; text-transform: uppercase;
  color: var(--emerald-ink);
}
```

#### Inputs

```css
.input, .textarea {
  width: 100%; box-sizing: border-box;
  padding: 13px 15px;
  background: var(--bg-2);
  border: var(--border-w) solid var(--border);
  border-radius: var(--radius-control);
  color: var(--text);
  font-family: inherit; font-size: 0.9375rem; line-height: 1.5;
  transition: border-color .15s ease;
}
.input::placeholder, .textarea::placeholder { color: var(--text-3); }
.input:focus, .textarea:focus {
  outline: none;
  border-color: var(--emerald);
}
.label { font-size: 0.8125rem; font-weight: 600; color: var(--text-2); margin-bottom: 7px; display: block; }
```

#### Callouts

Used heavily in the documents. The colour carries the meaning, and the label always states it in
words so it is not colour-dependent.

```css
.callout { border: 2px solid var(--border); border-radius: 14px; padding: 20px 22px; margin: 22px 0; }
.callout-good { border-color: color-mix(in srgb, var(--emerald) 42%, transparent); background: color-mix(in srgb, var(--emerald) 7%, transparent); }
.callout-info { border-color: color-mix(in srgb, var(--cyan) 40%, transparent);    background: color-mix(in srgb, var(--cyan) 7%, transparent); }
.callout-warn { border-color: color-mix(in srgb, var(--amber) 42%, transparent);   background: color-mix(in srgb, var(--amber) 7%, transparent); }
.callout-stop { border-color: color-mix(in srgb, var(--rose) 42%, transparent);    background: color-mix(in srgb, var(--rose) 7%, transparent); }
.callout-title { font-size: 0.9375rem; font-weight: 800; margin-bottom: 10px; display: flex; align-items: center; gap: 9px; }
.callout-good .callout-title { color: var(--emerald-ink); }
.callout-info .callout-title { color: var(--cyan-ink); }
.callout-warn .callout-title { color: var(--amber-ink); }
.callout-stop .callout-title { color: var(--rose-ink); }
.callout p:last-child { margin-bottom: 0; }
```

#### Tables

```css
.table-wrap { overflow-x: auto; margin: 20px 0; }
.table-wrap table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.table-wrap th {
  text-align: left; padding: 11px 13px;
  color: var(--text-3); font-size: 0.75rem; font-weight: 800;
  letter-spacing: .07em; text-transform: uppercase;
  border-bottom: var(--border-w) solid var(--border-soft);
}
.table-wrap td { padding: 11px 13px; border-bottom: var(--border-w) solid var(--border); color: var(--text-2); vertical-align: top; }
.table-wrap tr:last-child td { border-bottom: none; }
```

#### Code

```css
code {
  font-family: var(--font-mono); font-size: 0.875em;
  background: var(--bg-3); color: var(--text);
  padding: 2px 6px; border-radius: 6px;
}
pre {
  font-family: var(--font-mono); font-size: 0.8125rem; line-height: 1.65;
  background: var(--code-bg, var(--bg));
  border: var(--border-w) solid var(--border);
  border-radius: 12px; padding: 17px 19px;
  overflow-x: auto; color: var(--text-2);
}
```

---

### 6. Layout shells

#### Marketing page — centred column

```css
.page { max-width: var(--page-max); margin: 0 auto; padding: 34px var(--gutter) 90px; position: relative; z-index: 1; }
.section { max-width: 1024px; margin: 0 auto; padding: 64px 0; text-align: center; }
.section-lede { color: var(--text-2); font-size: 0.96875rem; line-height: 1.7; max-width: 70ch; margin: 0 auto 22px; }
```

Headings are centred on marketing pages and left-aligned on document pages. Do not mix within a page.

#### Document page — sidebar plus content

```css
.doc-layout {
  max-width: var(--page-max); margin: 0 auto;
  padding: 34px var(--gutter) 90px;
  display: grid; grid-template-columns: 252px 1fr;
  gap: 44px; align-items: start;
}
@media (max-width: 940px) {
  .doc-layout { grid-template-columns: 1fr; gap: 26px; }
  .doc-toc { position: static !important; max-height: none; }
}
```

The table of contents is sticky, because a document long enough to need one is always longer than
the viewport:

```css
.doc-toc { position: sticky; top: 24px; max-height: calc(100vh - 48px); overflow-y: auto; font-size: 0.8125rem; }
.doc-toc a { display: block; padding: 6px 12px; color: var(--text-3); text-decoration: none; border-radius: 8px; }
.doc-toc a:hover { color: var(--text); background: var(--bg-2); }
.doc-toc a.active { color: var(--emerald-ink); background: color-mix(in srgb, var(--emerald) 10%, transparent); font-weight: 600; }
```

#### Sticky header

```css
.site-header {
  position: sticky; top: 0; z-index: 50;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: var(--border-w) solid var(--border);
}
.site-header .inner {
  max-width: var(--page-max); margin: 0 auto; padding: 14px var(--gutter);
  display: flex; align-items: center; gap: 16px;
}
.brand-name { font-size: 1.125rem; font-weight: 800; color: var(--text); letter-spacing: -.01em; }
.brand-sub  { font-size: 0.6875rem; font-weight: 700; letter-spacing: .2em; color: var(--cyan-ink); margin-top: 3px; }
```

#### Base page

```css
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}
h1, h2, h3, h4 { color: var(--text); line-height: 1.2; margin: 0 0 .6em; letter-spacing: -.015em; }
h1 { font-size: clamp(1.875rem, 5vw, 3.75rem); font-weight: 800; }
h2 { font-size: clamp(1.5rem, 3.5vw, 2.25rem); font-weight: 800; }
h3 { font-size: 1.375rem; font-weight: 700; }
h4 { font-size: 1rem;   font-weight: 700; }
p  { margin: 0 0 1em; color: var(--text-2); }
a  { color: var(--cyan-ink); text-decoration: none; }
a:hover { text-decoration: underline; }
strong { color: var(--text); }
```

---

### 7. The logo

The DO monogram. Do not redraw it — copy this.

```html
<svg viewBox="0 0 160 120" fill="none" aria-label="Dammie Optimus Monogram">
  <g stroke="url(#doGrad)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 30 25 L 30 95" />
    <path d="M 30 25 L 60 25 A 35 35 0 0 1 60 95 L 30 95" />
    <circle cx="100" cy="60" r="35" />
  </g>
  <circle cx="100" cy="60" r="10" fill="url(#doGrad)" />
</svg>
```

It needs the gradient defined once, anywhere above it on the page:

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="doGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#10B981" />
    <stop offset="100%" stop-color="#06B6D4" />
  </linearGradient>
</defs></svg>
```

**The gradient id must be unique per page.** If two components define `doGrad`, the second silently
renders in the wrong colour.

**Always pair it with the wordmark.** The monogram alone is unrecognisable outside your own apps.
The lockup is the monogram plus `Dammie Optimus Solutions` in 800 weight with a `SOFTWARE ENGINEERING`
subtitle in cyan, letter-spaced `0.2em`.

---

### 8. Motion

Motion in this system is short, subtle, and used only to explain a change.

```css
.btn, .card, a { transition: filter .15s ease, transform .15s ease, border-color .15s ease, background-color .15s ease; }
```

- Interactive feedback: `150ms` `ease`
- Anything entering or leaving: `200–300ms`
- Never exceed `400ms` for a state change. Longer feels sluggish.
- Hovers use `filter: brightness(1.08)`, never a colour swap.
- Presses use `transform: scale(.98)`.

**Always respect reduced motion.** This is a requirement, not a nicety — an automated
fast-moving animation is genuinely unpleasant for people with vestibular disorders, and roughly one
visitor in four has this setting on.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

### 9. Light mode

Light mode is a **token swap**, not a second stylesheet. Every colour in your components comes from a
token, so switching `:root` values switches the whole interface.

```css
html[data-theme="light"] {
  --bg:          #eaeff5;
  --bg-2:        #ffffff;
  --bg-3:        #f1f5f9;
  --border:      #cbd5e1;
  --border-soft: #94a3b8;
  --text:        #020617;
  --text-2:      #334155;
  --text-3:      #556070;   /* was #64748b: measured 4.12:1, fails AA */

  /* Darker steps, not lighter ones. This is the part that goes wrong. */
  --emerald-ink: #047857;   /* was #059669: measured 3.26:1, fails AA */
  --cyan-ink:    #0e7490;
  --amber-ink:   #b45309;
  --rose-ink:    #e11d48;
}
```

Three rules:

1. **Accent ink gets *darker* in light mode.** The dark-mode values are tuned for a near-black
   background; used on white they fail contrast.
2. **Primary buttons keep the gradient and keep their dark text.** The gradient is unchanged in light
   mode — it is the one element that must stay identical.
3. **Light-mode borders get *stronger*, not weaker.** On white, a `#1e293b` border is invisible.

The toggle itself is a small button in the header, and the choice should persist:

```js
// Set once, before first paint, to avoid a flash of the wrong theme.
const theme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', theme);
```

---

### 10. Do and do not

**Do**

- Use `--text-2` for body copy and `--text-3` only for labels and meta. Full `--text` on body copy is
  too bright over a long read.
- Give every grid child `min-width: 0`. Long words otherwise force horizontal scroll.
- Include `transition` on `border-color`, not just `background`, for inputs.
- Use `color-mix()` for tinted borders and backgrounds rather than introducing new hex values.
- Pair every colour-only signal with a word or an icon.

**Do not**

- Put white text on the gradient. It is illegible. Gradient buttons take `#020617`.
- Use `--emerald` (`#10b981`) for text. Use `--emerald-ink`.
- Use `--border-soft` as a default border. It is reserved for interactive elements.
- Add a glow shadow to a neutral element. It reads as an error state.
- Animate anything on scroll without checking `prefers-reduced-motion`.
- Use more than two gradient elements on one screen.
- Add a border-radius that is not in the token list.

---

### 11. Verification checklist

Run through this before considering a screen finished.

- [ ] Background is `--bg`, and the two soft radial gradients are present behind content
- [ ] All content sits above the gradient layer with `position: relative; z-index: 1`
- [ ] Fonts are Geist Sans and Geist Mono, with working fallbacks
- [ ] Body copy is `--text-2` with line height at least `1.6` and a `70ch` measure
- [ ] Paragraph width is capped — no full-bleed body text
- [ ] Primary buttons use dark text on the gradient
- [ ] Every border is `1.5px`
- [ ] Only interactive elements use `--border-soft`
- [ ] Accent text uses an `-ink` token, never a raw brand hex
- [ ] Grid children have `min-width: 0`
- [ ] Light mode swaps tokens only, with darker accent ink, and does not flash on load
- [ ] `prefers-reduced-motion` is honoured
- [ ] Keyboard focus is visible on every interactive element
- [ ] Colour is never the only carrier of meaning
- [ ] No raw hex value appears outside `:root`

---

### 12. Reference values

Quick lookup. All sampled from the shipped apps, not chosen fresh.

| | Value |
|---|---|
| Page background | `#020617` |
| Card surface | `#0f172a` |
| Raised surface | `#1e293b` |
| Primary text | `#f1f5f9` |
| Body text | `#cbd5e1` |
| Muted text | `#94a3b8` |
| Accent green | `#10b981` / text `#34d399` |
| Accent cyan | `#06b6d4` / text `#22d3ee` |
| Card radius | `16px` |
| Control radius | `11px` |
| Pill radius | `999px` |
| Border width | `1.5px` |
| Card padding | `24px` |
| Control padding | `11px 18px` |
| Page max width | `1240px` |
| Content max width | `1024px` |
| Doc sidebar | `252px`, gap `44px` |
| Breakpoints | `940px`, `860px`, `780px`, `720px` |

---

*Maintained in the `portfolio` repository. If an app disagrees with this file, this file wins.*

---

## Part 5 — The theme file, copied verbatim

Write this to `src/styles/brand.css` exactly as it appears. Change the package or import path if it needs one, and change nothing else. Do not reformat it, do not "improve" it, and do not fix anything you think looks wrong — report it instead. Every value in it is the brand.

```css
/* GENERATED FILE - DO NOT EDIT BY HAND. */
/* Produced by scripts/build-adapters.mjs from tokens.json. */
/* Edit tokens.json, then run: npm run tokens:build */
/* Checked for staleness by: npm run adapters:check */
/*  */
/* CSS custom properties for web and documents. */
/* Source of truth: tokens.json */

/* Dark is the default because the brand is dark-native. Light is a token
   swap, not a second stylesheet: every colour a component uses comes from
   one of these properties, so changing this block changes the interface. */

:root {
  /* Surfaces */
  --bg: #020617;
  --bg-2: #0F172A;
  --bg-3: #1E293B;
  --border: #1E293B;
  --border-soft: #334155;

  /* Text */
  --text: #F1F5F9;
  --text-2: #CBD5E1;
  --text-3: #94A3B8;

  /* Brand — fills and borders */
  --emerald: #10B981;
  --cyan: #06B6D4;

  /* Brand — text-safe. Never use the two above for text. */
  --emerald-ink: #34D399;
  --cyan-ink: #22D3EE;
  --amber-ink: #FBBF24;
  --rose-ink: #FB7185;

  /* Status */
  --amber: #F59E0B;
  --rose: #F43F5E;

  /* Geometry */
  --radius: 16px;
  --radius-control: 11px;
  --radius-chip: 8px;
  --radius-pill: 999px;
  --border-w: 1.5px;
  --space-3xs: 2px;
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Touch targets — meaningless on a pointer device, kept so a web build
     running on a phone has something to read. */
  --touch-min: 48px;
  --touch-gap: 8px;

  /* Type */
  --font-sans: Geist, system-ui, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, Menlo, Consolas, monospace;

  /* Elevation */
  --shadow: 0px 18px 40px -12px #00000099;
  --shadow-glow: 0px 18px 40px -12px #10B98140;

  /* Layout */
  --page-max: 1240px;
  --content-max: 1024px;
  --gutter: 22px;
  --sidebar-w: 252px;

  /* Motion. Curves are web-only; native platforms substitute their own. */
  --motion-instant: 100ms;
  --motion-fast: 150ms;
  --motion-normal: 250ms;
  --motion-slow: 400ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0, 1);
  --ease-accelerate: cubic-bezier(0.3, 0, 1, 1);

  /* The one gradient */
  --grad: linear-gradient(135deg, var(--emerald) 0%, var(--cyan) 100%);
}

/* ---------------------------------------------------------------
   Light theme.
   Accent values take a DARKER step, not the dark-theme value. Borders get
   stronger, not weaker. The gradient is unchanged, and onPrimary stays
   dark, because it is the one element that must look identical in both.
   --------------------------------------------------------------- */

html[data-theme="light"] {
  --bg: #EAEFF5;
  --bg-2: #FFFFFF;
  --bg-3: #F8FAFC;
  --border: #CBD5E1;
  --border-soft: #94A3B8;
  --text: #020617;
  --text-2: #334155;
  --text-3: #556070;
  --emerald: #047857;
  --cyan: #0E7490;
  --emerald-ink: #047857;
  --cyan-ink: #0E7490;
  --amber-ink: #B45309;
  --rose-ink: #E11D48;
  --amber: #B45309;
  --rose: #E11D48;
}
```

---

## Part 6 — Report back

When you have finished, end your reply with exactly the block below. Fill in every line, and do not claim a check you did not run.

End your reply with exactly this block:

```
Brand:    Dammie Optimus Solutions design kit <version> (<content hash>)
Tokens:   <path>/web.css
Build:    <pass, or the exact error>
Failures: <list, or "none">
Assumed:  <anything you decided that this file did not tell you>
```

If a check failed, say so plainly. An agent that reports its own failures is useful. One that hides
them costs more time than it saves.

If something did not pass, say so plainly. An agent that reports its own failures is useful; one that hides them costs more time than it saves.

<!--
  GENERATED FILE — composed by scripts/build-brand-kit.mjs from
    setup/WEB.md
    BRAND.md
    tokens.json
    DESIGN_SYSTEM.md
    adapters/web.css

  Do not edit. Change a source in the portfolio repository and run
  `npm run kit:build`. Any edit here is overwritten.
-->
