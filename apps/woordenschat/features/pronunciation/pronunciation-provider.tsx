'use client';

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';

import { withBasePath } from '@/lib/base-path';

import {
  createPronunciationPlayer,
  type PronunciationPlayer,
  type PronunciationStatus,
} from './pronunciation-player';

const PronunciationContext = createContext<PronunciationPlayer | null>(null);

/**
 * Owns one player for the cards inside it. Wrap the grid, not the page: the
 * player stops when this unmounts, which is what keeps a clip from carrying
 * on after the visitor has navigated to another route.
 */
export function PronunciationProvider({ children }: { children: React.ReactNode }) {
  const [player] = useState(() => createPronunciationPlayer({ resolveSrc: withBasePath }));

  useEffect(() => () => player.stop(), [player]);

  return <PronunciationContext value={player}>{children}</PronunciationContext>;
}

export function usePronunciationPlayer(): PronunciationPlayer {
  const player = useContext(PronunciationContext);
  if (!player) {
    throw new Error('usePronunciationPlayer must be used inside a PronunciationProvider');
  }
  return player;
}

const serverStatus: PronunciationStatus = 'idle';

export function usePronunciationStatus(): PronunciationStatus {
  const player = usePronunciationPlayer();
  return useSyncExternalStore(player.subscribe, player.getStatus, () => serverStatus);
}
