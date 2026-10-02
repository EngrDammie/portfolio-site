# Dammie Optimus Solutions — Brand System

The platform-agnostic half of our design system. This file contains only decisions that hold on a
website, in a web app, in an Android app, in an iOS app, and in anything we build next year.

**No syntax belongs in this file.** If it would only make sense in CSS, it belongs in the web
platform guide instead. That separation is the entire point — see Part 12.

Values live in [`tokens.json`](./tokens.json), in the W3C Design Tokens format. This file explains
what the values *mean* and when to reach for which one. It does not repeat them, because a document
that duplicates numbers is a document that will be wrong.

---

## How to use this

**You are an LLM asked to build or restyle something for this company.** Work in this order:

1. Read this file. It tells you what to decide.
2. Read `tokens.json`. It tells you the values.
3. Read the platform guide for your target (Part 12). It tells you how to express them.
4. Work through the checklist at the end. Report what failed rather than quietly skipping it.

**Two rules override everything else in this file:**

- **Never reference a raw palette value in a component.** Use a semantic role. `palette.emerald.500`
  is a raw material; `color.dark.brandText` is a decision. Components consume decisions.
- **Never invent a value.** Not a radius, not a spacing step, not a duration. Pick the nearest one
  that exists. If nothing fits, the answer is a new token in `tokens.json`, not a one-off number.

---

## 1. Who we are

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

## 2. The three ideas

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

## 3. Colour

### Roles, not colours

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

### The fill-versus-text distinction

Our brand colours come in pairs, and the distinction is not cosmetic:

- **`brand` / `accent`** — the saturated value. For **fills, borders and glows only.**
- **`brandText` / `accentText`** — the lighter step. For **text only.**

Putting text in `brand` is the single most common way a build of ours ends up failing contrast.
`palette.emerald.500` on a near-black surface is legible; on a white one it measures about 2.5:1 and
fails accessibility standards outright. The `-Text` variants exist to make the wrong choice hard to
reach for.

### Light mode takes a darker step

This is counter-intuitive and people get it wrong. The light-mode accent is **darker**, not lighter
than the dark-mode one. The dark-mode values are tuned for a near-black background; the same values
on white are too pale to read.

Light mode also makes **borders stronger**, not weaker. A dark border that reads as a crisp edge on
near-black disappears entirely on white.

### Text has three weights of emphasis, not two

- `text` — headings and emphasis. Too bright for body copy over a long read.
- `textBody` — the default reading colour. This is what paragraphs use.
- `textMuted` — labels, captions, timestamps, table headers. **Not for paragraphs.**

### Colour is never the only signal

Every state carried by colour is also carried by a word, an icon, a border, or a shape. This is an
accessibility requirement, not a style preference, and it applies identically on every platform.

---

## 4. Typography

### Roles, not sizes

Typography is defined as **roles** — `display`, `title`, `heading`, `bodyLarge`, `body`, `label`,
`meta`, `eyebrow`. Components use a role. They never set a size.

This matters more on mobile than anywhere else. Native platforms scale text according to the user's
own accessibility settings — iOS Dynamic Type reaches roughly 200%, and Android has its own font
scale. An app that pins pixel sizes fights the user and, eventually, clips. An app that uses
semantic styles at the right rank scales properly for free.

**The mapping rule:** each role corresponds to the platform's own semantic style of the same rank.
Display maps to a large title style. Body maps to the body style. The *rank* is ours; the *number* is
the platform's.

### The typeface changes; the roles do not

We use Geist on the web because we load it. **We do not ship Geist in a native app.** iOS users
expect the system face, Android users expect Roboto, and shipping a bundled face over the top is a
familiarity tax the user pays for our aesthetic preference.

`tokens.json` carries both: a web family and a native system stack. Use the right one.

### The details that make it look right

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

## 5. Space, radius, elevation

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

## 6. Touch and pointer

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

## 7. Motion

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

## 8. The logo

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

## 9. Voice

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

## 10. The accessibility floor

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

## 11. Do and do not

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

## 12. Platform map

This file decides *what*. The platform guide decides *how*. Read both.

| You are building | Read | Express tokens as |
|---|---|---|
| A website or web app | `DESIGN_SYSTEM.md` + this file | CSS custom properties; Tailwind theme |
| A React Native / Expo app | `PLATFORM-mobile.md` + this file | A typed object |
| A native iOS app | `PLATFORM-mobile.md` + this file | Swift |
| A native Android app | `PLATFORM-mobile.md` + this file | Kotlin |
| A Flutter app | `PLATFORM-mobile.md` + this file | Dart |
| A document, guide, or report | `DESIGN_SYSTEM.md` + this file | CSS, plus the document layout shell |

**Status of the platform guides:**

| File | State |
|---|---|
| `tokens.json` | Complete — 130 tokens, DTCG 2025.10 |
| `BRAND.md` (this file) | Complete |
| `DESIGN_SYSTEM.md` | Complete — covers web and documents |
| `PLATFORM-mobile.md` | Complete — iOS and Android, with Jetpack Compose as the primary worked path |
| `scripts/check-tokens.mjs` | Complete — run `npm run tokens:check` |

**Still not written:** platform adapter files. `adapters/` will hold the token layers for each
platform, generated from `tokens.json`, so that no screen ever hardcodes a value. `DESIGN_SYSTEM.md`
and `docs.css` currently restate the values by hand; `tokens:check` compares them and fails on
drift, but generating them is the better long-term answer.

Until adapters exist, use the worked implementations inside `PLATFORM-mobile.md` as the reference
and keep new values in `tokens.json`.

---

## 13. Verification checklist

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

*Values: [`tokens.json`](./tokens.json). Web specifics: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).
If a build disagrees with this file, this file wins.*
