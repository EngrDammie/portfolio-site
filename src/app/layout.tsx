import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Dammie Optimus Solutions | AI, Web & Mobile Software Engineering',
  description: 'Dammie Optimus Solutions designs and engineers high-performance AI automations, web applications, and mobile solutions for businesses worldwide.',
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