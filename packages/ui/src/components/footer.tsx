import { site } from '@dutchipedia/ui/lib/site';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-sm text-muted-foreground">
        {/* Literal year, by request. `getFullYear()` would be no safer: this
            page is statically prerendered, so the year freezes at build time
            either way — it would just hide that fact. Bump it by hand. */}
        <p>© 2026 {site.name}</p>
        <p>{site.tagline}</p>
      </div>
    </footer>
  );
}
