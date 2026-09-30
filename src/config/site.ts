/**
 * Public site details, in one place.
 *
 * These are all values that are already visible to the public: they
 * appear in the footer, the contact section, or the published
 * documents. None of them is a secret, and none of them belongs in an
 * environment variable at runtime.
 *
 * Why they are collected here rather than read at the point of use:
 *
 * - BOOKING_URL is a BUILD-time variable. The home page reads it on the
 *   server during the build, so it is baked into the output. The API
 *   route runs at RUNTIME inside the worker, where that variable is not
 *   available. Without the fallback below, the acknowledgement email
 *   would silently lose its booking button.
 * - The phone number and email already exist in ContactHub. Duplicating
 *   them a third time in a template is how they drift apart.
 *
 * So: the environment variable still wins where it is available, and
 * these are the fallback. Change a value in one place.
 */

/** The address the site is actually served from, absolute, no trailing slash. */
export const SITE_URL = 'https://get-tech-solutions.dammieoptimus.workers.dev';

/** WhatsApp number in international format, digits only, for wa.me links. */
export const WHATSAPP_NUMBER = '2347053331253';

/** Business email address. */
export const CONTACT_EMAIL = 'dammieoptimus@gmail.com';

/**
 * The booking page.
 *
 * This is the single source of truth, and it is what the home page actually
 * uses. It did not used to be: page.tsx read process.env.BOOKING_URL directly
 * and passed `undefined` whenever the variable was unset. Both consumers then
 * degraded silently — the navbar link became a scroll to the contact form,
 * the form's booking button became a WhatsApp link — and nothing errored.
 *
 * The environment variable is still preferred when it is set, so changing it
 * in .env.local still works without a code edit. Note that .env.local is the
 * only place a build-time variable is read from; .dev.vars holds Worker
 * secrets and is ignored by next build.
 */
export const BOOKING_URL =
  process.env.BOOKING_URL?.trim() ||
  'https://calendar.app.google/QD12aQUafCYhjnhz6';
