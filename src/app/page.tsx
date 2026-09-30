import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProjectShowcase from '@/components/ProjectShowcase';
import TrustEngine from '@/components/TrustEngine';
import ScopeEstimator from '@/components/ScopeEstimator';
import ContactHub from '@/components/ContactHub';
import { SITE_URL } from '@/config/site';

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
  // Read here, in the server component, so the value is handed to the client
  // components as a prop instead of being inlined into the browser bundle.
  // This is a public URL, not a secret, but keeping it server-read means the
  // name can stay BOOKING_URL and nothing is exposed to the client JS.
  // Note: the homepage is prerendered, so this is resolved at build time.
  // Changing the value therefore needs a new build, which Cloudflare runs on
  // every push.
  const bookingUrl = process.env.BOOKING_URL?.trim() || undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Sticky Navigation Header with Brand Logo */}
      <Navbar bookingUrl={bookingUrl} />

      <main>
        {/* 2. Above-The-Fold Hero Section */}
        <Hero />

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