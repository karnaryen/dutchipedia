import { PageIntro } from '@dutchipedia/ui/components/page-intro';
import { SectionCard } from '@dutchipedia/ui/components/section-card';

import { BackLink } from '@/features/words/back-link';
import type { WordSection } from '@/features/words/types';
import { listSectionTopics } from '@/features/words/word-topics';

/** The page of a section: its topics as cards, under the headings the data
 *  groups them by. */
export function WordSectionPage({ section }: { section: WordSection }) {
  const topics = listSectionTopics(section);
  const words = topics.reduce((total, topic) => total + topic.entries.length, 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <BackLink href="/">All topics</BackLink>

      <div className="mt-6">
        <PageIntro
          dutchTitle={section.dutchTitle}
          title={section.title}
          description={section.description}
        >
          <p className="mt-2 text-sm text-muted-foreground">
            {words} words in {topics.length} topics
          </p>
        </PageIntro>
      </div>

      {section.groups.map((group) => (
        <section key={group.title} aria-labelledby={headingId(group.title)} className="mt-12">
          <p className="text-sm font-medium text-link">{group.dutchTitle}</p>
          <h2
            id={headingId(group.title)}
            className="font-heading mt-1 text-xl font-semibold tracking-tight"
          >
            {group.title}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.topics.map((topic) => (
              <SectionCard
                key={topic.slug}
                href={`/${section.slug}/${topic.slug}`}
                dutchTitle={topic.dutchTitle}
                title={topic.title}
                description={`${topic.description} ${topic.entries.length} words.`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function headingId(title: string): string {
  return title.toLowerCase().replaceAll(' ', '-');
}
