import { PageIntro } from '@dutchipedia/ui/components/page-intro';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { PronunciationProvider } from '@/features/pronunciation/pronunciation-provider';
import { SoundHint } from '@/features/pronunciation/sound-hint';
import { ImageCredits } from '@/features/words/image-credits';
import type { WordTopic } from '@/features/words/types';
import { WordCard } from '@/features/words/word-card';

/** Shared page body for every word topic. Stays a Server Component — only the
 *  individual cards need the client, because only they speak. */
export function WordTopicPage({ topic }: { topic: WordTopic }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All topics
      </Link>

      <div className="mt-6">
        <PageIntro
          dutchTitle={topic.dutchTitle}
          title={topic.title}
          description={`${topic.description} Hover a picture, or tap it on a phone, to hear the name.`}
        >
          {/* Counted from the data so the page cannot drift out of date the
              way a number written into the prose would. */}
          <p className="mt-2 text-sm text-muted-foreground">{topic.entries.length} words</p>
        </PageIntro>
      </div>

      <PronunciationProvider>
        <SoundHint />
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {topic.entries.map((entry) => (
            <li key={entry.slug}>
              <WordCard entry={entry} />
            </li>
          ))}
        </ul>
      </PronunciationProvider>

      <ImageCredits entries={topic.entries} />
    </div>
  );
}
