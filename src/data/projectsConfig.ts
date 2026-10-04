/**
 * A single supplementary reference link shown on a project card, rendered
 * above the tech stack.
 *
 * Use these for anything a prospect would want to click that is not already
 * covered by `liveUrl` or `githubUrl` — a case study write-up, a demo
 * recording, a documentation page, a related project. The `subtext` is what
 * makes them useful: it says where the link goes, so the visitor does not
 * have to open it to find out.
 */
export interface LinkItem {
  /** Short, human label for the link. Keep it to a few words. */
  title: string;
  /**
   * One sentence in smaller type explaining where this link goes and what it
   * does. This is the whole reason the link exists, so keep it concrete
   * rather than restating the title.
   */
  subtext: string;
  /** Absolute URL, including the https:// scheme. Opened in a new tab. */
  href: string;
}

/**
 * A screenshot shown inside the project preview, with a caption.
 *
 * The caption is not decoration. A visitor who cannot see the interface needs
 * to be told what they are looking at and why it matters, so `caption`
 * states what the screen demonstrates. `kind` decides the aspect ratio and
 * framing: a phone screenshot is tall and must not be cropped into a
 * letterbox, while a desktop capture is wide.
 */
export interface ScreenshotItem {
  /** What this screen shows. Plain language, no marketing. */
  caption: string;
  /** Absolute URL to the image, including the https:// scheme. */
  src: string;
  /** Intrinsic width in pixels, used to stop layout shift while loading. */
  width: number;
  /** Intrinsic height in pixels. */
  height: number;
  /** Framing. "phone" is a tall device capture; "document" is a landscape page. */
  kind: 'phone' | 'document';
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'AI & Automation' | 'Full-Stack Web App' | 'Mobile App' | 'Business Website';
  summary: string;
  problem: string;
  solution: string;
  result: string;
  metric: string;
  techStack: string[];
  /**
   * Optional supplementary links, rendered above the tech stack with a link
   * icon. Omit the field entirely (or use an empty array) when a project has
   * nothing extra worth linking to.
   */
  links?: LinkItem[];
  /**
   * Optional screenshots, rendered inside the preview panel beneath the
   * project copy. Used instead of an iframe when there is no live site to
   * frame — a native APK has no URL, so the screenshots are the only honest
   * thing the preview can show.
   */
  screenshots?: ScreenshotItem[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  // Interactive Preview Parameters
  previewType: 'iframe' | 'video' | 'interactive-mock';
  previewUrl?: string;
  /**
   * YouTube video ID only — e.g. "EjhFWjsLDcA" from
   * https://youtu.be/EjhFWjsLDcA
   * The thumbnail and embed URLs are derived from this in ProjectShowcase, so
   * there is no URL format to get wrong. Do NOT store a full share or watch
   * URL here: those refuse to be framed.
   */
  videoId?: string;
}

export const SHOWCASE_PROJECTS: ProjectItem[] = [
  {
    id: 'starium-erp',
    title: 'Starium Rafa Detergent App: Real-Time Factory ERP & Quality Control Platform',
    category: 'Full-Stack Web App',
    summary: 'An offline-first, real-time, role-governed factory ERP that turns paper-based QC and production tracking into live, real-time dashboards across 21 modules.',
    problem: 'From inside a Quality Control role at a detergent plant, I watched every sachet check, density reading, silo level, machine stoppage and waste slip get logged on paper that rarely resurfaced. Silos drained silently until the line stopped, stopped machines went unreported, and waste went unmeasured — managers made decisions from memory, not data.',
    solution: 'I designed and built the entire platform solo as a React single-page application on a Firebase back end — 21 interconnected modules spanning QC sachet and density checks, empty-silo alerts, machine downtime logs, carton and laminate waste recording, pallet transfers with Day vs Night comparison reports, and a Command Centre for live plant-wide visibility. Real-time subscriptions, Firestore security rules for role-based access, and a fully offline-first sync engine keep the factory floor recording even when connectivity drops. Deployed on triple-redundant hosting at zero licence cost.',
    result: 'The platform now runs live in a personal test environment, awaiting only management approval to enter daily operations. Every production station can log a check in seconds, supervisors get a live command centre instead of paper piles, and managers gain data-driven insight into uptime, waste and QC — all maintained by one developer with no licence spend.',
    metric: '21 Modules',
    techStack: ['React', 'JavaScript', 'Firebase Auth', 'Cloud Firestore', 'Firestore Security Rules', 'Cloudflare Workers'],
    links: [
      {
        title: 'Watch the factory walkthrough',
        subtext: 'A screen recording of the Command Centre and the quality-control modules running on a real plant floor.',
        href: 'https://www.youtube.com/watch?v=EjhFWjsLDcA',
      },
    ],
    liveUrl: 'https://starium-app.dammieoptimus.workers.dev/',
    featured: true,
    previewType: 'video',
    videoId: 'EjhFWjsLDcA'
  },
  {
    id: 'quickreceipt',
    title: 'QuickReceipt: Offline PDF Receipts & WhatsApp Sharing for Retail Merchants',
    category: 'Mobile App',
    summary:
      'A native Android app that turns a merchant and their customer into a professional, ink-friendly PDF receipt in seconds — then shares it straight to WhatsApp or sends it to a thermal or office printer, with every sale tracked offline on the device.',
    problem:
      'Small retailers, Instagram vendors and gadget stores issue receipts by hand or in a generic invoicing app that wants an account, a subscription and a connection. The merchant retypes the same store details and the same fast-moving products into every single sale, and if the network drops mid-transaction the record is simply lost — which for a business with no back office means the day’s takings live in memory until someone counts the drawer. Sending the customer a receipt is worse: photographing a paper one produces a blurry, skewed photo that looks unprofessional and quietly damages the brand the merchant is trying to build.',
    solution:
      'Built a 100% Kotlin, Jetpack Compose application that removes the account, the subscription and the network entirely. A Room database holds receipts, the merchant profile and a fast-moving inventory shortcut list, so the store name, address, phone and return policy are saved once and pre-saved products load in a single tap instead of being retyped. Receipt creation is a dynamic repeatable item list with live subtotal, discount and total calculation, quantity steppers, and one-tap shortcut chips for the products that actually sell. The PDF engine draws an A4 vector document natively through android.graphics.pdf.PdfDocument — pure black text on white with clean vector outlines rather than filled dark blocks, because a receipt is printed on paper and thermal stock where every filled block is wasted ink and a blurred thermal print. Documents are written to the app’s private cache and shared through the system sheet as application/pdf via FileProvider, or sent straight to a Wi-Fi, Bluetooth or USB printer through PrintManager. A dashboard surfaces total sales today, revenue split by cash, transfer and card, and a searchable receipt history with re-share, re-print and delete. Room keeps the whole app offline-first, so a dead network costs nothing.',
    result:
      'A merchant issues a branded, professional receipt in under a minute without creating an account, paying a subscription or needing a connection — and the customer receives it as a clean PDF on WhatsApp instead of a crooked photo. Because the store profile and top products are saved once, repeat sales need no retyping at all, and every receipt keeps the merchant’s own name, address and return policy on the document. The ink-friendly vector layout prints legibly on 58mm thermal rolls and ordinary A4 alike. Everything is stored on the device, so daily takings and customer records remain complete and searchable with no server to go down, no data to migrate and nothing to maintain.',
    metric: '100% Offline · No Account Needed',
    techStack: [
      'Kotlin',
      'Jetpack Compose',
      'Material Design 3',
      'Android Room Database',
      'MVVM + StateFlow',
      'android.graphics.pdf.PdfDocument',
      'Android FileProvider',
      'PrintManager',
      'Jetpack Navigation',
    ],
    links: [
      {
        title: 'Get the Android app',
        subtext: 'Screenshots, what it does, how to install it, and a SHA-256 checksum so you can confirm the file is exactly the one I built.',
        href: '/quickreceipt-android.html',
      },
      {
        title: 'Download the APK directly',
        subtext: 'QuickReceipt_base.apk, 22.3 MB. One signed file, no sign-up and nothing to install alongside it.',
        href: 'https://www.dropbox.com/scl/fi/56sok2d8lz3zztsmv17u3/QuickReceipt_base.apk?rlkey=3o2ftoamdapsq4n2xntxanf9l&st=n1al79vd&dl=1',
      },
    ],
    screenshots: [
      {
        caption:
          'The dashboard opens on today’s takings: total sales for the day, the revenue split across cash, transfer and card, and a searchable log of every receipt issued.',
        src: '/assets/quickreceipt/dashboard.jpg',
        width: 576,
        height: 1280,
        kind: 'phone',
      },
      {
        caption:
          'The finished output — a vector PDF receipt carrying the merchant’s branding, itemised lines, discount and total, ready to send to the customer or hand to a printer.',
        src: '/assets/quickreceipt/receipt-pdf.png',
        width: 878,
        height: 582,
        kind: 'document',
      },
    ],
    liveUrl: '/assets/quickreceipt/dashboard.jpg',
    featured: true,
    previewType: 'iframe',
    previewUrl: '/assets/quickreceipt/receipt-pdf.png'
  },
  {
    id: 'rafa-voucher-attendance',
    title: 'Rafa Voucher: Shift Attendance & Voucher Pay Tracker',
    category: 'Mobile App',
    summary:
      'A zero-dependency, single-file web app that lets rotating shift workers track attendance, missed days, streaks, and voucher-cycle payouts on their phone — with the period math and pay-day attribution handled automatically. I also created the Android version of this app.',
    problem:
      'Nigerian shift workers on 2-2-2 and similar rotating rosters (security, oil & gas, facilities management) were calculating voucher attendance by hand on paper. Every cycle they had to hand-tally worked, missed and off days, convert that into an attendance percentage, work out when their pay day landed relative to the 20th-to-19th voucher cycle, and then argue the arithmetic with payroll when a single unmarked absence quietly docked a month of pay. One mis-tallied day was expensive, the record was fragile and easy to lose, and the tools that could do this properly were heavy web apps that demanded an account, a login, a live connection and a monthly subscription — none of which survive a site with no network, where the roster is actually kept.',
    solution:
      'Built a zero-dependency, single-file HTML application (no framework, no build step, no backend, no sign-up) that models a roster as dated shift segments layered over a user-chosen anchor date, so any schedule works: 2-2-2 out of the box, or 3-3-3, 1-1-1, 6M/1OFF, or a hand-built M/N/OFF chip pattern — with days before the anchor wrapping backward so history is never rewritten. It derives each voucher period automatically (20th to the 19th), colour-codes every M/N/OFF day, lets the user mark a day missed, and recomputes present, missed and off counts, attendance percentage, and a backward-walking present-day streak on every tap. A payment recorder captures the Naira amount and the day the money landed, and because a company always pays for the *previous* cycle, it attributes the payment to that prior voucher period — showing exactly which period it settles, the amount, and an inclusive days-to-pay count — while deliberately never altering the current period’s attendance. Period navigation works through arrows and touch swipe, the period label opens a tappable M/N/OFF/present/missed breakdown tooltip, and data is portable via JSON export/import, CSV export, full reset, and a persisted light/dark theme.',
    result:
      'Manual voucher arithmetic is gone. A worker records a pay day once and immediately sees which cycle it settles, how much was paid, and how many days it took to be paid — while attendance, percentage and streak stay correct in real time instead of being reconciled at the end of the month. Because the app makes zero network calls and keeps all state in localStorage, there is no account to create, no server to go down and no subscription to maintain: the entire product is one HTML file that loads instantly on a mid-range Android over a weak signal and keeps working with no connection at all. JSON and CSV export make the record portable and auditable for payroll disputes, and a missed shift can no longer slip through unnoticed and quietly cost a month of pay.',
    metric: 'Zero Backend · 100% Client-Side',
    techStack: [
      'Vanilla JavaScript (ES6)',
      'HTML5',
      'Tailwind CSS (CDN)',
      'CSS Keyframes & Dark-Mode Overrides',
      'localStorage API',
      'Google Fonts (Poppins)',
      'Cloudflare Pages'
    ],
    links: [
      {
        title: 'Download the Android app',
        subtext: 'The native Android build of this tracker, as a signed APK with a checksum you can verify.',
        href: '/rafa-voucher-android.html',
      },
    ],
    liveUrl: 'https://rafavoucherapp.dammieoptimus.workers.dev/',
    featured: true,
    previewType: 'iframe',
    previewUrl: 'https://rafavoucherapp.dammieoptimus.workers.dev/'
  },
  {
    id: 'tgr-playbook',
    title: 'TGR Playbook: Offline Field Manual for a Telecoms-Based Network Marketing Team',
    category: 'Mobile App',
    summary: 'An installable, offline-first training app that turns a hand-distributed WhatsApp playbook into 24 searchable how-to guides, three purpose-built business tools, and a 10-level earnings projection engine for Top Up and Get Reward (TGR) field agents. An Android mobile app that exactly mirrors the functionality of the web app, was also created.',
    problem: 'TGR field agents were being onboarded from a single static playbook PDF shared through WhatsApp groups — unversioned, unsearchable, and permanently buried in chat threads. A recruit who missed the material, or an agent who needed one answer mid-transaction (resetting a password while a customer waits on the line), had no reliable reference and escalated to the admin. The business-critical knowledge — how to frame packages, welcome a new downline, and understand the income opportunity — lived almost entirely in the founder\'s personal messages rather than in any durable, shareable system.',
    solution: 'Built a zero-dependency, installable PWA in ~1,300 lines of vanilla ES-module JavaScript: 24 structured guides held in a single JSON source of truth and rendered into a searchable accordion, backed by a versioned service worker for complete offline operation on low-end Android and patchy data. Every guide carries a "Copy for WhatsApp" action so knowledge flows back into the group chats it came from. Layered on top are three real tools — a registration toolkit, a dual-mode welcome/upgrade announcement generator, and a "Fantastic 10" projection engine that models all six packages (₦10k–₦100k) across 10 levels with per-level commission tiers, PV earning caps and leadership-incentive thresholds (trip, car, house funds) — complete with number-to-words conversion for Nigeria. Referral-aware deep links (?fullname / ?refid) let a sponsor onboard a new member with their personal playbook link and referral ID pre-filled, while a conditional Web Share / WhatsApp fallback button preserves sponsor attribution without leaking the previous user\'s name badge.',
    result: 'Shipped as the community\'s canonical onboarding reference at one permanent URL: 24 guides, 3 working tools, zero installs, zero build step and zero app-store dependency. New recruits now land on a pre-personalized profile badge with their sponsor\'s referral ID already inserted into the registration link, and onboarding announcements are generated in seconds instead of hand-typed. Because the entire app is cached locally, agents use it in the field on 2G and with no data at all — and Firebase Firestore snapshots surface live click and visit counters, turning adoption from an assumption into a measured number. Page tracking ships behind a remote kill-switch in the content file, so telemetry can be disabled without a redeploy.',
    metric: '24 Guides · 3 Live Tools · 100% Offline',
    techStack: [
      'Vanilla JavaScript (ES Modules)',
      'HTML5 & CSS3',
      'PWA / Service Worker',
      'Cloudflare Workers',
      'Firebase Firestore',
      'Google Tag Manager',
      'Web Share & Clipboard APIs',
      'Font Awesome'
    ],
    links: [
      {
        title: 'Download the Android app',
        subtext: 'The native Android build of this field manual, as a signed APK with a checksum you can verify.',
        href: '/tgr-playbook-android.html',
      },
    ],
    liveUrl: 'https://tgr-playbook.dammieoptimus.workers.dev/',
    featured: true,
    previewType: 'iframe',
    previewUrl: 'https://tgr-playbook.dammieoptimus.workers.dev/'
  },
  {
    id: 'bible-plans',
    title: 'Scripture Path: Interactive Bible Reading Plans',
    category: 'Full-Stack Web App',
    summary: 'Three self-contained, offline-capable web apps that turn Bible reading into a trackable daily habit, with 15 selectable Bible translations, per-chapter deep links, and dual canonical and chronological orderings.',
    problem: 'I wanted a structured way to read the entire Bible, but every plan I found was either a static PDF, a paywalled app, or a spreadsheet that lost my progress the moment I closed the tab. Existing plans also assumed you already know which translation to use, offered only one reading order, and gave no sense of how heavy a given chapter was before you committed to it, so I kept losing momentum and restarting from scratch.',
    solution: 'I designed and built three matching single-file apps from scratch — a 30-day New Testament plan, a 120-day Old Testament plan, and a 365-day full-Bible plan — each shipping both a canonical and a chronological ordering so the Gospels can be read in narrative sequence or book order. Every daily reading string is parsed at runtime and expanded into individual clickable chapter pills that deep-link straight into the selected translation, each color-coded green through red by verse count and annotated with a hover tooltip pulled from an embedded 1,189-chapter dataset covering all 66 books, so difficulty is visible before reading begins. Progress is written to localStorage under app-scoped key prefixes, and a reset control clears only its own namespace, so the three plans never clobber each other. I also added per-day copy-to-clipboard for sharing a reading with friends, deep links of the form ?plan=chronological&day=183 that auto-switch tabs and flash the target card, and throttled scroll memory that restores your exact position on return. The entire thing runs on vanilla HTML, CSS, and JavaScript with no framework, no build step, and no backend, so each plan is a single file that works offline and loads in under a second.',
    result: 'Converted an abandoned reading habit into a sustained daily practice, tracking 515 scheduled reading days across the three plans. Because there is no account, login, or server, a reader can open a single HTML file, start reading immediately, and keep their progress indefinitely. The translation selector broadened the audience considerably by supporting 15 versions including EasyEnglish, AMP, the Message, and Yoruba, Hausa, Igbo, and French translations, and the dual orderings let me read the Gospels chronologically without abandoning the full-Bible run. The zero-dependency architecture means the entire project is maintainable by editing one file, and the same duplicated app shell now lets a new plan be added by changing a single data array.',
    metric: '1,189 Chapters Mapped',
    techStack: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Local Storage API', 'CSS Grid & Flexbox', 'Google Fonts', 'bible.com API', 'Google Tag Manager'],
    links: [
      {
        title: 'Old Testament in four months',
        subtext: 'The 120-day Old Testament plan, with the same 15 translations and both reading orderings.',
        href: 'https://bible-plans.dammieoptimus.workers.dev/old_testament_in_four_months',
      },
      {
        title: 'Complete Bible in a year',
        subtext: 'The 365-day full-Bible plan, colour-coded by reading weight so you can pace yourself.',
        href: 'https://bible-plans.dammieoptimus.workers.dev/complete_bible_in_a_year',
      },
    ],
    liveUrl: 'https://bible-plans.dammieoptimus.workers.dev/',
    featured: false,
    previewType: 'iframe',
    previewUrl: 'https://bible-plans.dammieoptimus.workers.dev/'
  },
  {
    id: 'tgr-epin-formatter',
    title: 'TGR EPIN Formatter: Instant Recharge Card Formatter',
    category: 'Full-Stack Web App',
    summary:
      'A zero-backend, browser-only parser that converts raw TGR Telecoms EPIN dumps into print-ready 58mm thermal-printer voucher cards and shareable branded card images in a single click.',
    problem:
      'Top-Up and Get Reward (TGR) Telecoms delivers EPINs as a raw, unstructured wall of interleaved PINs and network names. Agents had to hand-rebuild every voucher line by line — company, network, denomination, USSD load code, 4-digit PIN grouping, plus a dash separator manually measured to fit the printer character width. A 200-PIN batch meant roughly 3 hours of repetitive typing, and because every EPIN is a single-use, redeemable airtime PIN, one mistyped digit silently voids the card along with the stock behind it.',
    solution:
      'Built a zero-dependency, single-page parsing engine that runs entirely client-side. It tokenizes the pasted text, validates each 15–17 digit token against its trailing network name, regroups PINs into scannable 4-digit blocks, and emits a print-ready voucher with a configurable separator width. A pipe-delimited command syntax — "Company | Advert | 40", plus a lean "40B" barebones mode — drives the entire card layout from a single field, while html2canvas renders network-logo-branded cards straight to PNG for WhatsApp delivery. Nothing is uploaded; the EPINs never leave the browser.',
    result:
      'Reduced a 200-PIN batch from roughly 3 hours of manual retyping to under five seconds of one-click processing, with zero misprints and no PIN data ever transmitted off-device. Deployed on Cloudflare Workers, the tool is now used in-house and shared across the agent network, and doubles as a lead magnet for custom printer and application commissions over WhatsApp.',
    metric: '< 5s Per 200-PIN Batch',
    techStack: [
      'HTML5',
      'CSS3 Custom Properties',
      'Vanilla JavaScript',
      'html2canvas',
      'Cloudflare Workers',
      'Google Tag Manager',
    ],
    liveUrl: 'https://rechargepinformatter.dammieoptimus.workers.dev/',
    featured: false,
    previewType: 'iframe',
    previewUrl: 'https://rechargepinformatter.dammieoptimus.workers.dev/',
  },
];
