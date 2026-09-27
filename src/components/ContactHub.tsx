'use client';

import React, { useState, useEffect } from 'react';
import {
  Video,
  Send,
  Clock,
  Globe,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
} from 'lucide-react';
import { BrandLogo } from './DOMonogram';

const WhatsAppIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12.031 2C6.495 2 2 6.484 2 12.019c0 1.767.46 3.491 1.334 5.006L2 22l5.129-1.344a10.015 10.015 0 004.902 1.275h.005c5.535 0 10.03-4.484 10.03-10.02 0-2.677-1.043-5.195-2.936-7.089A9.967 9.967 0 0012.031 2zm0 18.347h-.004a8.318 8.318 0 01-4.238-1.163l-.304-.18-3.149.825.84-3.069-.198-.316a8.317 8.317 0 01-1.278-4.425c0-4.59 3.737-8.326 8.331-8.326a8.275 8.275 0 015.89 2.44 8.283 8.283 0 012.439 5.892c0 4.593-3.738 8.331-8.333 8.331zm4.566-6.24c-.25-.125-1.479-.73-1.708-.813-.23-.083-.396-.125-.563.125-.166.25-.646.813-.792.98-.146.166-.292.188-.542.063s-1.059-.39-2.017-1.244c-.746-.666-1.25-1.488-1.396-1.738-.146-.25-.016-.385.109-.51.112-.112.25-.292.375-.438.125-.146.167-.25.25-.417.084-.166.042-.312-.02-.437s-.563-1.354-.771-1.854c-.203-.487-.41-.421-.563-.429l-.479-.008c-.167 0-.438.063-.667.313-.23.25-.875.854-.875 2.083s.896 2.417 1.021 2.583c.125.167 1.763 2.693 4.271 3.776.597.258 1.064.412 1.428.528.6.191 1.146.164 1.577.1.48-.072 1.479-.604 1.688-1.188.208-.583.208-1.083.146-1.188-.063-.104-.229-.166-.479-.291z" />
  </svg>
);

export default function ContactHub() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    projectType: 'Modern Business Website',
    message: '',
  });

  const myWhatsAppNumber = '2347053331253';
  const directEmail = 'dammieoptimus@gmail.com';
  const googleMeetLink = 'https://meet.google.com/new';

  // Listen for the "Lock In Estimate" event from ScopeEstimator
  useEffect(() => {
    const handleEstimateBridge = (event: CustomEvent<{ projectType: string; summary: string }>) => {
      if (event.detail) {
        setFormData((prev) => ({
          ...prev,
          projectType: event.detail.projectType || prev.projectType,
          message: `${event.detail.summary}\n\nAdditional notes:\n`,
        }));
      }
    };

    window.addEventListener('populate-estimate' as any, handleEstimateBridge);
    return () => window.removeEventListener('populate-estimate' as any, handleEstimateBridge);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side rule: At least one contact method must be provided
    if (!formData.email.trim() && !formData.whatsapp.trim()) {
      setErrorMessage('Please provide either an Email address or a WhatsApp number so I can reach you.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || 'Failed to submit inquiry. Please reach out via WhatsApp.'
        );
      }

      if (!result) {
        throw new Error('The server sent an unexpected response. Please reach out via WhatsApp.');
      }

      setFormSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please reach out via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4" />
          Direct Access & Booking
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Let’s Build Your Next Solution
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Connect directly with <strong className="text-white">Dammie Optimus Solutions</strong>. Jump on a Google Meet call, message on WhatsApp, or send an inquiry below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* 1. Google Meet Strategy Call */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Video className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                Direct Video
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Google Meet Strategy Call
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Book a 15-minute discovery session on Google Meet to review your project scope, technical blueprint, and timeline.
            </p>

            <a
              href={googleMeetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all duration-150 shadow-md active:scale-98 cursor-pointer"
            >
              <Video className="w-4 h-4 text-slate-950" />
              <span>Launch Google Meet Session</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* 2. Direct WhatsApp Fast-Track */}
          <div className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <WhatsAppIcon className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400">Average response: &lt; 1 hr</span>
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              Direct WhatsApp Channel
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Prefer direct messaging? Send specs or questions directly to my personal WhatsApp line.
            </p>

            <a
              href={`https://wa.me/${myWhatsAppNumber}?text=Hello%20Dammie%20Optimus%20Solutions!%20I%20reviewed%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm border border-slate-700 transition-all active:scale-98"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* 3. Availability Transparency */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-400 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>West Africa Time (WAT / GMT+1)</span>
            </div>
            <p className="text-[12px] leading-relaxed">
              Serving local clients in Nigeria and international clients across the UK, US, and Europe.
            </p>
          </div>

        </div>

        {/* Right Column: Inquiry Form (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Send a Project Brief
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Direct to Gmail</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Drop your requirements below. Provide your email, WhatsApp, or both so I can follow up with your blueprint.
            </p>

            {formSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center my-8 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-1">Inquiry Delivered!</h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                  Your project brief has been successfully sent to <strong className="text-white">dammieoptimus@gmail.com</strong>. I will reply shortly!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: '', email: '', whatsapp: '', projectType: 'Modern Business Website', message: '' });
                  }}
                  className="mt-5 text-xs text-emerald-400 underline hover:text-emerald-300 cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 1. Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                  />
                </div>

                {/* 2. Dual Contact Inputs: Email AND WhatsApp side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Number</span>
                    </label>
                    <input
                      type="text"
                      placeholder="080... or +234..."
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="text-[12px] text-slate-400 -mt-1 italic">
                  * Provide Email, WhatsApp, or both so I know how to get back to you.
                </div>

                {/* 3. Category Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Project Category
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-sm outline-none transition-all"
                  >
                    <option value="Modern Business Website">Modern Business Website</option>                                       
                    <option value="Full-Stack Web App / SaaS">Full-Stack Web Application / SaaS</option>
                    <option value="Mobile App (iOS & Android)">Mobile App (iOS & Android)</option>
                    <option value="AI Solution & Workflow Automation">AI Solution & Workflow Automation</option> 
                    <option value="Custom Project">Other / Custom Technical Solution</option>
                  </select>
                </div>

                {/* 4. Project Details Box */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Project Details / Scope <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly describe what you need built, your desired timeline, or lock in an estimate from the calculator above..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-sm outline-none transition-all placeholder:text-slate-600 resize-none font-mono text-xs"
                  />
                </div>

                {/* 5. Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-bold text-sm transition-all duration-150 shadow-lg shadow-emerald-500/20 active:scale-98 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Brief...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Project Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span>Direct Email: {directEmail}</span>
            <span>🔒 Confidential & NDA Protected</span>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrandLogo className="w-7 h-7" />
          <div className="text-left">
            <span className="text-sm font-bold text-white block">
              Dammie Optimus Solutions
            </span>
            <span className="text-[12px] text-slate-500">
              © {new Date().getFullYear()} All rights reserved. Engineered for peak performance.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <a href="#projects" className="hover:text-emerald-400 transition-colors">Case Studies</a>
          <a href="#process" className="hover:text-emerald-400 transition-colors">How I Work</a>
          <a href="#estimator" className="hover:text-emerald-400 transition-colors">Estimator</a>
          <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
        </div>
      </footer>

    </section>
  );
}