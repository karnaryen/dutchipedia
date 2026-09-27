import { wordTopics } from '@/content/words/topics';
import type { WordSection, WordTopic } from '@/features/words/types';

/** Every topic and section, in index order. */
export function listWordTopics(): (WordTopic | WordSection)[] {
  return wordTopics;
}

/** What is served at /woordenschat/<slug>, or undefined for an unknown one. */
export function getWordTopic(slug: string): WordTopic | WordSection | undefined {
  return wordTopics.find((topic) => topic.slug === slug);
}

export function isWordSection(topic: WordTopic | WordSection): topic is WordSection {
  return 'groups' in topic;
}

export function listWordSections(): WordSection[] {
  return wordTopics.filter(isWordSection);
}

/** The topics of a section, in page order, without their headings. */
export function listSectionTopics(section: WordSection): WordTopic[] {
  return section.groups.flatMap((group) => group.topics);
}
