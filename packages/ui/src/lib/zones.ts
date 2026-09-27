/**
 * The zones that make up dutchipedia.nl.
 *
 * Each zone is a separate Next.js app under `apps/`, served under its own
 * path prefix and stitched into one domain by the rewrites in
 * `apps/home/next.config.ts`. This table is what the shared chrome (header,
 * home page cards) is built from, so adding a zone here is what makes it
 * appear in the navigation.
 *
 * A link from one zone into another is a full page load, so it must be a
 * plain `<a>`: `next/link` would try to prefetch and soft-navigate a route
 * the current app does not have. Within a zone, keep using `next/link`.
 */
export interface Zone {
  /** Path prefix on the shared domain. The home zone owns `/`. */
  path: string;
  /** English name, used in the header and on cards. */
  title: string;
  /** Dutch name, shown as the eyebrow above the title. */
  dutchTitle: string;
  /** One sentence on what the zone is for. */
  description: string;
}

export const zones = {
  home: {
    path: '/',
    title: 'Home',
    dutchTitle: 'Start',
    description: 'A visual encyclopedia of Dutch words.',
  },
  woordenschat: {
    path: '/woordenschat',
    title: 'Vocabulary',
    dutchTitle: 'Woordenschat',
    description:
      'Learn nouns by sight. Photographs with their Dutch names — hover or tap to hear each one spoken.',
  },
  dutchForDevelopers: {
    path: '/dutch-for-developers',
    title: 'Dutch for developers',
    dutchTitle: 'Nederlands voor ontwikkelaars',
    description:
      'Making the switch to Dutch at work as a programmer: the words, the phrases and the habits that help.',
  },
} as const satisfies Record<string, Zone>;

export type ZoneId = keyof typeof zones;

/** Every zone except home, in navigation order. */
export const sectionZones: readonly ZoneId[] = ['woordenschat', 'dutchForDevelopers'];
