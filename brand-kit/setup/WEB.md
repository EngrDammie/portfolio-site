# Web — brand setup

You are applying the Dammie Optimus Solutions brand to this project. Work through this file in order
and finish all of it. Several rules below prevent failures that produce **no error message at all**,
so "it renders" is not evidence that you followed them.

Read `brand-kit/VERSION` and report both of its values at the end.

## 1. Read these, in this order

1. `brand-kit/shared/BRAND.md` — what the brand is and why. Decisions, not values.
2. `brand-kit/shared/tokens.json` — the exact values, for any number this file does not give you.
3. `brand-kit/web/DESIGN_SYSTEM.md` — the web implementation, and its checklist at the end. This is
   the spec; where it and your instincts disagree, it wins.
4. `brand-kit/web/web.css` — the generated token layer. **Never edit this file.**

## 2. Wire it up

### 2.1 Import the token layer once, at the root

```css
@import 'brand-kit/web/web.css';
```

Or import it from your global stylesheet entry point. It defines the custom properties on `:root`
and the dark scheme; nothing else is needed.

If your build genuinely cannot take an extra stylesheet, paste the `:root` block out of
`DESIGN_SYSTEM.md` instead. That block is checked against `tokens.json`, so it cannot drift. Do not
mix the two conventions inside one component.

### 2.2 Reference tokens, never raw values

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

### 2.3 Tailwind

The token values *are* stock Tailwind colours, so no configuration is needed. Both styles are
correct. Mixing them inside one component is not.

## 3. Rules that override anything you would otherwise choose

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

## 4. Check every one of these before you report

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

## 5. Report back

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
