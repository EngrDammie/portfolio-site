'use client';

import React from 'react';
import { ArrowRight, Calendar, Sparkles, CheckCircle2, Shield, Zap, Bot } from 'lucide-react';
import Typewriter from './Typewriter';

const DYNAMIC_SERVICES = [
  'web apps.',
  'websites.',
  'mobile apps.',
  'APIs & microservices.',
  'AI automations.',
  'custom integrations.',
  'SaaS platforms.',
  'cloud backends.',
  'smart business workflows.',
  'payment pipelines.',
  'client portals.',
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Background ambient glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col items-center text-center">
        
        {/* Live Availability Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs sm:text-sm font-medium text-slate-300 mb-8 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span>Available for client projects & contracts</span>
        </div>

        {/* High-Impact Headline with Typewriter */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.2] max-w-4xl min-h-[3.6em] sm:min-h-[2.4em] flex flex-wrap items-center justify-center">
          <span>I build high-impact&nbsp;</span>
          <Typewriter
            words={DYNAMIC_SERVICES}
            typingSpeed={80}       // Speed per character while typing
            deletingSpeed={40}     // Speed per character while erasing
            pauseDuration={2000}   // 2 seconds reading pause
          />
        </h1>

        {/* Clear, Client-Focused Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Helping founders, businesses, and individuals turn complex manual workflows into fast, scalable digital software that saves time and generates revenue.
        </p>

        {/* Dual Call-To-Action (CTA) Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="#estimator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-emerald-500/25 group cursor-pointer active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Calculate Project Scope</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm sm:text-base border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Book a Discovery Call</span>
          </a>
        </div>

        {/* Value Proof Badges */}
        <div className="mt-14 sm:mt-16 pt-8 border-t border-slate-800/80 w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Sub-Second Speed</div>
              <div className="text-xs text-slate-400 mt-0.5">Optimized for high performance</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">AI-Powered</div>
              <div className="text-xs text-slate-400 mt-0.5">Automations & custom LLMs</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Secure Payments</div>
              <div className="text-xs text-slate-400 mt-0.5">Paystack & Stripe integrations</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Reliable Handoff</div>
              <div className="text-xs text-slate-400 mt-0.5">Clean architecture & documentation</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}