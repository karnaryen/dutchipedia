import Link from 'next/link';

import { Logo } from '@/components/logo';

export function Header() {
  return (
    <header className="border-b border-border">
      {/* Nav will land in this row, to the right of the wordmark. */}
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 rounded-lg">
          <Logo className="size-9 shrink-0" />
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-lg font-semibold tracking-tight">Dutchipedia</span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              The visual encyclopedia of Dutch words
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
