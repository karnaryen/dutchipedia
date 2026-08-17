import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import type { WordEntry } from '@/features/words/types';
import { WordCard } from '@/features/words/word-card';

/** Shared page body for every word topic. Stays a Server Component — only the
 *  individual cards need the client, because only they speak. */
export function WordTopic({
  title,
  dutchTitle,
  description,
  entries,
}: {
  title: string;
  dutchTitle: string;
  description: string;
  entries: WordEntry[];
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <Link
        href="/words"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All words
      </Link>

      <p className="mt-6 text-sm font-medium text-link">{dutchTitle}</p>
      <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
      {/* Counted from the data so the page cannot drift out of date the way a
          number written into the prose would. */}
      <p className="mt-2 text-sm text-muted-foreground">{entries.length} words</p>

      <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {entries.map((entry) => (
          <li key={entry.slug}>
            <WordCard entry={entry} />
          </li>
        ))}
      </ul>

      <section aria-labelledby="credits" className="mt-16 border-t border-border pt-6">
        <h2 id="credits" className="text-sm font-medium">
          Image credits
        </h2>
        {/* CC BY and CC BY-SA ask for four things: the author, a link to the
            source, the licence *linked* rather than just named, and a note of
            any changes. Every photo here was resized, hence the blanket line. */}
        <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
          Photographs come from Wikimedia Commons and are reproduced under the licences below. All
          have been resized for this site; they are otherwise unaltered.
        </p>
        <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
          {entries.map((entry) => (
            <li key={entry.slug}>
              {entry.dutch} —{' '}
              <a
                href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(entry.credit.file)}`}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-link"
              >
                {entry.credit.file}
              </a>{' '}
              by {entry.credit.author},{' '}
              {entry.credit.licenseUrl ? (
                <a
                  href={entry.credit.licenseUrl}
                  target="_blank"
                  rel="license noreferrer"
                  className="underline underline-offset-2 hover:text-link"
                >
                  {entry.credit.license}
                </a>
              ) : (
                entry.credit.license
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
