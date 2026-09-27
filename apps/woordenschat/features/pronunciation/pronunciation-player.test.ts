import { describe, expect, it, vi } from 'vitest';

import { createPronunciationPlayer } from './pronunciation-player';

/** Enough of HTMLAudioElement for the player: src, play/pause, and events. */
class FakeAudio {
  src = '';
  preload = '';
  currentTime = 0;
  paused = true;
  playCalls: string[] = [];
  pauseCalls = 0;
  /** What the next play() does. */
  nextPlay: 'ok' | 'not-allowed' | 'not-supported' = 'ok';
  private listeners = new Map<string, Set<() => void>>();

  play() {
    this.playCalls.push(this.src);
    if (this.nextPlay === 'not-allowed') {
      return Promise.reject(new DOMException('gesture required', 'NotAllowedError'));
    }
    if (this.nextPlay === 'not-supported') {
      return Promise.reject(new DOMException('no source', 'NotSupportedError'));
    }
    this.paused = false;
    return Promise.resolve();
  }

  pause() {
    this.pauseCalls += 1;
    this.paused = true;
  }

  addEventListener(type: string, listener: () => void) {
    const set = this.listeners.get(type) ?? new Set();
    set.add(listener);
    this.listeners.set(type, set);
  }

  dispatch(type: string) {
    this.listeners.get(type)?.forEach((listener) => listener());
  }
}

/** A document that only knows about capture-phase click listeners. */
class FakeDocument {
  clickListeners = new Set<() => void>();
  addEventListener(_type: string, listener: () => void) {
    this.clickListeners.add(listener);
  }
  removeEventListener(_type: string, listener: () => void) {
    this.clickListeners.delete(listener);
  }
  click() {
    [...this.clickListeners].forEach((listener) => listener());
  }
}

function setup() {
  const audio = new FakeAudio();
  const doc = new FakeDocument();
  const player = createPronunciationPlayer({
    resolveSrc: (src) => `/zone${src}`,
    createAudio: () => audio as unknown as HTMLAudioElement,
    getDocument: () => doc as unknown as Document,
  });
  return { audio, doc, player };
}

describe('createPronunciationPlayer', () => {
  it('does not touch the browser until the first play', () => {
    const createAudio = vi.fn(() => new FakeAudio() as unknown as HTMLAudioElement);
    const player = createPronunciationPlayer({ createAudio });
    expect(createAudio).not.toHaveBeenCalled();
    expect(player.getStatus()).toBe('idle');
  });

  it('plays the resolved URL and reports playing', async () => {
    const { audio, player } = setup();
    await expect(player.play('/audio/words/cats/pers.m4a')).resolves.toBe('played');
    expect(audio.playCalls).toEqual(['/zone/audio/words/cats/pers.m4a']);
    expect(player.getStatus()).toBe('playing');
  });

  it('pauses the previous clip before starting the next one', async () => {
    const { audio, player } = setup();
    await player.play('/a.m4a');
    await player.play('/b.m4a');
    expect(audio.pauseCalls).toBe(2);
    expect(audio.src).toBe('/zone/b.m4a');
  });

  it('returns to idle when the clip ends', async () => {
    const { audio, player } = setup();
    await player.play('/a.m4a');
    audio.dispatch('ended');
    expect(player.getStatus()).toBe('idle');
  });

  it('reports blocked when the browser wants a gesture first, then plays on the first click', async () => {
    const { audio, doc, player } = setup();
    const listener = vi.fn();
    player.subscribe(listener);

    audio.nextPlay = 'not-allowed';
    await expect(player.play('/a.m4a')).resolves.toBe('blocked');
    expect(player.getStatus()).toBe('blocked');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(doc.clickListeners.size).toBe(1);

    audio.nextPlay = 'ok';
    doc.click();
    await vi.waitFor(() => expect(player.getStatus()).toBe('playing'));
    expect(audio.playCalls).toEqual(['/zone/a.m4a', '/zone/a.m4a']);
    expect(doc.clickListeners.size).toBe(0);
  });

  it('stop silences the clip, clears a blocked request and disarms the click listener', async () => {
    const { audio, doc, player } = setup();
    audio.nextPlay = 'not-allowed';
    await player.play('/a.m4a');

    player.stop();
    expect(player.getStatus()).toBe('idle');
    expect(doc.clickListeners.size).toBe(0);
    expect(audio.paused).toBe(true);
    expect(audio.currentTime).toBe(0);

    audio.nextPlay = 'ok';
    doc.click();
    expect(audio.playCalls).toEqual(['/zone/a.m4a']);
  });

  it('reports failed for anything other than a gesture refusal', async () => {
    const { audio, player } = setup();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    audio.nextPlay = 'not-supported';
    await expect(player.play('/missing.m4a')).resolves.toBe('failed');
    expect(player.getStatus()).toBe('idle');
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it('treats an interrupted play as replaced without changing status', async () => {
    const { audio, player } = setup();
    audio.play = () => Promise.reject(new DOMException('interrupted', 'AbortError'));
    await expect(player.play('/a.m4a')).resolves.toBe('replaced');
    expect(player.getStatus()).toBe('idle');
  });
});
