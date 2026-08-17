import type { Metadata } from 'next';

import { dogs } from '@/content/words/dogs/dogs';
import { WordTopic } from '@/features/words/word-topic';

export const metadata: Metadata = {
  title: 'Dogs — Dutchipedia',
  description: 'Dutch names for common dog breeds, illustrated and spoken.',
};

export default function DogsPage() {
  return (
    <WordTopic
      title="Dogs"
      dutchTitle="Honden"
      description="Dog breeds from de teckel to de Duitse dog. Hover a picture, or tap it on a phone, to hear the name."
      entries={dogs}
    />
  );
}
