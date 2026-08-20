import { Hammer } from 'lucide-react';

import { SectionCard } from '@/components/section-card';

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      {/* Sits above the heading so it is read first, both by eye and by a
          screen reader. `role="status"` announces it without stealing focus. */}
      <div
        role="status"
        className="flex items-start gap-3 rounded-xl border border-iris-200 bg-accent px-4 py-3"
      >
        <Hammer className="mt-0.5 size-4 shrink-0 text-accent-foreground" aria-hidden="true" />
        <p className="text-sm text-accent-foreground">
          <span className="font-medium">Work in progress.</span> Dutchipedia is being built in the
          open — words and pictures are still being added, and things may change along the way.
        </p>
      </div>

      <h1 className="font-heading mt-8 text-3xl font-semibold tracking-tight">
        Explore Dutch through pictures
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Two ways in: build everyday vocabulary from photographs, or get ready to work in Dutch.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <SectionCard
          href="/words"
          dutchTitle="Woorden"
          title="Words"
          description="Learn nouns by sight. Pictures of trees, cats and dogs with their Dutch names — hover or tap to hear each one."
        />
        <SectionCard
          href="/work"
          dutchTitle="Werk"
          title="Work"
          description="The vocabulary and phrases you need for applying, interviewing and working in Dutch."
        />
      </div>
    </div>
  );
}
