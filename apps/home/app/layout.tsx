import { SiteLayout } from '@dutchipedia/ui/components/site-layout';
import { site } from '@dutchipedia/ui/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: site.name,
  description: site.tagline,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return <SiteLayout zone="home">{children}</SiteLayout>;
}
