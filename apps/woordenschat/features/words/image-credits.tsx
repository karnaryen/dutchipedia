import type { WordEntry } from '@/features/words/types';

/** The attribution block under every topic. CC BY and CC BY-SA ask for four
 *  things: the author, a link to the source, the licence *linked* rather than
 *  just named, and a note of any changes. */
export function ImageCredits({ entries }: { entries: WordEntry[] }) {
  return (
    <section aria-labelledby="credits" className="mt-16 border-t border-border pt-6">
      <h2 id="credits" className="text-sm font-medium">
        Image credits
      </h2>
      {/* Every image here was resized and re-encoded as WebP, a drawing that
          Commons holds as an SVG included, hence the blanket line. */}
      <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
        Photographs and drawings come from Wikimedia Commons and are reproduced under the licences
        below. All have been resized and converted to WebP for this site; they are otherwise
        unaltered.
      </p>
      {/* Commons file names run to fifty unbroken characters with underscores;
          without wrap-anywhere one of them widens the page on a phone. */}
      <ul className="mt-3 space-y-1 text-xs wrap-anywhere text-muted-foreground">
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
  );
}
