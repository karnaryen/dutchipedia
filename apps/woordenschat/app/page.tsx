import { PageIntro } from '@dutchipedia/ui/components/page-intro';
import { SectionCard } from '@dutchipedia/ui/components/section-card';
import { zones } from '@dutchipedia/ui/lib/zones';

import { listWordTopics } from '@/features/words/word-topics';

export default function WoordenschatPage() {
  const topics = listWordTopics();
  const zone = zones.woordenschat;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <PageIntro
        dutchTitle={zone.dutchTitle}
        title={zone.title}
        description="Pick a topic. Every picture carries its Dutch name — hover it, or tap on a phone, to hear how it sounds."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topics.map((topic) => (
          <SectionCard
            key={topic.slug}
            href={`/${topic.slug}`}
            dutchTitle={topic.dutchTitle}
            title={topic.title}
            description={topic.description}
          />
        ))}
      </div>
    </div>
  );
}
