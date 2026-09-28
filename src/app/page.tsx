import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProjectShowcase from '@/components/ProjectShowcase';
import TrustEngine from '@/components/TrustEngine';
import ScopeEstimator from '@/components/ScopeEstimator';
import ContactHub from '@/components/ContactHub';

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