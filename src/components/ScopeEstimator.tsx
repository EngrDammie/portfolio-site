'use client';

import React, { useState, useEffect } from 'react';
import {
  CURRENCIES,
  PROJECT_TYPES,
  PROJECT_STAGES,
  FEATURE_ADDONS,
  Currency,
} from '@/data/pricingConfig';
import {
  Bot,
  Globe,
  LayoutGrid,
  Smartphone,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';

// Formatter to ensure numbers render identically on server and devices
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export default function ScopeEstimator() {
  const [mounted, setMounted] = useState(false);
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [selectedType, setSelectedType] = useState<string>(PROJECT_TYPES[0].id);
  const [selectedStage, setSelectedStage] = useState<string>(PROJECT_STAGES[0].id);
  // Nothing is pre-selected: the ballpark total reflects only what the visitor
  // has actually chosen, so no add-on cost is baked in before they opt in.
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentProjectType = PROJECT_TYPES.find((t) => t.id === selectedType) || PROJECT_TYPES[0];
  const currentStage = PROJECT_STAGES.find((s) => s.id === selectedStage) || PROJECT_STAGES[0];

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Calculations
  const baseMin = currentProjectType.basePrice[currency].min * currentStage.multiplier;
  const baseMax = currentProjectType.basePrice[currency].max * currentStage.multiplier;

  const addonsCost = selectedAddons.reduce((sum, addonId) => {
    const addon = FEATURE_ADDONS.find((a) => a.id === addonId);
    return sum + (addon ? addon.price[currency] : 0);
  }, 0);

  const finalMinPrice = Math.round(baseMin + addonsCost);
  const finalMaxPrice = Math.round(baseMax + addonsCost);

  const addonsExtraWeeks = selectedAddons.reduce((sum, addonId) => {
    const addon = FEATURE_ADDONS.find((a) => a.id === addonId);
    return sum + (addon ? addon.extraWeeks : 0);
  }, 0);

  const minWeeks = Math.round(currentProjectType.baseWeeks.min * currentStage.multiplier) + addonsExtraWeeks;
  const maxWeeks = Math.round(currentProjectType.baseWeeks.max * currentStage.multiplier) + addonsExtraWeeks;

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Bot':
        return <Bot className="w-5 h-5" />;
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      case 'LayoutGrid':
        return <LayoutGrid className="w-5 h-5" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  // --- LOGIC FUNCTION: Bridge the Estimate Directly into the Contact Form ---
  const handleLockInEstimate = () => {
    const summaryText = `[ESTIMATE LOCK-IN]
Project: ${currentProjectType.name}
Stage: ${currentStage.name}
Estimated Investment: ${CURRENCIES[currency].symbol}${formatNumber(finalMinPrice)} – ${CURRENCIES[currency].symbol}${formatNumber(finalMaxPrice)} (${currency})
Estimated Timeline: ${minWeeks} – ${maxWeeks} Weeks
Included Add-ons: ${selectedAddons.map((id) => FEATURE_ADDONS.find((a) => a.id === id)?.name).filter(Boolean).join(', ') || 'None'}`;

    // Dispatches a custom event that ContactHub listens for
    window.dispatchEvent(
      new CustomEvent('populate-estimate', {
        detail: {
          projectType: currentProjectType.name,
          summary: summaryText,
        },
      })
    );

    // Smooth-scroll down to the contact hub
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="estimator" className="w-full max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Interactive Project Calculator
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Estimate Your Project in Seconds
        </h2>
        <p className="mt-2 sm:mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Select your requirements below to see an instant ballpark investment range and timeline.
        </p>

        {/* Currency Switcher */}
        <div className="mt-6 inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(Object.keys(CURRENCIES) as Currency[]).map((cur) => (
            <button
              type="button"
              key={cur}
              onClick={() => setCurrency(cur)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
                currency === cur
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{CURRENCIES[cur].flag}</span>
              <span>{CURRENCIES[cur].label} ({CURRENCIES[cur].symbol})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          
          {/* Step 1: Project Archetype */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">1</span>
              What are we building?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-4">Select the primary architecture of your solution.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_TYPES.map((type) => {
                const isSelected = selectedType === type.id;
                return (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`text-left p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between cursor-pointer active:scale-[0.98] ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500'
                        : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={isSelected ? 'text-emerald-400' : 'text-slate-400'}>
                          {renderIcon(type.iconName)}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div className="font-semibold text-sm">{type.name}</div>
                      <div className="text-xs text-slate-400 mt-1 line-clamp-2">{type.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Stage */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">2</span>
              Project Stage & Scope
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-4">Choose how comprehensive the initial release should be.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_STAGES.map((stage) => {
                const isSelected = selectedStage === stage.id;
                return (
                  <button
                    type="button"
                    key={stage.id}
                    onClick={() => setSelectedStage(stage.id)}
                    className={`text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500'
                        : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{stage.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="text-xs text-slate-400">{stage.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Add-on Capabilities */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">3</span>
              High-Impact Capabilities
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-4">Select any specialized modules required.</p>

            <div className="space-y-2.5">
              {FEATURE_ADDONS.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                return (
                  <button
                    type="button"
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full text-left cursor-pointer flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 active:scale-[0.99] ${
                      isChecked
                        ? 'border-emerald-500/60 bg-emerald-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-medium">{addon.name}</div>
                        <div className="text-[12px] sm:text-xs text-slate-400">{addon.description}</div>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-emerald-400 pl-3 whitespace-nowrap">
                      +{CURRENCIES[currency].symbol}{formatNumber(addon.price[currency])}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Output Card (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-8">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              Ballpark Scope Summary
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {currentProjectType.name}
            </h4>

            {/* Full Project Type Description in Full */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              {currentProjectType.description}
            </div>

            {/* Price Output Display */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 mb-6">
              <span className="text-xs text-slate-400 block mb-1">Estimated Investment Range</span>
              <div className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                {CURRENCIES[currency].symbol}{formatNumber(finalMinPrice)} 
                <span className="text-slate-500 font-light mx-2">–</span>
                {CURRENCIES[currency].symbol}{formatNumber(finalMaxPrice)}
              </div>
              <div className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Transparent rate in {CURRENCIES[currency].label}
              </div>
            </div>

            {/* Estimated Timeline */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 mb-6">
              <div className="flex items-center gap-2.5 text-slate-300 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Estimated Turnaround</span>
              </div>
              <span className="text-white font-bold text-xs sm:text-sm">
                {minWeeks} – {maxWeeks} Weeks
              </span>
            </div>

            {/* What's included preview */}
            <div className="space-y-2 mb-6">
              <span className="text-xs text-slate-400 font-medium block">Included in this scope:</span>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{currentStage.name} architecture</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Mobile responsive & high-performance design</span>
              </div>
              {selectedAddons.map((addonId) => {
                const addon = FEATURE_ADDONS.find((a) => a.id === addonId);
                return (
                  <div key={addonId} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{addon?.name}</span>
                  </div>
                );
              })}
            </div>

            {/* VISUAL BUTTON: Triggers the handleLockInEstimate logic above */}
            <button
              type="button"
              onClick={handleLockInEstimate}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 group cursor-pointer active:scale-95"
            >
              <span>Lock In This Estimate & Book Call</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <p className="mt-3 text-[12px] text-center text-slate-500 leading-relaxed">
              *Preliminary estimate based on selected parameters. Final scope and terms are formalized after a brief discovery call.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}