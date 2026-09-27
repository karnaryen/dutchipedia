import '@dutchipedia/ui/globals.css';

import { Analytics } from '@dutchipedia/ui/components/analytics';
import { Footer } from '@dutchipedia/ui/components/footer';
import { Header } from '@dutchipedia/ui/components/header';
import { geistMono, geistSans } from '@dutchipedia/ui/lib/fonts';
import type { ZoneId } from '@dutchipedia/ui/lib/zones';

/**
 * The root layout every zone renders. Zones are separate Next.js apps, so
 * each has its own `app/layout.tsx`; this keeps the document, fonts, chrome
 * and analytics in one place so the three cannot drift apart.
 */
export function SiteLayout({ zone, children }: { zone: ZoneId; children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header activeZone={zone} />
        {/* Grows to fill the viewport so the footer sits at the bottom on
            short pages instead of floating mid-screen. */}
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
