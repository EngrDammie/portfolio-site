import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail, Lock, EyeOff, Database, Globe, FileText } from 'lucide-react';
import { BrandLogo } from '@/components/DOMonogram';
import ThemeToggle from '@/components/ThemeToggle';

const LAST_UPDATED = '30 September 2026';
const CONTACT_EMAIL = 'dammieoptimus@gmail.com';
const RETENTION_MONTHS = 12;

export const metadata: Metadata = {
  title: 'Privacy Policy | Dammie Optimus Solutions',
  description:
    'How Dammie Optimus Solutions handles information you send through this website. No cookies, no database, no advertising or tracking pixels, and only cookieless aggregate analytics. Plain English, and how to ask for a copy or deletion of your data.',
  robots: {
    index: true,
    follow: true,
  },
};

const SECTIONS = [
  { id: 'short-version', n: '01', t: 'The short version' },
  { id: 'what-we-collect', n: '02', t: 'What we collect, and why' },
  { id: 'what-we-do-not-collect', n: '03', t: 'What we do not collect' },
  { id: 'where-it-goes', n: '04', t: 'Where your information goes' },
  { id: 'how-long', n: '05', t: 'How long we keep it' },
  { id: 'your-rights', n: '06', t: 'Your rights' },
  { id: 'exercise-rights', n: '07', t: 'How to exercise those rights' },
  { id: 'third-parties', n: '08', t: 'Embedded and third-party content' },
  { id: 'other-apps', n: '09', t: 'The other apps on this site' },
  { id: 'security', n: '10', t: 'How it is protected' },
  { id: 'children', n: '11', t: "Children's privacy" },
  { id: 'changes', n: '12', t: 'If this policy changes' },
  { id: 'contact', n: '13', t: 'How to contact us' },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <BrandLogo className="w-11 h-11 sm:w-12 sm:h-12 shrink-0" />
            <div className="flex flex-col items-start leading-none min-w-0">
              <span className="font-extrabold text-white tracking-tight whitespace-nowrap text-sm sm:text-lg">
                Dammie Optimus
              </span>
              <span className="mt-[0.28em] text-[0.78em] sm:text-[0.9em] font-bold uppercase tracking-[0.24em] sm:tracking-[0.28em] whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Privacy Policy
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/"
              aria-label="Back to site"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors border border-slate-800 bg-slate-900/90 px-3 py-2 rounded-lg whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              {/* Collapsed to the icon alone on narrow screens: the full label
                  pushed the header past the viewport below 640px. */}
              <span className="hidden sm:inline">Back to site</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* ================= TITLE BLOCK ================= */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-400 mb-4">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            Last updated {LAST_UPDATED}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            This page explains, in plain English, what happens to information you send through this
            website. It is written to be read once, quickly. If anything here is unclear, email me
            and I will explain it properly.
          </p>
        </div>

        {/* ================= THE HEADLINE ================= */}
        <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 p-5 sm:p-7 mb-10">
          <div className="flex items-start gap-3 mb-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              The honest one-paragraph version
            </h2>
          </div>
          <p className="text-slate-300 leading-relaxed">
            If you use the contact form, your message arrives in my email inbox and nowhere else.
            There is <strong className="text-white">no database, no account, no cookies, and no
            advertising or tracking of any kind</strong> on this site. The one thing I do collect is
            anonymous, cookieless page-view counts, so I can tell which pages people actually read.
            I keep your brief for {RETENTION_MONTHS} months so we can work together, and I delete it
            as soon as you ask. I am one person, not a company with a data team, so I can do that.
          </p>
        </div>

        {/* ================= CONTENTS ================= */}
        <nav
          aria-label="Contents"
          className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-5 sm:p-6 mb-12"
        >
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 mb-4">
            What this policy covers
          </div>
          <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-baseline gap-2.5 text-slate-400 hover:text-emerald-400 transition-colors py-1"
                >
                  <span className="font-mono text-xs text-slate-500 shrink-0">{s.n}</span>
                  <span>{s.t}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ================= SECTIONS ================= */}
        <div className="space-y-12">
          {/* 01 */}
          <Section id="short-version" n="01" title="The short version">
            <p>
              This website does one thing that collects information: the contact form. It also lets
              you work out a project estimate, which runs entirely in your browser and sends me
              nothing at all.
            </p>
            <p>
              There is no login, no user account, no membership, and no payment processing on this
              site. Nobody creates a profile here, because there is nowhere to create one.
            </p>
            <p>
              The only personal information I receive is what you choose to type into the form. I
              do not buy data, scrape data, or receive information about you from anyone else.
            </p>
          </Section>

          {/* 02 */}
          <Section id="what-we-collect" n="02" title="What we collect, and why">
            <p>
              The contact form has five fields. Two of them are optional, and you can leave either
              one blank as long as you give me at least one way to reply.
            </p>
            <ul className="mt-4 space-y-3">
              <CollectedItem
                label="Your name"
                required
                note="So I know who I am replying to, and so I can address you properly."
              />
              <CollectedItem
                label="Your email address"
                required={false}
                note="Used to reply. I set it as the reply-to address, so replying to my email reaches you directly and does not expose your address."
              />
              <CollectedItem
                label="Your WhatsApp number"
                required={false}
                note="Used to message you. If you give a number, my notification email includes a clickable link that opens a chat with you already written."
              />
              <CollectedItem
                label="The type of project"
                required={false}
                note="Pre-filled by the cost estimator if you use it. It tells me whether to expect a website, an app or an automation, so I can answer usefully."
              />
              <CollectedItem
                label="Your message"
                required
                note="The description of what you need. If you used the estimator, the first part is written for you and you can add notes underneath."
              />
            </ul>
            <p className="mt-4">
              That is the complete list. If you send me something extra inside the message field,
              that is part of the message and is treated the same way.
            </p>
          </Section>

          {/* 03 */}
          <Section id="what-we-do-not-collect" n="03" title="What we do not collect">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-5 sm:p-6 mb-4">
              <div className="flex items-center gap-2.5 mb-3">
                <EyeOff className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                <h3 className="font-bold text-white">This is an unusually short list</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Most websites cannot write this section honestly. I can, because almost none of it
                is built. The two items marked with a note below are the honest exceptions, and
                they are described in full rather than glossed over.
              </p>
              <ul className="space-y-2.5 text-sm">
                <NotCollected>Cookies of any kind. Nothing on this site sets one.</NotCollected>
                <NotCollected>Advertising, remarketing, or retargeting pixels of any kind.</NotCollected>
                <NotCollected>Social media trackers, chat widgets, or embedded live-chat scripts.</NotCollected>
                <NotCollected>Heatmaps, session recordings, or A/B testing tools.</NotCollected>
                <NotCollected>Fingerprinting or any device identifier.</NotCollected>
                <NotCollected>
                  A database. Your information is not written to any application storage, and there
                  is nothing to log into or out of.
                </NotCollected>
                <NotCollected>Your location, contacts, photos, or files, unless you paste them yourself.</NotCollected>
              </ul>

              <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="text-sm font-bold text-emerald-400 mb-1.5">
                  The one exception: cookieless page-view counts
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  I run <strong>Cloudflare Web Analytics</strong>. It is worth being precise about
                  what that means, because &ldquo;we use analytics&rdquo; is where most privacy
                  policies quietly overstate themselves.
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-emerald-400 shrink-0" aria-hidden="true">&check;</span>
                    <span>It sets <strong>no cookies</strong> and writes nothing to your device.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400 shrink-0" aria-hidden="true">&check;</span>
                    <span>It collects <strong>no personal data</strong>: no name, no email, no account, no fingerprint, no cross-site tracking.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400 shrink-0" aria-hidden="true">&check;</span>
                    <span>It reports <strong>aggregate counts only</strong>: which page was viewed, roughly where the visitor is, and the browser and device type.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400 shrink-0" aria-hidden="true">&check;</span>
                    <span>Counts under a small threshold are <strong>not recorded at all</strong>, so no individual visit is distinguishable.</span>
                  </li>
                </ul>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  It is Cloudflare&rsquo;s own free product, and they already operate the server that
                  delivers this page, so it adds no new company to the list of processors in
                  section 04. Because it uses no cookies and no personal data, it does not require
                  your consent and produces no cookie banner. I have not included it because it is
                  convenient; I have included it because knowing which pages people actually read
                  is the only way to know what to build next.
                </p>
              </div>
            </div>
            <p>
              The one small exception is the theme preference. If you switch between light and dark,
              that choice is remembered using your browser&apos;s local storage so the site does not
              jump back every visit. That setting stays on your device, is never transmitted to me,
              and is cleared when you clear your browser data.
            </p>
          </Section>

          {/* 04 */}
          <Section id="where-it-goes" n="04" title="Where your information goes">
            <p>
              Your message is turned into an email and sent through an email delivery service. It
              then lands in my inbox. That is the whole journey, and it is a short one.
            </p>
            <p>That route involves three organisations, each with a different job:</p>
            <ul className="mt-4 space-y-3">
              <Processor
                name="Cloudflare"
                role="Hosts and serves this website, runs the network that delivers it to you, and runs the cookieless page-view analytics described in section 03. It processes technical connection data such as IP addresses in order to deliver pages and block abuse. The analytics it collects are aggregate counts with no personal data attached, and individual visits below the reporting threshold are not recorded."
              />
              <Processor
                name="Resend"
                role="The email delivery service. It receives your message and forwards it to my inbox. It is a company separate from me, processing your data on my instructions so the form can send mail at all."
              />
              <Processor
                name="Your email provider"
                role="If I reply to you, your own provider (for example Gmail, Outlook or Yahoo) receives my reply and stores it on their infrastructure, under their own terms. That is outside my control."
              />
            </ul>
            <p className="mt-4">
              None of these are used to build an advertising profile, and none is given access to
              anything beyond what is needed to deliver the message.
            </p>
          </Section>

          {/* 05 */}
          <Section id="how-long" n="05" title="How long we keep it">
            <p>
              I keep your brief for <strong className="text-white">{RETENTION_MONTHS} months from
              the last time we are in contact</strong>, and then I delete it. This is a firm
              commitment, not a guideline.
            </p>
            <p>The reasoning is straightforward. I need the details to reply, agree a scope, send a
              proposal and complete the work. Once that window has passed with no contact from
              either side, holding it longer serves nobody and only creates risk for you.</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <Bullet>
                If you ask me to delete your information, I do it <strong className="text-white">immediately</strong>,
                regardless of the {RETENTION_MONTHS}-month window.
              </Bullet>
              <Bullet>
                If we start a project together, I keep the working files for as long as the
                engagement is live and for a reasonable period afterwards, so I can support the
                work. Those are governed by the project&rsquo;s own terms, not this policy.
              </Bullet>
              <Bullet>
                I keep a minimal record that an enquiry was made, without your message content, only
                where I am legally required to.
              </Bullet>
            </ul>
          </Section>

          {/* 06 */}
          <Section id="your-rights" n="06" title="Your rights">
            <p>
              This site is operated from Nigeria and is also read by people in Europe and elsewhere,
              so two privacy regimes can apply. I have written to satisfy the stricter of them rather
              than the minimum of either.
            </p>
            <div className="space-y-4 mt-4">
              <LawBlock
                name="Nigeria Data Protection Act 2023 (NDPA)"
                body="The main Nigerian data protection law, enforced by the Nigeria Data Protection Commission. It requires lawful, specific processing of personal data and gives you rights over what is held about you."
              />
              <LawBlock
                name="UK and EU General Data Protection Regulation (GDPR)"
                body="Applies if you are in the European Economic Area, the United Kingdom or Switzerland. It gives you the rights to access, correct, delete, restrict and port your personal data, and to object to how it is used."
              />
            </div>
            <p className="mt-4">In practical terms, you can ask me to:</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <Bullet>Tell you exactly what information I hold about you, and give you a copy.</Bullet>
              <Bullet>Correct anything that is wrong or out of date.</Bullet>
              <Bullet>Delete your information, and confirm when I have done it.</Bullet>
              <Bullet>Tell you why I hold it, who has processed it, and how long it has been kept.</Bullet>
              <Bullet>Ask me to stop using it for a particular purpose.</Bullet>
              <Bullet>Complain to a regulator. In Nigeria that is the Nigeria Data Protection
                Commission; in the EU it is your local supervisory authority.</Bullet>
            </ul>
          </Section>

          {/* 07 */}
          <Section id="exercise-rights" n="07" title="How to exercise those rights">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-slate-300 leading-relaxed">
                    Email <MailButton href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</MailButton> with
                    the word <span className="font-mono text-emerald-400">delete</span> or{' '}
                    <span className="font-mono text-emerald-400">copy</span> in the subject line. That
                    is genuinely all you need to do.
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed mt-3">
                    I reply within 7 days. If you did not use this form, or you only spoke to me on
                    WhatsApp or a call, say so in your email and I will search for it there too.
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-4">
              I do not use automated decision-making, profiling, or any form of automated
              judgement about you, so there is no &ldquo;right to a human review&rdquo; to invoke
              here. I also do not sell or share your information for anyone else&apos;s commercial
              benefit. Neither of those things happens on this site.
            </p>
            <p className="mt-4">
              The analytics in section 03 do not change that. They produce aggregate counts of which
              pages are read, not a profile of who you are, and they are not used to make any
              decision about you. If you would prefer this site ran no analytics at all, say so and
              I will remove it &mdash; that is your call, not mine, and it costs the site very
              little.
            </p>
          </Section>

          {/* 08 */}
          <Section id="third-parties" n="08" title="Embedded and third-party content">
            <p>
              Two features of this site involve other companies. Both are designed so that nothing
              happens until you actively choose to interact.
            </p>
            <div className="space-y-4 mt-4">
              <Processor
                name="YouTube (privacy-enhanced mode)"
                role="A project showcase video is embedded using YouTube's privacy-enhanced host, which is designed not to set tracking cookies. Nothing loads from YouTube, and no request reaches Google, until you press play. After you press play, YouTube applies its own privacy policy, and I have no control over what it does at that point."
              />
              <Processor
                name="Your own project previews"
                role="Opening a live project preview loads that project's own address inside a sandboxed frame. Those are projects I built and host, so they are under my control, and they are separate applications with their own privacy practices."
              />
            </div>
            <p className="mt-4">
              Project thumbnails are served from YouTube&rsquo;s image host, which means an image request
              reaches that host when those thumbnails are visible.
            </p>
          </Section>

          {/* 09 */}
          <Section id="other-apps" n="09" title="The other apps on this site">
            <p>
              I link to several small applications I have built, including Bible reading plans, a
              payroll voucher tool and a recharge pin formatter. They are separate applications on
              separate addresses, and this policy does not govern them.
            </p>
            <p>
              It is worth saying how they handle your data, because the answer is unusual:{' '}
              <strong className="text-white">those apps send me nothing at all.</strong> They keep
              everything in your own browser&apos;s local storage, on your device. There is no
              account, no server holding your records, and no network call to make.
            </p>
            <p>The practical consequences are worth understanding:</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <Bullet>Your data in those apps never reaches me. I could not hand it over if asked,
                because I do not have it.</Bullet>
              <Bullet>It stays on your device. Clearing your browser data, or using a different
                device, means starting again.</Bullet>
              <Bullet>That is a genuine trade-off, not a marketing claim. You gain privacy and
                resilience; you give up any ability to recover lost data or sync across devices.</Bullet>
            </ul>
            <p className="mt-4">
              If you want the specifics for one of those apps, ask me and I will point you at the
              right one.
            </p>
          </Section>

          {/* 10 */}
          <Section id="security" n="10" title="How it is protected">
            <div className="flex items-start gap-3 mb-4">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-slate-300">
                The site is served over encrypted connections, and the form is protected by the same
                encryption. Email in transit is encrypted in the normal way.
              </p>
            </div>
            <p>Being straightforward about the limits of that, because a security claim that hides
              its weaknesses is not a useful claim:</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <Bullet>This is a small site run by one person. It does not have the layered security
                controls of a large corporation, and I do not claim it does.</Bullet>
              <Bullet>Briefs sit in an email inbox. Email is not built for confidential storage, which
                is part of why the retention limit exists.</Bullet>
              <Bullet>If your project involves genuinely sensitive material — health, financial or
                similar — tell me before you send it, and I will suggest a more appropriate way to
                share it.</Bullet>
            </ul>
          </Section>

          {/* 11 */}
          <Section id="children" n="11" title="Children's privacy">
            <p>
              This site is a business portfolio and is not directed at children. I do not
              knowingly collect information from anyone under 16. If you believe a child has sent me
              personal information, email me and I will delete it immediately.
            </p>
          </Section>

          {/* 12 */}
          <Section id="changes" n="12" title="If this policy changes">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-5 sm:p-6 mb-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-slate-300 leading-relaxed">
                    I will update this page before a change takes effect, and the date at the top of
                    the page always shows the current version.
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed mt-3">
                    To be clear about the future rather than pretending it will not happen: I may
                    add accounts, a database or my own applications one day, and that would change
                    what I hold and why. If that happens, I will rewrite this policy, put the new
                    version on this page, and tell you what changed. This page will never quietly
                    become wrong.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* 13 */}
          <Section id="contact" n="13" title="How to contact us">
            <p>
              Questions, corrections, deletion requests, or complaints are all welcome, and there
              is no form to fill in. Email is the fastest route:
            </p>
            <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-900/90 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 mb-2">
                    Dammie Optimus Solutions
                  </div>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-mono text-emerald-400 hover:text-emerald-300 transition-colors break-all text-sm"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  <p className="text-slate-400 text-sm leading-relaxed mt-3">
                    If you are unhappy with how I have handled your information, please tell me
                    first. I would rather fix a problem than have you take it elsewhere. You also
                    hold the right to complain to the Nigeria Data Protection Commission or your
                    local supervisory authority.
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* ================= LEGAL NOTE ================= */}
        <div className="mt-12 rounded-2xl border border-slate-800/80 bg-slate-800/80 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-slate-400 leading-relaxed">
              <strong className="text-white">A note on this document.</strong> It was written by
              the site owner, not by a lawyer, and it is not legal advice. For a small business
              handling enquiries the way this one does, it accurately describes what happens and
              that is what matters. If this site ever starts handling health, financial, or
              children&apos;s data, or building accounts for customers, get a qualified lawyer to
              review this properly before going further.
            </p>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <footer className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Dammie Optimus Solutions. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-emerald-400 transition-colors">
              Contact
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ---------- Small presentational helpers ---------- */

function Section({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 sm:scroll-mt-28">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-mono text-sm text-emerald-400 shrink-0">{n}</span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{title}</h2>
      </div>
      <div className="space-y-4 text-slate-300 leading-relaxed pl-0 sm:pl-9">{children}</div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="text-emerald-400 shrink-0 mt-0.5" aria-hidden="true">
        &bull;
      </span>
      <span className="text-slate-300 leading-relaxed">{children}</span>
    </li>
  );
}

function NotCollected({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="text-emerald-400 font-bold shrink-0" aria-hidden="true">
        &times;
      </span>
      <span className="text-slate-300 leading-relaxed">{children}</span>
    </li>
  );
}

function CollectedItem({
  label,
  required,
  note,
}: {
  label: string;
  required: boolean;
  note: string;
}) {
  return (
    <li className="rounded-xl border border-slate-800/80 bg-slate-900/90 p-4">
      <div className="flex items-center gap-2 flex-wrap mb-1.5">
        <span className="font-bold text-white text-sm">{label}</span>
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded ${
            required
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {required ? 'Required' : 'Optional'}
        </span>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">{note}</p>
    </li>
  );
}

function Processor({ name, role }: { name: string; role: string }) {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/90 p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <Database className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
        <span className="font-bold text-white text-sm">{name}</span>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">{role}</p>
    </div>
  );
}

function LawBlock({ name, body }: { name: string; body: string }) {
  return (
    <div className="rounded-xl border-l-4 border-emerald-500 bg-slate-900/90 p-4">
      <div className="font-bold text-white text-sm mb-1.5">{name}</div>
      <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
    </div>
  );
}

function MailButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className="font-mono text-emerald-400 hover:text-emerald-300 transition-colors break-all">
      {children}
    </a>
  );
}
