import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProjectShowcase from '@/components/ProjectShowcase';
import TrustEngine from '@/components/TrustEngine';
import ScopeEstimator from '@/components/ScopeEstimator';
import ContactHub from '@/components/ContactHub';
import { SITE_URL, BOOKING_URL } from '@/config/site';

/**
 * The homepage's own share tags.
 *
 * These live here rather than in the root layout on purpose. Anything
 * route-specific declared in the root layout is inherited by every other
 * route that does not override it, which is how /privacy ended up
 * advertising a canonical URL and an image belonging to this page. See
 * the note in src/app/layout.tsx.
 *
 * Absolute URLs, not relative ones. Relative image paths are ignored by
 * WhatsApp, LinkedIn and X, and the result is a bare link with no card.
 * The explicit width and height let a platform lay the card out before
 * the image has downloaded.
 */
export const metadata: Metadata = {
  // Resolved against metadataBase, and Next normalises the result to
  // `https://get-tech-solutions.dammieoptimus.workers.dev` with no trailing
  // slash. Passing an explicit absolute URL with a slash does not change
  // this; the root is always normalised. The home page's <loc> in
  // sitemap.xml uses the conventional slashed form, so the two differ by
  // one character. That is deliberate and harmless: the root returns 200
  // with no redirect, and Google treats the slashed and unslashed root as
  // the same URL. Forcing them to match would mean a site-wide
  // trailingSlash config change to settle a detail the specification
  // already handles.
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: SITE_URL,
    siteName: 'Dammie Optimus Solutions',
    title: 'Dammie Optimus Solutions | AI, Web & Mobile Software Engineering',
    description:
      'AI automations, web applications and mobile software engineered to be fast, reliable and built around the way your business actually runs.',
    images: [
      {
        url: '/assets/og-homepage.png',
        width: 1200,
        height: 630,
        alt: 'Dammie Optimus Solutions — AI, web and mobile software engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dammie Optimus Solutions | AI, Web & Mobile Software Engineering',
    description:
      'AI automations, web applications and mobile software engineered to be fast, reliable and built around the way your business actually runs.',
    images: ['/assets/og-homepage.png'],
  },
};

export default function Home() {
  /**
   * The booking link, taken from src/config/site.ts rather than read from the
   * environment here.
   *
   * It used to be `process.env.BOOKING_URL || undefined`, and that quietly
   * did nothing: the variable was never set in the build, so both consumers
   * silently degraded. The navbar's booking link became a scroll to the
   * contact form, and the form's booking button became a WhatsApp link. No
   * error anywhere, and the calendar URL still appeared on the page — inside
   * the JSON-LD, coming from the fallback in that same file. Which is why it
   * looked configured when it was not doing anything.
   *
   * src/config/site.ts is the single source of truth and already prefers the
   * environment variable when it happens to be set, so setting BOOKING_URL in
   * .env.local still works. This just removes the dependency on anyone
   * remembering to.
   */
  const bookingUrl = BOOKING_URL;

  // HERO_MAGIC turns the closing line and its explosion on or off.
  //
  // Read here, on the server, because it is a build-time value and must be
  // resolved during the build rather than reached for in the browser. It is
  // not a secret — it only decides what to render, and is handed to Hero as a
  // boolean.
  //
  // Set it in .env.local, NOT .dev.vars: next build reads .env.local and
  // ignores .dev.vars entirely, which is for Worker secrets such as
  // RESEND_API_KEY.
  //
  // Defaults to ON when unset. Set to 'off' for the original type-pause-delete
  // loop with none of the extra stages, which needs a rebuild to take effect.
  const heroMagic = (process.env.HERO_MAGIC?.trim() || 'on').toLowerCase() !== 'off';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Sticky Navigation Header with Brand Logo */}
      <Navbar bookingUrl={bookingUrl} />

      <main>
        {/* 2. Above-The-Fold Hero Section */}
        <Hero magic={heroMagic} />

        {/* 3. Bento-Grid Project Showcase */}
        <ProjectShowcase />

        {/* 4. Trust & Credibility Engine */}
        <TrustEngine />

        {/* 5. Interactive Client Delighter (Scope & Cost Estimator) */}
        <ScopeEstimator />

        {/* 6. Frictionless Contact Hub with Footer */}
        <ContactHub bookingUrl={bookingUrl} />
      </main>
    </div>
  );
}