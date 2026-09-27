import type { Metadata } from 'next';

/** Copy that has to read the same in every zone. */
export const site = {
  name: 'Dutchipedia',
  tagline: 'The visual encyclopedia of Dutch words',
} as const;

/**
 * The icon files live in apps/home/app, where Next's file conventions pick
 * them up. The other zones have no copy, so they point at the home zone's
 * URLs — absolute, and outside any basePath.
 */
export const siteIcons: NonNullable<Metadata['icons']> = {
  icon: [
    { url: '/icon.svg', type: 'image/svg+xml' },
    { url: '/favicon.ico', sizes: '32x32' },
  ],
  apple: '/apple-icon.png',
};

/** `Cats — Dutchipedia`: the pattern every page title follows. */
export function pageTitle(title: string) {
  return `${title} — ${site.name}`;
}
