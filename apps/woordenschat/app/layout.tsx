import { SiteLayout } from '@dutchipedia/ui/components/site-layout';
import { pageTitle, siteIcons } from '@dutchipedia/ui/lib/site';
import { zones } from '@dutchipedia/ui/lib/zones';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: pageTitle(zones.woordenschat.dutchTitle),
  description: zones.woordenschat.description,
  icons: siteIcons,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return <SiteLayout zone="woordenschat">{children}</SiteLayout>;
}
