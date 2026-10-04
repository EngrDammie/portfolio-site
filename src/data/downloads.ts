/**
 * Every downloadable app, in one place.
 *
 * This exists because the Dropbox URL used to be hardcoded separately into
 * each release page, and the tracking endpoint needs the same list. Two copies
 * of the same fact drift, and the drift is invisible: the page keeps working,
 * the counter quietly stops counting. One registry, and `npm run preflight`
 * fails if a page and this file disagree.
 *
 * The URL still points at Dropbox. Hosting the file on Cloudflare R2 would
 * remove that dependency and make a download a real, countable event rather
 * than a counted intention, but R2 is not enabled on the account
 * (wrangler: "code 10042, enable R2 through the Dashboard"). Until it is, a
 * click is what can be measured, which is why everything user-facing says
 * "click" and never "download".
 */

export interface DownloadTarget {
  /** URL segment. `/dl/<slug>` routes here. Must also be the release page's stem. */
  slug: string;
  /** Human name, shown by `npm run downloads`. */
  label: string;
  /** Where the file actually is. Not shown to visitors. */
  href: string;
  /** File name as it downloads, for the CLI table. */
  fileName: string;
  /** Size in megabytes, shown in the CLI table. */
  sizeMb: number;
  /**
   * Set when the href is known not to serve the file. Preflight reports these
   * as warnings rather than failures: a dead link is a real problem but it does
   * not mean the tracking is broken, and blocking a deploy over it would train
   * people to ignore the checker.
   */
  broken?: boolean;
}

export const DOWNLOADS: Record<string, DownloadTarget> = {
  quickreceipt: {
    slug: 'quickreceipt',
    label: 'QuickReceipt',
    href: 'https://www.dropbox.com/scl/fi/56sok2d8lz3zztsmv17u3/QuickReceipt_base.apk?rlkey=3o2ftoamdapsq4n2xntxanf9l&st=n1al79vd&dl=1',
    fileName: 'QuickReceipt_base.apk',
    sizeMb: 22.3,
  },
  'rafa-voucher': {
    slug: 'rafa-voucher',
    label: 'Rafa Voucher Tracker',
    href: 'https://www.dropbox.com/scl/fi/p2ytwlj670h8438irwy3f/Rafa_Tracker_base.apk?rlkey=1fihbhj9uhheqbvhyvd9h5bl9&st=i4ha70ap&dl=1',
    fileName: 'Rafa_Tracker_base.apk',
    sizeMb: 22.2,
  },
  'tgr-playbook': {
    slug: 'tgr-playbook',
    label: 'TGR Playbook',
    // KNOWN DEAD as of 2026-10-04. This URL returns a 199KB HTML page rather
    // than the APK, so the button on the release page currently leads to a
    // broken download. It was left pointing at the same place on purpose: the
    // click still counts, which measures real interest, and fixing it is a
    // one-line edit here once the new Dropbox link is known.
    href: 'https://www.dropbox.com/scl/fi/p2ytwlj670h8438irwy3f/TGR_Playbook_base.apk?rlkey=f7fyo7dy7r0umhdz48tgivpg6&st=bf5hjgbb&dl=1',
    fileName: 'TGR_Playbook_base.apk',
    sizeMb: 0,
    broken: true,
  },
};

/**
 * Apps whose button should be counted but whose href is not a file.
 *
 * Empty right now, because all three release pages hand out a real APK. It
 * exists for the case that will eventually happen: a release page for
 * something that is not a downloadable file, where counting a "download" would
 * overstate the number. Put the slug in this set and it stays out of the CLI
 * table while still redirecting correctly.
 */
export const NON_COUNTED = new Set<string>();

/** The tracked apps, in the order they should appear in the CLI table. */
export const TRACKED = Object.values(DOWNLOADS)
  .filter((d) => !NON_COUNTED.has(d.slug))
  .sort((a, b) => a.label.localeCompare(b.label));

/** Where the count for one app is stored. */
export function counterKey(slug: string): string {
  return `dl:${slug}`;
}

/** The shape stored at that key. */
export interface DownloadStats {
  /** Total clicks ever. */
  total: number;
  /** Clicks per UTC day, `YYYY-MM-DD`. Capped so the record cannot grow without bound. */
  byDay: Record<string, number>;
  /**
   * Clicks per referrer hostname, plus the literal string 'direct' when there
   * was no referrer, and any `?ref=` campaign tag. Hostnames only — a full
   * Referer can contain somebody's search terms.
   */
  bySource: Record<string, number>;
  /** First click, for `npm run downloads` to show how long it has been running. */
  firstSeen?: string;
}

/** Days of daily detail to keep. Older days still count in `total`. */
export const DAILY_RETENTION_DAYS = 90;