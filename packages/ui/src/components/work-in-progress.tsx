import { Hammer } from 'lucide-react';

/**
 * The "still being built" notice. Sits above a page's heading so it is read
 * first, both by eye and by a screen reader; `role="status"` announces it
 * without stealing focus.
 */
export function WorkInProgress({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-xl border border-iris-200 bg-accent px-4 py-3"
    >
      <Hammer className="mt-0.5 size-4 shrink-0 text-accent-foreground" aria-hidden="true" />
      <p className="text-sm text-accent-foreground">{children}</p>
    </div>
  );
}
