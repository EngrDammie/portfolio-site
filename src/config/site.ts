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
 * The booking page. Prefer the environment variable when it is present
 * so a change there does not require a code edit, and fall back to the
 * published value so runtime code never silently loses the link.
 */
export const BOOKING_URL =
  process.env.BOOKING_URL?.trim() ||
  'https://calendar.app.google/QD12aQUafCYhjnhz6';
