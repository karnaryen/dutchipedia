import { Logo } from '@dutchipedia/ui/components/logo';
import { site } from '@dutchipedia/ui/lib/site';
import { cn } from '@dutchipedia/ui/lib/utils';
import { sectionZones, type ZoneId, zones } from '@dutchipedia/ui/lib/zones';

/**
 * Site header, rendered by every zone. Navigation uses plain anchors because
 * any of these links may cross into another zone — see `lib/zones.ts`.
 */
export function Header({ activeZone }: { activeZone: ZoneId }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4">
        <a href={zones.home.path} className="flex items-center gap-3 rounded-lg">
          <Logo className="size-9 shrink-0" />
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-lg font-semibold tracking-tight">{site.name}</span>
            <span className="hidden text-xs text-muted-foreground sm:block">{site.tagline}</span>
          </span>
        </a>

        <nav aria-label="Sections">
          {/* -mx-3 lets the first link's padding line up with the logo on the
              narrow layout, where the nav wraps under the wordmark. */}
          <ul className="-mx-3 flex flex-wrap gap-1">
            {sectionZones.map((id) => {
              const zone = zones[id];
              const isActive = id === activeZone;
              return (
                <li key={id}>
                  <a
                    href={zone.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'inline-flex rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                      isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {zone.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
