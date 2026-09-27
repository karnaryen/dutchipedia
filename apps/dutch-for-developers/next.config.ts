import type { NextConfig } from 'next';

/** The path this zone is served under. The home app proxies it here — see
 *  apps/home/next.config.ts. */
const basePath = '/dutch-for-developers';

const nextConfig: NextConfig = {
  // The agent rules live once, in the root AGENTS.md; do not write a copy per zone.
  agentRules: false,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
