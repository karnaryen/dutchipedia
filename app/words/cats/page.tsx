import type { Metadata } from 'next';

import { cats } from '@/content/words/cats/cats';
import { WordTopic } from '@/features/words/word-topic';

export const metadata: Metadata = {
  title: 'Cats — Dutchipedia',
  description: 'Dutch names for common cat breeds, illustrated and spoken.',
};

export default function CatsPage() {
  return (
    <WordTopic
      title="Cats"
      dutchTitle="Katten"
      description="Cat breeds from de pers to de sphynx. Hover a picture, or tap it on a phone, to hear the name."
      entries={cats}
    />
  );
}
