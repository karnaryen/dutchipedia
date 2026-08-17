'use client';

import { Volume2 } from 'lucide-react';
import Image from 'next/image';

import { playPronunciation } from '@/features/words/play-pronunciation';
import type { WordEntry } from '@/features/words/types';

export function WordCard({ entry }: { entry: WordEntry }) {
  return (
    <button
      type="button"
      // Hover is the desktop affordance. Touch devices have no hover, so the
      // click handler carries them — and it doubles as the keyboard path.
      // Filtering on pointerType stops a tap firing both and stuttering.
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') playPronunciation(entry.audio);
      }}
      onClick={() => playPronunciation(entry.audio)}
      aria-label={`${entry.dutch} — ${entry.english}. Play the Dutch pronunciation.`}
      className="group flex w-full flex-col gap-3 rounded-xl text-left"
    >
      {/* Mat with object-contain: the photos are a mix of portrait (trees,
          cats) and landscape (dogs), and the old fixed 4:3 crop cut the tall
          ones in half. Contain crops nothing; the 4:5 box leans portrait
          because two thirds of the photos are, without starving the
          landscape ones. */}
      <span className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl border border-surface-soft-border bg-surface-soft p-3">
        <Image
          src={entry.image}
          alt={entry.english}
          placeholder="blur"
          sizes="(min-width: 768px) 260px, 45vw"
          className="h-full w-full rounded-md object-contain transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1.5">
          <span className="font-heading text-base font-medium">{entry.dutch}</span>
          <Volume2
            className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-link"
            aria-hidden="true"
          />
        </span>
        <span className="text-sm text-muted-foreground">{entry.english}</span>
      </span>
    </button>
  );
}
