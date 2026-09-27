import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * A card that opens a section: a zone from the home page, or a topic inside
 * one. Set `crossZone` when the target lives in another zone — that is a
 * full page load, which `next/link` cannot do. See `lib/zones.ts`.
 */
export function SectionCard({
  href,
  title,
  dutchTitle,
  description,
  crossZone = false,
}: {
  href: string;
  title: string;
  dutchTitle: string;
  description: string;
  crossZone?: boolean;
}) {
  const className =
    'group flex flex-col rounded-2xl border border-border p-6 transition-colors hover:border-iris-300 hover:bg-accent';
  const body = (
    <>
      <span className="text-sm font-medium text-link">{dutchTitle}</span>
      <span className="font-heading mt-1 text-xl font-semibold tracking-tight">{title}</span>
      <span className="mt-2 text-sm text-muted-foreground">{description}</span>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-link">
        Open
        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </>
  );

  return crossZone ? (
    <a href={href} className={className}>
      {body}
    </a>
  ) : (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}
