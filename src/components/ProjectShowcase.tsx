'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SHOWCASE_PROJECTS, ProjectItem } from '@/data/projectsConfig';
import {
  ChevronDown,
  TrendingUp,
  Layers,
  ArrowUpRight,
  Monitor,
  Smartphone,
  X,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Link as LinkIcon,
  Star,
} from 'lucide-react';

const GithubIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.019c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const CATEGORIES = ['All', 'AI & Automation', 'Full-Stack Web App', 'Mobile App', 'Business Website'] as const;

// ============================================================
// YOUTUBE EMBED — facade pattern
// ============================================================
// YouTube's watch pages send `X-Frame-Options: sameorigin`, so they refuse
// to be framed. Only the /embed/ endpoint is designed to be embedded, which
// is why we store a bare video ID and build the URL here rather than storing
// a share link (youtu.be/... merely redirects to the unframeable watch page).
//
// The facade shows a thumbnail from YouTube's image CDN and only creates the
// iframe once the visitor chooses to play. That avoids pulling ~1MB of player
// JavaScript and firing tracking requests for a video nobody watches, and it
// means the video can never become a cookie-consent trigger.

const YT_THUMBNAILS = ['maxresdefault', 'sddefault', 'mqdefault'];

const YouTubeFacade = ({
  videoId,
  title,
  onPlay,
}: {
  videoId: string;
  title: string;
  onPlay: () => void;
}) => {
  // maxresdefault (1280x720) only exists for high-resolution uploads, so
  // fall back through smaller sizes. mqdefault is 320x180 and always present.
  const [tier, setTier] = useState(0);

  return (
    <button
      type="button"
      onClick={onPlay}
      className="group/play absolute inset-0 w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      aria-label={`Play video: ${title}`}
    >
      {/*
        A plain <img> is deliberate here, not an oversight:
        - The source is YouTube's image CDN, which already serves optimised
          variants. We pick the tier ourselves via onError, which needs a raw
          <img>; next/image's error handling would not fit the fallback chain.
        - The image only exists after the visitor opens a modal, so it does not
          affect LCP. Routing it through an optimiser would add a failure mode
          and extra Worker work for no measurable gain.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/${YT_THUMBNAILS[tier]}.jpg`}
        alt=""
        loading="lazy"
        onError={() => setTier((t) => Math.min(t + 1, YT_THUMBNAILS.length - 1))}
        className="w-full h-full object-cover"
      />

      {/* Scrim + centred play button */}
      <span className="absolute inset-0 bg-slate-950/45 group-hover/play:bg-slate-950/30 transition-colors duration-200" />

      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/40 transition-transform duration-200 group-hover/play:scale-110">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 sm:w-9 sm:h-9 translate-x-[2px] text-slate-950">
            <path d="M8 5.14v13.72L19 12 8 5.14Z" />
          </svg>
        </span>
        <span className="text-[12px] sm:text-sm font-semibold text-white">
          Play the walkthrough
        </span>
      </span>
    </button>
  );
};

export default function ProjectShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  // Video only: reset on every modal open so the facade shows again.
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProjects = selectedCategory === 'All'
    ? SHOWCASE_PROJECTS
    : SHOWCASE_PROJECTS.filter((p) => p.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="projects" className="w-full max-w-5xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-3">
            <Layers className="w-4 h-4" />
            Verified Capabilities & Work
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured Solutions & Case Studies
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl">
            Explore live architecture breakdowns, interactive device sandboxes, and tangible business results.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asymmetrical Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const isExpanded = expandedProjectId === project.id;
          const isFeatured = project.featured;

          return (
            <div
              key={project.id}
              className={`rounded-2xl p-5 sm:p-7 flex flex-col justify-between transition-all duration-200 group relative overflow-hidden ${
                isFeatured
                  ? 'md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-emerald-500/40 shadow-xl shadow-emerald-500/5'
                  : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700/80'
              }`}
            >
              <div>
                {/* Top Row: Category + Flagship Badge + Key Metric */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    {isFeatured && (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <Star className="w-3 h-3 fill-emerald-300 text-emerald-300" />
                        Flagship Solution
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-emerald-400 text-xs font-medium">
                      {project.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{project.metric}</span>
                  </div>
                </div>

                {/* Project Title */}
                <h3 className={`font-bold text-white group-hover:text-emerald-300 transition-colors tracking-tight ${
                  isFeatured ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
                }`}>
                  {project.title}
                </h3>

                {/* Summary */}
                <p className={`mt-2.5 text-slate-400 leading-relaxed ${
                  isFeatured ? 'text-sm sm:text-base max-w-3xl' : 'text-xs sm:text-sm'
                }`}>
                  {project.summary}
                </p>

                {/* Supplementary Reference Links — rendered above the tech stack */}
                {project.links && project.links.length > 0 && (
                  <ul className="mt-4 grid gap-1.5">
                    {project.links.map((link) => (
                      <li key={`${project.id}-${link.href}`}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link flex items-start gap-2.5 rounded-lg border border-slate-800/80 bg-slate-950/60 px-3 py-2 transition-colors hover:border-emerald-500/40 hover:bg-slate-900/60"
                        >
                          <LinkIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400 transition-colors group-hover/link:text-emerald-300" />
                          <span className="min-w-0">
                            {/* Colours are restricted to the set the light-mode
                                engine overrides in globals.css. text-slate-200 is
                                not in that set, so on a light canvas it rendered
                                at roughly 1.1:1 contrast and was invisible. */}
                            <span className="block text-sm font-semibold text-slate-300 transition-colors group-hover/link:text-emerald-400">
                              {link.title}
                            </span>
                            <span className="mt-1 block text-[13px] leading-relaxed text-slate-400 transition-colors group-hover/link:text-slate-300">
                              {link.subtext}
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech Stack Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[12px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Expandable Architecture Drawer */}
                {isExpanded && (
                  <div className="mt-6 pt-5 border-t border-slate-800 space-y-3.5 animate-in fade-in duration-200">
                    <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80">
                      <span className="text-[12px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                        The Challenge:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{project.problem}</p>
                    </div>

                    <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80">
                      <span className="text-[12px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                        The Engineered Solution:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{project.solution}</p>
                    </div>

                    <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80">
                      <span className="text-[12px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                        The Business Impact:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{project.result}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions Row */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleExpand(project.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 cursor-pointer active:scale-95 transition-colors"
                >
                  <span>{isExpanded ? 'Hide Architecture' : 'View Architecture'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <div className="flex items-center gap-2">
                  {/* GitHub Source Code */}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Source Code"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}

                  {/* Direct Live URL Link */}
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Open Live Site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {/* Launch In-Site Preview Modal */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModalProject(project);
                      setDeviceView('desktop');
                      setIsVideoPlaying(false);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors cursor-pointer active:scale-95"
                  >
                    <span>Live Preview</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- DYNAMIC MULTI-MODE PREVIEW MODAL --- */}
      {activeModalProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                  {activeModalProject.category}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                  {activeModalProject.title}
                </h4>
              </div>

              {/* Viewport & External Controls */}
              <div className="flex items-center gap-2">
                {/* Direct Live Site Button (using liveUrl) */}
                {activeModalProject.liveUrl && activeModalProject.liveUrl !== '#' && (
                  <a
                    href={activeModalProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors"
                    title="Open Live Site in New Tab"
                  >
                    <span className="hidden sm:inline">Open Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {/* Device Viewport Switcher — hidden for video, which always
                    renders as a 16:9 stage regardless of this setting */}
                {activeModalProject.previewType !== 'video' && (
                <div className="hidden sm:inline-flex p-1 bg-slate-950 border border-slate-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setDeviceView('desktop')}
                    className={`p-1.5 rounded-md transition-colors ${
                      deviceView === 'desktop' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceView('mobile')}
                    className={`p-1.5 rounded-md transition-colors ${
                      deviceView === 'mobile' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Mobile Simulator"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveModalProject(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Canvas: Dynamically switches based on previewType */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-slate-950">

              {/* ---- VIDEO: clean 16:9 stage, no device bezel ----
                  A 16:9 video forced into the tall mobile frame would letterbox
                  heavily, so videos ignore the viewport switcher entirely. */}
              {activeModalProject.previewType === 'video' && activeModalProject.videoId ? (
                <div className="w-full max-w-4xl">
                  <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                    {isVideoPlaying ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${activeModalProject.videoId}?autoplay=1&rel=0`}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        title={activeModalProject.title}
                      />
                    ) : (
                      <YouTubeFacade
                        videoId={activeModalProject.videoId}
                        title={activeModalProject.title}
                        onPlay={() => setIsVideoPlaying(true)}
                      />
                    )}
                  </div>

                  <p className="mt-3 text-center text-[12px] text-slate-500">
                    Nothing loads from YouTube until you press play.
                  </p>
                </div>
              ) : (
                <div
                  className={`transition-all duration-300 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
                    deviceView === 'mobile'
                      ? 'w-[320px] h-[520px] rounded-[32px] border-4 border-slate-700'
                      : 'w-full h-[440px]'
                  }`}
                >
                {/* Browser Header Bar */}
                <div className="h-8 bg-slate-950/90 border-b border-slate-800/80 px-3 flex items-center justify-between text-[12px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 truncate max-w-[200px]">
                    {activeModalProject.screenshots && activeModalProject.screenshots.length > 0
                      ? `${activeModalProject.screenshots.length} screenshot${
                          activeModalProject.screenshots.length === 1 ? '' : 's'
                        }`
                      : activeModalProject.previewUrl || activeModalProject.liveUrl}
                  </span>
                  <div className="w-8" />
                </div>

                {/* 1. SCREENSHOTS — used when a project ships screenshots and has no
                    live site to frame. Rendered above the iframe branch on
                    purpose: framing an image URL produces a browser chrome around
                    a bare JPEG, which looks like a broken embed. */}
                {activeModalProject.screenshots && activeModalProject.screenshots.length > 0 && (
                  <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-5">
                    <div className="mx-auto flex max-w-3xl flex-col gap-5">
                      {activeModalProject.screenshots.map((shot, i) => (
                        <figure key={`${activeModalProject.id}-shot-${i}`}>
                          <div
                            className={`mx-auto overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl ${
                              shot.kind === 'phone' ? 'max-w-[260px]' : 'max-w-full'
                            }`}
                          >
                            <Image
                              src={shot.src}
                              alt={shot.caption}
                              width={shot.width}
                              height={shot.height}
                              loading="lazy"
                              className="block h-auto w-full"
                            />
                          </div>
                          <figcaption className="mt-2.5 text-center text-[13px] leading-relaxed text-slate-400">
                            {shot.caption}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. IFRAME PREVIEW MODE */}
                {(!activeModalProject.screenshots || activeModalProject.screenshots.length === 0) &&
                  activeModalProject.previewType === 'iframe' &&
                  activeModalProject.previewUrl ? (
                  <iframe
                    src={activeModalProject.previewUrl}
                    className="w-full flex-1 border-0 bg-white"
                    title={activeModalProject.title}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    loading="lazy"
                  />
                ) : (!activeModalProject.screenshots ||
                     activeModalProject.screenshots.length === 0) ? (
                  /* 3. INTERACTIVE SIMULATOR MOCK MODE */
                  <div className="flex-1 p-5 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 overflow-y-auto">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <Sparkles className="w-3 h-3" />
                          Live Interactive Sandbox
                        </div>
                        <span className="text-[12px] font-mono text-slate-400">
                          Status: Active ⚡
                        </span>
                      </div>

                      <h5 className="text-base sm:text-lg font-bold text-white mb-2">
                        {activeModalProject.title}
                      </h5>
                      <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                        {activeModalProject.solution}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Metric Target</span>
                          <span className="text-sm font-bold text-emerald-400">{activeModalProject.metric}</span>
                        </div>
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Reliability</span>
                          <span className="text-sm font-bold text-white">99.9% Production Ready</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/90 rounded-xl p-3.5 border border-emerald-500/20 text-xs space-y-2">
                      <div className="flex items-center justify-between text-[12px] text-slate-400">
                        <span>Engine Pipeline</span>
                        <span className="text-emerald-400">Connected</span>
                      </div>
                      <div className="font-mono text-[12px] text-slate-300">
                        &gt; Architecture validated across {activeModalProject.techStack.join(', ')}.
                      </div>
                    </div>
                  </div>
                ) : null}
                </div>
              )}

            </div>

            {/* Modal Bottom CTA Bar */}
            <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 text-center sm:text-left">
                Need a customized solution like this built for your workflow?
              </div>

              <a
                href="#contact"
                onClick={() => setActiveModalProject(null)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <span>Request a Solution Like This</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}