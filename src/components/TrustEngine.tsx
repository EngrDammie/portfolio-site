'use client';

import React from 'react';
import {
  Search,
  PenTool,
  Code,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  Star,
  Check,
} from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Technical Discovery',
    icon: Search,
    duration: 'Days 1 – 3',
    description: 'We unpack your business bottlenecks, finalize feature scope, map database architectures, and eliminate guesswork before writing code.',
  },
  {
    step: '02',
    title: 'Prototype & Blueprint',
    icon: PenTool,
    duration: 'Week 1',
    description: 'You get an interactive wireframe or clickable preview. You see and approve the exact interface and workflow before core development begins.',
  },
  {
    step: '03',
    title: 'Engineering & Integration',
    icon: Code,
    duration: 'Weeks 2 – 4',
    description: 'High-speed development using Next.js, AI APIs, and payment engines. You get private weekly preview links so you can test features as they are built.',
  },
  {
    step: '04',
    title: 'Deployment & 30-Day Support',
    icon: Rocket,
    duration: 'Launch Day +',
    description: 'We launch on production servers, set up your custom domain, hand over full code ownership, and provide 30 days of complimentary bug-fix support.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Tunde Adebayo',
    role: 'Managing Director, Apex Logistics',
    comment: 'The order processing automation he built cut our daily spreadsheet reconciliation time from 3 hours to 10 minutes. Delivered 4 days ahead of schedule.',
    rating: 5,
  },
  {
    name: 'Sarah Jenkins',
    role: 'Founder, CloudFlow Digital (UK)',
    comment: 'Flawless communication and extremely clean code. He understood our AI workflow requirements instantly and provided weekly Loom video updates.',
    rating: 5,
  },
];

export default function TrustEngine() {
  return (
    <section id="process" className="w-full max-w-5xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
      
      {/* 1. Header */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-3">
          <ShieldCheck className="w-4 h-4" />
          Predictable & Transparent Process
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          How We Bring Your Software to Life
        </h2>
        <p className="mt-2.5 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          No disappearing acts, no surprise invoices, and no messy handoffs. A structured 4-step engineering roadmap.
        </p>
      </div>

      {/* 2. Four-Step Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {WORKFLOW_STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.step}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-800 select-none">
                    {step.step}
                  </span>
                </div>

                <div className="inline-block text-[12px] font-semibold text-emerald-400/90 uppercase tracking-wider mb-1">
                  {step.duration}
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Client Peace-of-Mind Guarantees */}
      <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 mb-16">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-6 text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          The Client Protection Guarantee
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">100% Code Ownership</div>
              <div className="text-xs text-slate-400 mt-1">All source code, credentials, and repository rights belong completely to you upon project completion.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Weekly Async Updates</div>
              <div className="text-xs text-slate-400 mt-1">Direct WhatsApp channel, staging links, and regular video walkthroughs so you are never left guessing.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">30-Day Post-Launch Warranty</div>
              <div className="text-xs text-slate-400 mt-1">Complimentary bug fixing, minor performance tuning, and technical handover support after go-live.</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Social Proof & Testimonials */}
      <div>
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            What Collaborators & Clients Say
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                  {t.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-[12px] text-slate-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}