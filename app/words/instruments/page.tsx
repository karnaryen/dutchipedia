import type { Metadata } from 'next';

import { instruments } from '@/content/words/instruments/instruments';
import { WordTopic } from '@/features/words/word-topic';

export const metadata: Metadata = {
  title: 'Instruments — Dutchipedia',
  description: 'Dutch names for musical instruments, illustrated and spoken.',
};

export default function InstrumentsPage() {
  return (
    <WordTopic
      title="Instruments"
      dutchTitle="Muziekinstrumenten"
      description="Strings, winds, keys and percussion — the orchestra pit, the brass band and the folk festival. Hover a picture, or tap it on a phone, to hear the name."
      entries={instruments}
    />
  );
}
