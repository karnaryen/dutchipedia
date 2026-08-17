import type { Metadata } from 'next';

import { trees } from '@/content/words/trees/trees';
import { WordTopic } from '@/features/words/word-topic';

export const metadata: Metadata = {
  title: 'Trees — Dutchipedia',
  description: 'Dutch names for common trees, illustrated and spoken.',
};

export default function TreesPage() {
  return (
    <WordTopic
      title="Trees"
      dutchTitle="Bomen"
      description="Native trees, orchard trees and the ones planted along canals. Hover a picture, or tap it on a phone, to hear the name."
      entries={trees}
    />
  );
}
