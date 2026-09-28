# Dammie Optimus Solutions — Platform & Portfolio

> Engineering high-performance AI workflow automations, full-stack web applications, and cross-platform mobile solutions.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Resend](https://img.shields.io/badge/Resend-Email_API-000000?style=flat-square&logo=resend&logoColor=white)](https://resend.com/)

**[🌐 Visit the live site](https://get-tech-solutions.dammieoptimus.workers.dev/)** ·
**[📚 Document hub](https://get-tech-solutions.dammieoptimus.workers.dev/docs.html)** ·
**[📘 App documentation](https://get-tech-solutions.dammieoptimus.workers.dev/app-documentation.html)**

---

## 📖 Documentation

This project is fully self-documenting. Every guide is written in plain English and
served as a static page — no build step, so the live copies are always current.

| Document | What it covers |
| --- | --- |
| **[App Documentation](https://get-tech-solutions.dammieoptimus.workers.dev/app-documentation.html)** | The complete 30-section reference: what the app is, every file, every field, the pricing formula, email delivery, deployment, rollback, recipes, and the problems already solved |
| **[Brand Guidelines](https://get-tech-solutions.dammieoptimus.workers.dev/brand-guidelines.html)** | The definitive design reference — logo geometry, colours with real contrast ratios, type scale, spacing, radii, motion and brand voice |
| **[Email Delivery Guide](https://get-tech-solutions.dammieoptimus.workers.dev/email-delivery-guide.html)** | How the contact form sends email, and how to move onto your own sending domain |
| **[Google Calendar Booking](https://get-tech-solutions.dammieoptimus.workers.dev/google-calendar-booking.html)** | How to build the booking page the buttons open, with automatic Meet links |

Local copies live in [`public/`](./public) and are served as-is. The shared design
system is in [`public/assets/docs.css`](./public/assets/docs.css) and the shared
behaviour (theme, contents highlighting, copy buttons, print) is in
[`public/assets/docs.js`](./public/assets/docs.js).

> **Housekeeping rule:** every change to how the app behaves updates the App
> Documentation and this README in the same commit. The documentation is a living
> document, not an archive.

---

## ⚡ What the app does

A single-page marketing site whose job is to turn a visitor into a booked call.

- **Typewriter hero engine** — a zero-dependency React effect cycling twelve
  engineering specialities, with reserved headline height so nothing shifts.
- **Bento-grid case study showcase** — five projects, each with a
  problem → solution → result drawer, a category filter, and a full preview modal
  supporting live iframes, desktop/mobile device frames, and YouTube video
  walkthroughs.
- **YouTube facade pattern** — video previews load a thumbnail first and only
  create the player on click, avoiding ~1 MB of player JavaScript and any tracking
  request for videos that are never watched.
- **Multi-currency scope estimator** — a working calculator that produces a real
  price range and timeline in **₦ NGN** and **$ USD** from a single data file,
  with nothing pre-selected that the visitor did not choose.
- **Estimate → contact bridge** — "Lock In This Estimate" writes the full
  calculation straight into the contact form via a custom browser event, so a
  visitor never retypes anything.
- **Trust engine** — a transparent four-step delivery roadmap, three written
  client guarantees, and testimonials.
- **Dual-channel contact hub** — real calendar booking, direct WhatsApp, and a
  brief form that delivers a branded, one-click-replyable email through a Next.js
  route handler and the Resend API. Every failure path falls back to WhatsApp, so
  a lead can never be silently lost.
- **Tactile theme system** — dark/light toggle via `next-themes` with the saved
  choice applied before first paint, so there is no flash of the wrong theme.

---

## 🛠️ Technology stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.3.6 (App Router, Server Components, Route Handlers) |
| UI runtime | React 19.2.8 |
| Language | TypeScript 5.9.3 (strict mode) |
| Styling | Tailwind CSS 4.3 |
| Icons | lucide-react |
| Theming | next-themes |
| Email | Resend |
| Hosting | Cloudflare Workers, via `@opennextjs/cloudflare` 1.20.6 + Wrangler 4.141 |

There is **no database, no user account system, no CMS, and no analytics or
tracking**. The only data stored in a visitor's browser is their light/dark theme
preference.

---

## 🚀 Local development

**Prerequisites:** Node.js 24+ (`node -v`) and npm. A free Cloudflare account is
only needed for the production preview or for deploying by hand.

```bash
# 1. Clone the repository
git clone https://github.com/EngrDammie/portfolio-site.git

# 2. Enter the project directory
cd portfolio

# 3. Install dependencies
npm install

# 4. Create a .env.local file in the project root (see below)

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create `.env.local` (for `npm run dev`) and/or `.dev.vars` (for the Cloudflare
preview) in the project root. **Both files are already excluded from Git — never
remove that protection, and never paste a real key anywhere else.**

| Variable | Required? | Kind | Notes |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | For the contact form | **Secret** | Never commit. In production it lives in the Cloudflare dashboard as an encrypted secret. Read at runtime, so changes apply immediately. |
| `BOOKING_URL` | No | Plain text | Your public calendar appointment page. Without it the booking buttons fall back to the contact section and WhatsApp automatically. Read at **build time**, so changing it needs a new build. |

```bash
# .env.local — never commit this file
RESEND_API_KEY=re_your_key_here
BOOKING_URL=https://calendar.app.google/your-id
```

### Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run lint` | Lint (Next.js core-web-vitals + TypeScript rules) |
| `npx tsc --noEmit` | Type check without emitting files |
| `npm run preview` | Build for Cloudflare and run the real Worker locally |
| `npm run deploy` | Build and publish to the live site |
| `npm run upload` | Build and upload **without** switching live traffic |
| `npm run cf-typegen` | Regenerate Cloudflare TypeScript definitions |

---

## ☁️ Deployment

Hosting is **Cloudflare Workers**, reached through OpenNext. `npm run deploy`
chains three steps: the Next.js build, the OpenNext translation to a Worker plus
static assets, and the Wrangler upload.

- **Automatic (recommended):** pushing to `main` triggers a full build and deploy
  in the Cloudflare dashboard. No credentials needed on your machine.
- **Manual:** `npm run deploy` or `npm run upload`.

Both commands pass `--keep-vars`, which tells Wrangler to leave your dashboard
variables and secrets untouched. That is what makes it safe to deploy from a
machine that holds no secrets at all.

**Never put a key in `wrangler.jsonc`.** That file is committed to a public
repository. Secrets belong in the Cloudflare dashboard's encrypted store, and
plain-text settings belong in `.env.local` / `.dev.vars`.

To roll back a bad deploy, promote the previous version in the Cloudflare
dashboard's deploy history, then fix the cause with a `git revert`.

---

## 📁 Project structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Shell: fonts, metadata, theme provider
│   │   ├── page.tsx              # Home page: reads BOOKING_URL, assembles sections
│   │   ├── globals.css           # Root type scale + the light-mode colour engine
│   │   ├── icon.svg              # Browser tab icon (DO monogram)
│   │   └── api/contact/route.ts  # The only API endpoint: validate + send via Resend
│   ├── components/               # Navbar, Hero, ProjectShowcase, TrustEngine,
│   │                             # ScopeEstimator, ContactHub, Typewriter,
│   │                             # ThemeToggle, ThemeProvider, DOMonogram
│   └── data/
│       ├── projectsConfig.ts     # The five case studies
│       └── pricingConfig.ts      # Currencies, project types, stages, add-ons
├── public/                       # Served as-is; no build step
│   ├── docs.html                 # Document hub
│   ├── app-documentation.html    # The 30-section reference
│   ├── brand-guidelines.html
│   ├── email-delivery-guide.html
│   ├── google-calendar-booking.html
│   ├── assets/docs.css           # Shared document design system
│   └── assets/docs.js            # Shared document behaviour
├── open-next.config.ts           # Cloudflare build target
├── wrangler.jsonc                # Worker config (name, flags, bindings, logging)
└── next.config.ts
```

---

## 🧭 Sections and their anchors

| Section | Anchor | Source file |
| --- | --- | --- |
| Sticky navigation | — | `src/components/Navbar.tsx` |
| Hero and rotating headline | — | `src/components/Hero.tsx` |
| Case study showcase | `#projects` | `src/components/ProjectShowcase.tsx` |
| Process and guarantees | `#process` | `src/components/TrustEngine.tsx` |
| Scope and cost estimator | `#estimator` | `src/components/ScopeEstimator.tsx` |
| Contact and footer | `#contact` | `src/components/ContactHub.tsx` |

---

## 📬 Contact

- **Lead engineer:** Dammie Optimus
- **Email:** [dammieoptimus@gmail.com](mailto:dammieoptimus@gmail.com)
- **WhatsApp:** [+234 705 333 1253](https://wa.me/2347053331253)
- **Book a discovery call:** [pick a slot](https://calendar.app.google/QD12aQUafCYhjnhz6)
- **Hours:** West Africa Time (WAT / GMT+1) — available for remote contracts worldwide

---

## 🔒 Known gaps

Documented honestly in the App Documentation rather than hidden:

- The two testimonials are placeholder copy, not real client feedback.
- Two category filters currently match no projects.
- No privacy policy page, despite the form collecting names, emails and phone numbers.
- No social sharing image, so shared links show a bare URL.
- The contact form has no captcha, honeypot, or rate limiting, and does not escape
  visitor-supplied text before inserting it into the notification email.

---

© 2026 Dammie Optimus Solutions. All rights reserved.
