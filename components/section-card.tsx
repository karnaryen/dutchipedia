import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function SectionCard({
  href,
  title,
  dutchTitle,
  description,
}: {
  href: string;
  title: string;
  dutchTitle: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-border p-6 transition-colors hover:border-iris-300 hover:bg-accent"
    >
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
    </Link>
  );
}
