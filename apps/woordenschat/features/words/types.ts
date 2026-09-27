import type { StaticImageData } from 'next/image';

/** Where a photo came from. CC licences require attribution, so this travels
 *  with the entry rather than living in a comment. */
export interface ImageCredit {
  author: string;
  license: string;
  /** Link to the licence deed. CC BY and CC BY-SA require the licence to be
   *  linked, not merely named. Empty for the few files whose Commons entry
   *  records no URL — public domain and similar. */
  licenseUrl: string;
  /** File name on Wikimedia Commons, used to build the source link. */
  file: string;
}

/** One illustrated word: the picture, the Dutch phrase spoken on hover, and
 *  its English gloss. */
export interface WordEntry {
  slug: string;
  /** Article included — a Dutch noun is only half learned without its gender. */
  dutch: string;
  english: string;
  image: StaticImageData;
  /** Zone-relative URL of the clip under public/audio/words, e.g.
   *  `/audio/words/cats/pers.m4a`. Audio cannot be imported statically the
   *  way images are, so it is referenced by path and produced by
   *  scripts/generate-pronunciations.py. */
  audio: `/${string}`;
  credit: ImageCredit;
}

/** A group of words with one page: trees, cats, dogs… Generated from
 *  scripts/word-topics.json, which is where new topics are added. */
export interface WordTopic {
  /** URL segment: /woordenschat/<slug>. */
  slug: string;
  title: string;
  dutchTitle: string;
  /** One sentence, shown on the index card and as the page lede. */
  description: string;
  entries: WordEntry[];
}
