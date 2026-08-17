import type { Metadata } from 'next';

import { SectionCard } from '@/components/section-card';

export const metadata: Metadata = {
  title: 'Words — Dutchipedia',
  description: 'Learn Dutch nouns from photographs, grouped by topic.',
};

export default function WordsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <p className="text-sm font-medium text-link">Woorden</p>
      <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight">Words</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Pick a topic. Every picture carries its Dutch name — hover it, or tap on a phone, to hear
        how it sounds.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <SectionCard
          href="/words/trees"
          dutchTitle="Bomen"
          title="Trees"
          description="Native trees, orchard trees and canal-side planting."
        />
        <SectionCard
          href="/words/cats"
          dutchTitle="Katten"
          title="Cats"
          description="Thirty breeds, from de pers to de sphynx."
        />
        <SectionCard
          href="/words/dogs"
          dutchTitle="Honden"
          title="Dogs"
          description="Thirty breeds, from de teckel to de Duitse dog."
        />
      </div>
    </div>
  );
}
