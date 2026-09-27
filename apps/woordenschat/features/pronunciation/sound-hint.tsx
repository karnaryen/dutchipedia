'use client';

import { VolumeX } from 'lucide-react';

import { usePronunciationStatus } from './pronunciation-provider';

/**
 * Explains the one thing the player cannot fix: browsers keep audio off until
 * the visitor has clicked or tapped the page. Shows only after a hover has
 * actually been refused, so first-time visitors on touch devices — where a
 * tap always counts — never see it.
 */
export function SoundHint() {
  const status = usePronunciationStatus();
  // Kept in the tree while hidden so the live region exists before it has
  // something to announce.
  return (
    <p
      role="status"
      hidden={status !== 'blocked'}
      className="mt-4 flex items-start gap-2 rounded-lg border border-iris-200 bg-accent px-3 py-2 text-sm text-accent-foreground"
    >
      <VolumeX className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>
        Sound is off until you click or tap once anywhere on the page — the browser asks for that
        before it will play audio.
      </span>
    </p>
  );
}
