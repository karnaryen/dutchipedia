import { wordTopics } from '@/content/words/topics';
import type { WordTopic } from '@/features/words/types';

/** Every topic, in index order. */
export function listWordTopics(): WordTopic[] {
  return wordTopics;
}

/** The topic served at /woordenschat/<slug>, or undefined for an unknown one. */
export function getWordTopic(slug: string): WordTopic | undefined {
  return wordTopics.find((topic) => topic.slug === slug);
}
