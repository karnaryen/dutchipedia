import { SiteLayout } from '@dutchipedia/ui/components/site-layout';
import { pageTitle, siteIcons } from '@dutchipedia/ui/lib/site';
import { zones } from '@dutchipedia/ui/lib/zones';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: pageTitle(zones.dutchForDevelopers.title),
  description: zones.dutchForDevelopers.description,
  icons: siteIcons,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return <SiteLayout zone="dutchForDevelopers">{children}</SiteLayout>;
}
