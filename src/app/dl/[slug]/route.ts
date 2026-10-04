import { NextResponse, type NextRequest } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { DOWNLOADS, NON_COUNTED, counterKey, DAILY_RETENTION_DAYS, type DownloadStats } from '@/data/downloads';

/**
 * Counts a download-button click, then forwards to the file.
 *
 * Why a redirect instead of counting the click in the browser: a JavaScript
 * beacon can be blocked by an extension, does not fire when someone opens a
 * shared link in a chat client, and cannot tell the difference between a
 * person and a crawler. A server-side redirect on this domain counts every
 * time, with no client code and nothing for anyone to suppress.
 *
 * What it counts is a click, not a completed download. The bytes are served by
 * Dropbox, which reports nothing back, so there is no way to know the transfer
 * finished. Everything user-facing is worded "click" for that reason.
 */

export const dynamic = 'force-dynamic';

/**
 * Reduce a Referer or `?ref=` value to something safe to store and read.
 *
 * Two things matter here. Only the hostname is kept: a full Referer can carry
 * a search query, and "google.com" is the useful part anyway. And the value is
 * capped and stripped of characters, so a crafted Referer cannot bloat the
 * record or inject anything into the terminal output of `npm run downloads`.
 */
export function normaliseSource(raw: string | null): string | null {
  if (!raw) return null;
  const value = raw.trim().toLowerCase();
  if (!value) return null;

  // A bare campaign tag such as "facebook" stays as-is.
  if (/^[a-z0-9_-]{1,32}$/.test(value)) return value;

  // Otherwise treat it as a URL and keep only the hostname.
  try {
    const host = new URL(value.includes('://') ? value : `https://${value}`).hostname;
    return host.replace(/^www\./, '').slice(0, 60) || null;
  } catch {
    return null;
  }
}

/**
 * Work out where the click came from.
 *
 * A click on a release page sends that page as its Referer, which on its own
 * only ever says "they were on a release page" — useless. The useful signal is
 * the `?ref=` campaign tag the visitor arrived with, which survives the page
 * being forwarded in a WhatsApp group. It is read from an explicit `?ref=` on
 * this URL first, then from the Referer's own query string, because the
 * download pages are static HTML and cannot rewrite their own button href.
 */
export function resolveSource(request: NextRequest): string | null {
  const explicit = request.nextUrl.searchParams.get('ref');
  if (explicit) return normaliseSource(explicit);

  const referer = request.headers.get('referer');
  if (!referer) return null;
  try {
    const url = new URL(referer);
    const ref = url.searchParams.get('ref');
    return ref ? normaliseSource(ref) : null;
  } catch {
    return null;
  }
}

/** A plain object of counts, guarding against anything non-numeric. */
function countMap(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') return {};
  const out: Record<string, number> = {};
  for (const [key, count] of Object.entries(value)) {
    const n = Number(count);
    // The key is also used as a terminal column, so anything that could carry
    // a control character or a stray escape is dropped rather than printed.
    if (Number.isFinite(n) && /^[a-z0-9.:_-]{1,64}$/.test(key)) out[key] = n;
  }
  return out;
}

/**
 * Rebuild a stats record from whatever was in KV.
 *
 * Written as a rebuild rather than a cast because `get(key, 'json')` is typed
 * `unknown`, and a cast would tell TypeScript to trust a value that could be
 * anything — including a hand-edited or truncated one. Every field is checked,
 * so a corrupt record degrades to zeroes instead of poisoning the totals.
 */
function reviveStats(raw: unknown): DownloadStats {
  const empty: DownloadStats = { total: 0, byDay: {}, bySource: {} };
  if (!raw || typeof raw !== 'object') return empty;

  const obj = raw as Record<string, unknown>;
  const total = Number(obj.total);
  const firstSeen = typeof obj.firstSeen === 'string' ? obj.firstSeen : undefined;

  return {
    total: Number.isFinite(total) && total > 0 ? total : 0,
    byDay: countMap(obj.byDay),
    bySource: countMap(obj.bySource),
    firstSeen,
  };
}

/**
 * Add one click to the stored record.
 *
 * Read-then-write rather than an atomic increment, because Workers KV has no
 * increment operation. At this volume two simultaneous clicks on the same key
 * is not a realistic scenario, and the worst outcome is one lost click out of
 * tens. The failure mode is documented rather than papered over.
 */
async function countClick(env: CloudflareEnv, slug: string, source: string | null): Promise<void> {
  const key = counterKey(slug);
  let stats: DownloadStats = { total: 0, byDay: {}, bySource: {} };

  const existing = await env.DOWNLOADS.get(key, 'json');
  stats = reviveStats(existing);

  const today = new Date().toISOString().slice(0, 10);
  stats.total += 1;
  stats.byDay[today] = (stats.byDay[today] ?? 0) + 1;
  stats.firstSeen ??= today;

  const label = source ?? 'direct';
  stats.bySource[label] = (stats.bySource[label] ?? 0) + 1;

  // Bound the daily map so the record cannot grow forever. Totals are
  // unaffected — this only trims history the CLI would never show.
  const days = Object.keys(stats.byDay).sort();
  if (days.length > DAILY_RETENTION_DAYS) {
    for (const day of days.slice(0, days.length - DAILY_RETENTION_DAYS)) {
      delete stats.byDay[day];
    }
  }

  await env.DOWNLOADS.put(key, JSON.stringify(stats));
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const target = DOWNLOADS[slug];

  if (!target) {
    return new NextResponse('Unknown download.', {
      status: 404,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    });
  }

  // TGR Playbook has no file behind it, so counting it would inflate the total.
  if (NON_COUNTED.has(slug)) {
    return NextResponse.redirect(target.href, 307);
  }

  const source = resolveSource(request);

  try {
    const { env } = await getCloudflareContext({ async: true });
    await countClick(env, slug, source);
  } catch {
    // A counting failure must never cost someone the file. If KV is
    // unreachable the visitor still gets their download; only the number is
    // lost, and the preflight check will notice the binding is wrong.
  }

  // 307, not 302: the file is not ours, so the hop must never be cached as
  // though it were. A cached redirect would keep serving after the URL changed.
  const response = NextResponse.redirect(target.href, 307);
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('Cache-Control', 'no-store');
  return response;
}