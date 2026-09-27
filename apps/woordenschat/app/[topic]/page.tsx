import { pageTitle } from '@dutchipedia/ui/lib/site';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { WordTopicPage } from '@/features/words/word-topic-page';
import { getWordTopic, listWordTopics } from '@/features/words/word-topics';

/** One statically rendered page per topic in content/words/topics.ts.
 *  Anything else is a 404 rather than a render attempt. */
export const dynamicParams = false;

export function generateStaticParams() {
  return listWordTopics().map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[topic]'>): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getWordTopic(slug);
  if (!topic) return {};
  return {
    title: pageTitle(topic.title),
    description: `Dutch names for ${topic.title.toLowerCase()}, illustrated and spoken. ${topic.description}`,
  };
}

export default async function TopicPage({ params }: PageProps<'/[topic]'>) {
  const { topic: slug } = await params;
  const topic = getWordTopic(slug);
  if (!topic) notFound();

  return <WordTopicPage topic={topic} />;
}
