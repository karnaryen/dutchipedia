import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { isWordSection, listSectionTopics } from '@/features/words/word-topics';

import { wordTopics } from './topics';

/**
 * The build verifies images (they are imported) but not audio (it is a URL
 * under public/), so a clip that was never generated would 404 silently in
 * production. This is the check the bundler cannot do.
 */
const publicDir = path.resolve(__dirname, '../../public');

/** Every topic that holds words, named by its URL: "cats", "body/senses". */
const leaves = wordTopics.flatMap((topic) =>
  isWordSection(topic)
    ? listSectionTopics(topic).map((child) => [`${topic.slug}/${child.slug}`, child] as const)
    : [[topic.slug, topic] as const],
);

describe('word topics', () => {
  it('have unique slugs', () => {
    const slugs = wordTopics.map((topic) => topic.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('have unique slugs inside a section', () => {
    for (const section of wordTopics.filter(isWordSection)) {
      const slugs = listSectionTopics(section).map((topic) => topic.slug);
      expect(new Set(slugs).size, section.slug).toBe(slugs.length);
    }
  });

  it('are not empty', () => {
    for (const [name, topic] of leaves) {
      expect(topic.entries.length, name).toBeGreaterThan(0);
    }
  });

  describe.each(leaves)('%s', (name, topic) => {
    it('keeps its clips under its own path', () => {
      for (const entry of topic.entries) {
        expect(entry.audio, entry.slug).toBe(`/audio/words/${name}/${entry.slug}.m4a`);
      }
    });

    it('has unique entry slugs', () => {
      const slugs = topic.entries.map((entry) => entry.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it('has an audio clip on disk for every entry', () => {
      const missing = topic.entries
        .filter((entry) => !fs.existsSync(path.join(publicDir, entry.audio)))
        .map((entry) => entry.audio);
      expect(missing).toEqual([]);
    });

    it('credits every photo', () => {
      for (const entry of topic.entries) {
        expect(entry.credit.author, entry.slug).not.toBe('');
        expect(entry.credit.license, entry.slug).not.toBe('');
        expect(entry.credit.file, entry.slug).not.toBe('');
      }
    });
  });
});
