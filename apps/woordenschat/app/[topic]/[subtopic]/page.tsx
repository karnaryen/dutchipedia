import { pageTitle } from '@dutchipedia/ui/lib/site';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { WordSection, WordTopic } from '@/features/words/types';
import { WordTopicPage } from '@/features/words/word-topic-page';
import {
  getWordTopic,
  isWordSection,
  listSectionTopics,
  listWordSections,
} from '@/features/words/word-topics';

/** One statically rendered page per topic of a section. Anything else is a
 *  404 — including a second segment under a topic that is not a section. */
export const dynamicParams = false;

export function generateStaticParams() {
  return listWordSections().flatMap((section) =>
    listSectionTopics(section).map((topic) => ({ topic: section.slug, subtopic: topic.slug })),
  );
}

function find(
  sectionSlug: string,
  topicSlug: string,
): { section: WordSection; topic: WordTopic } | undefined {
  const section = getWordTopic(sectionSlug);
  if (!section || !isWordSection(section)) return undefined;
  const topic = listSectionTopics(section).find((candidate) => candidate.slug === topicSlug);
  return topic && { section, topic };
}

export async function generateMetadata({
  params,
}: PageProps<'/[topic]/[subtopic]'>): Promise<Metadata> {
  const { topic, subtopic } = await params;
  const found = find(topic, subtopic);
  if (!found) return {};
  return {
    title: pageTitle(`${found.topic.title} — ${found.section.title}`),
    description: `Dutch names for ${found.topic.title.toLowerCase()}, illustrated and spoken. ${found.topic.description}`,
  };
}

export default async function SubtopicPage({ params }: PageProps<'/[topic]/[subtopic]'>) {
  const { topic, subtopic } = await params;
  const found = find(topic, subtopic);
  if (!found) notFound();

  return <WordTopicPage topic={found.topic} section={found.section} />;
}
