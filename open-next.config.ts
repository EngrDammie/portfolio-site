import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// This app has no ISR or revalidate() calls, so no incremental cache
// override is needed. Add one here if you later add dynamic revalidation.
export default defineCloudflareConfig();
