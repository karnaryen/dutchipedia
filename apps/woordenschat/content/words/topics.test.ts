import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { wordTopics } from './topics';

/**
 * The build verifies images (they are imported) but not audio (it is a URL
 * under public/), so a clip that was never generated would 404 silently in
 * production. This is the check the bundler cannot do.
 */
const publicDir = path.resolve(__dirname, '../../public');

describe('word topics', () => {
  it('have unique slugs', () => {
    const slugs = wordTopics.map((topic) => topic.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('are not empty', () => {
    for (const topic of wordTopics) {
      expect(topic.entries.length, topic.slug).toBeGreaterThan(0);
    }
  });

  describe.each(wordTopics.map((topic) => [topic.slug, topic] as const))('%s', (_, topic) => {
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
