/**
 * Type declarations for this Worker's own bindings.
 *
 * `npm run cf-typegen` writes `cloudflare-env.d.ts`, which declares the same
 * interface — but that file is in .gitignore, so it does not exist on a fresh
 * clone or in CI, and code that depends on it builds locally and fails
 * everywhere else. It was also stricter than the checked-in state and broke
 * type-checking in the contact form and its component.
 *
 * So the bindings are declared here, in a tracked file, and the code depends
 * on this rather than on generated output. If you add a binding to
 * wrangler.jsonc, add it here too; `npm run preflight` fails if the two
 * disagree.
 */

declare global {
  interface CloudflareEnv {
    /**
     * Download click counters, one key per app: `dl:<slug>`, holding a
     * DownloadStats record. See src/data/downloads.ts.
     */
    DOWNLOADS: KVNamespace;
  }
}

export {};
