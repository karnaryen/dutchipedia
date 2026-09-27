import { SectionCard } from '@dutchipedia/ui/components/section-card';
import { WorkInProgress } from '@dutchipedia/ui/components/work-in-progress';
import { sectionZones, zones } from '@dutchipedia/ui/lib/zones';

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <WorkInProgress>
        <span className="font-medium">Work in progress.</span> Dutchipedia is being built in the
        open — words and pictures are still being added, and things may change along the way.
      </WorkInProgress>

      <h1 className="font-heading mt-8 text-3xl font-semibold tracking-tight">
        Learn Dutch by looking
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Dutchipedia is a visual encyclopedia of Dutch words: photographs with their Dutch names,
        spoken aloud so you learn the sound along with the sight. And for programmers moving to a
        Dutch-speaking team, a guide to making the switch at work.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {sectionZones.map((id) => {
          const zone = zones[id];
          return (
            <SectionCard
              key={id}
              href={zone.path}
              dutchTitle={zone.dutchTitle}
              title={zone.title}
              description={zone.description}
              crossZone
            />
          );
        })}
      </div>

      <section aria-labelledby="planned" className="mt-16 border-t border-border pt-8">
        <h2 id="planned" className="font-heading text-xl font-medium">
          Being considered
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Help your kid</span> — how to support a
          child who is learning Dutch, from the first words to doing well at school.
        </p>
      </section>
    </div>
  );
}
