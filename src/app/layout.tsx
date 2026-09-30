import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SITE_URL, WHATSAPP_NUMBER, CONTACT_EMAIL, BOOKING_URL } from '@/config/site';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * The site lives on a free workers.dev address until a real domain is
 * bought, so the canonical URL has to be written out rather than
 * inferred, and it has to be the same absolute address the share cards
 * point at. Every social and search tag below is an absolute URL on
 * purpose: relative ones are ignored by WhatsApp, LinkedIn and X.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Dammie Optimus Solutions | AI, Web & Mobile Software Engineering',
  description:
    'Dammie Optimus Solutions designs and engineers high-performance AI automations, web applications, and mobile solutions for businesses worldwide.',
  authors: [{ name: 'Dammie Optimus' }],
  creator: 'Dammie Optimus Solutions',
  publisher: 'Dammie Optimus Solutions',
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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

/**
 * Structured data: a machine-readable description of who this is and
 * what this site is, so search engines and AI assistants do not have to
 * infer it from the layout.
 *
 * This is the one piece of SEO that genuinely helps on a free subdomain,
 * because it is about being understood rather than about authority. An
 * assistant asked "software developers in Nigeria" can resolve the
 * entity and cite it far more reliably than it can from a paragraph of
 * prose.
 *
 * Kept as a literal object rather than a string so it cannot be
 * malformed, and kept deliberately modest: three graph entries, all true
 * and all checkable by a visitor. No invented awards, no fake review
 * counts, no rating.
 */
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Dammie Optimus Solutions',
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      image: `${SITE_URL}/assets/og-homepage.png`,
      description:
        'Software engineering business building AI automations, web applications and mobile applications.',
      foundingDate: '2025',
      email: CONTACT_EMAIL,
      telephone: `+${WHATSAPP_NUMBER}`,
      areaServed: [
        { '@type': 'Country', name: 'Nigeria' },
        { '@type': 'Place', name: 'Africa' },
        { '@type': 'Place', name: 'United Kingdom' },
        { '@type': 'Place', name: 'United States' },
        { '@type': 'Place', name: 'Europe' },
      ],
      knowsAbout: [
        'AI automation',
        'Web application development',
        'Mobile application development',
        'Offline-first architecture',
        'Cloud infrastructure',
      ],
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#founder`,
      name: 'Dammie Optimus',
      jobTitle: 'Software Engineer',
      worksFor: { '@id': `${SITE_URL}/#organization` },
      url: SITE_URL,
      knowsAbout: [
        'AI automation',
        'Web application development',
        'Mobile application development',
        'Software project estimation',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Dammie Optimus Solutions',
      inLanguage: 'en-NG',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'ReserveAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: BOOKING_URL,
          actionPlatform: [
            'https://schema.org/DesktopWebPlatform',
            'https://schema.org/MobileWebPlatform',
          ],
        },
        result: { '@type': 'Reservation', name: 'Discovery call' },
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 transition-colors duration-300 min-h-screen`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {/* Rendered as a script tag because JSON-LD is data, not code, and
              must be present in the HTML the first time a crawler fetches it.
              A client component would not run until after hydration, which
              is too late. */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          {children}
        </ThemeProvider>

        {/*
          Cloudflare Web Analytics.

          This is a plain <script> element rather than next/script, and that
          is deliberate. next/script preloads the file but does not carry
          arbitrary data-* attributes through to the injected tag, so the
          beacon loaded WITHOUT its token and attributed nothing. That was
          verified in a real browser: the script was requested, and
          /cdn-cgi/rum was never called. A plain script preserves the
          attribute exactly, which is what the beacon needs to know which
          site the page views belong to.

          The site token is NOT a secret. It is designed to be public and
          appears in the HTML source of every page it tracks, for the same
          reason an analytics measurement ID does. It grants no access to
          anything on Cloudflare.

          It is cookieless, collects no personal data, and sets no cookies,
          so it needs no consent banner. It is disclosed in the privacy
          policy at /privacy, which must be updated if this is ever removed
          or changed.
        */}
        <script
          type="module"
          async
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: '2d767b1a8ce04f4bb704867de491143c' })}
        />
      </body>
    </html>
  );
}
