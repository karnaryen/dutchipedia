import type { NextConfig } from 'next';

/**
 * The home app is also the router for the whole domain. Every other zone is a
 * separate Next.js app with its own `basePath`; requests under that path are
 * proxied to it here, assets included, because a zone's `_next/` folder is
 * served under its basePath too.
 *
 * Origins come from the environment so production points at the deployed
 * zones while `pnpm dev` points at the ports in each app's package.json.
 * Keep the path list in step with `packages/ui/src/lib/zones.ts`.
 */
const zoneOrigins = [
  { path: '/woordenschat', origin: process.env.WOORDENSCHAT_ORIGIN ?? 'http://localhost:3001' },
  {
    path: '/dutch-for-developers',
    origin: process.env.DUTCH_FOR_DEVELOPERS_ORIGIN ?? 'http://localhost:3002',
  },
];

const nextConfig: NextConfig = {
  // The agent rules live once, in the root AGENTS.md; do not write a copy per zone.
  agentRules: false,
  rewrites() {
    return zoneOrigins.flatMap(({ path, origin }) => [
      { source: path, destination: `${origin}${path}` },
      { source: `${path}/:path+`, destination: `${origin}${path}/:path+` },
    ]);
  },

  // The sections used to live at /words and /work. Bookmarks and search
  // results still point there.
  redirects() {
    return [
      { source: '/words', destination: '/woordenschat', permanent: true },
      { source: '/words/:topic', destination: '/woordenschat/:topic', permanent: true },
      { source: '/work', destination: '/dutch-for-developers', permanent: true },
    ];
  },
};

export default nextConfig;
