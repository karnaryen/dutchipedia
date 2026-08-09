import { cn } from '@/lib/utils';

/**
 * Brand mark: an open book whose right cover rounds into a D, a page sweeping
 * across the top, and a magnifier lens resting on it — Dutchipedia looks words
 * up by picture.
 *
 * Three-tone, so it paints from `brand-*` token classes rather than
 * `currentColor`. The ring of background colour around the lens is what makes
 * it read as an object sitting on the book instead of a hole cut out of it;
 * keep that circle a little larger than the lens or the two shapes merge.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('size-8', className)}>
      <path
        className="fill-brand-ink"
        d="M6.4 5.8h9.2a10.9 10.9 0 0 1 0 21.8H6.4A1.4 1.4 0 0 1 5 26.2V7.2a1.4 1.4 0 0 1 1.4-1.4Z"
      />
      <path
        className="fill-brand-page"
        d="M7.4 10.9c3.6-2.4 7.2-2.4 10.8-.2l-1.8 3c-2.9-1.8-5.7-1.8-8.4 0z"
      />
      <circle cx="19.6" cy="19.2" r="6.4" className="fill-background" />
      <path
        className="stroke-brand-ink"
        strokeWidth="3"
        strokeLinecap="round"
        d="m23.6 23.2 3.3 3.5"
      />
      <circle cx="19.6" cy="19.2" r="5.2" className="fill-brand-lens" />
      <circle cx="21.6" cy="17.2" r="0.95" className="fill-background" />
    </svg>
  );
}
