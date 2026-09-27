import type { NextConfig } from 'next';

/** The path this zone is served under. The home app proxies it here — see
 *  apps/home/next.config.ts. */
const basePath = '/woordenschat';

const nextConfig: NextConfig = {
  // The agent rules live once, in the root AGENTS.md; do not write a copy per zone.
  agentRules: false,
  basePath,
  // `next/link` and `next/image` prefix the basePath on their own; plain
  // URLs such as the audio clips in `public/` do not. `lib/base-path.ts`
  // reads this so the rest of the app never spells the prefix out.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
