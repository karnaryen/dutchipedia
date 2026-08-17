import { SectionCard } from '@/components/section-card';

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
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
