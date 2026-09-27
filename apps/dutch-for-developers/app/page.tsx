import { PageIntro } from '@dutchipedia/ui/components/page-intro';
import { WorkInProgress } from '@dutchipedia/ui/components/work-in-progress';
import { zones } from '@dutchipedia/ui/lib/zones';

const zone = zones.dutchForDevelopers;

export default function DutchForDevelopersPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <PageIntro dutchTitle={zone.dutchTitle} title={zone.title} description={zone.description} />

      <div className="mt-8">
        <WorkInProgress>
          <span className="font-medium">Nothing here yet.</span> This section is being written. It
          will cover the vocabulary of stand-ups, code reviews and job interviews, and how to start
          using Dutch with colleagues without slowing the team down.
        </WorkInProgress>
      </div>
    </div>
  );
}
