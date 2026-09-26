import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProjectShowcase from '@/components/ProjectShowcase';
import TrustEngine from '@/components/TrustEngine';
import ScopeEstimator from '@/components/ScopeEstimator';
import ContactHub from '@/components/ContactHub';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Sticky Navigation Header with Brand Logo */}
      <Navbar />

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
        <ContactHub />
      </main>
    </div>
  );
}