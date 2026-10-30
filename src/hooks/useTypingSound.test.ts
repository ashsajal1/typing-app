import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import { useTypingSound } from './useTypingSound';
import { useKeyboardStore } from '../store/keyboardStore';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); useKeyboardStore.setState({ soundEnabled: true }); });

describe('typing sound', () => {
  it('starts on a key gesture, reuses audio, and stops when muted', () => {
    const start = vi.fn();
    const close = vi.fn().mockResolvedValue(undefined);
    const create = vi.fn();
    class AudioMock {
      state = 'running'; sampleRate = 44100; destination = {};
      constructor() { create(); }
      close = close;
      createBuffer() { return { getChannelData: () => new Float32Array(1985) }; }
      createBufferSource() { return { playbackRate: { value: 1 }, connect: vi.fn(), disconnect: vi.fn(), start }; }
    }
    vi.stubGlobal('AudioContext', AudioMock);
    renderHook(() => useTypingSound(true));
    expect(create).not.toHaveBeenCalled();
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' })));
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace' })));
    expect(create).toHaveBeenCalledTimes(1);
    expect(start).toHaveBeenCalledTimes(2);
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true })));
    expect(start).toHaveBeenCalledTimes(2);
    act(() => useKeyboardStore.setState({ soundEnabled: false }));
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' })));
    expect(close).toHaveBeenCalledOnce();
    expect(start).toHaveBeenCalledTimes(2);
  });
  it('does not create audio after the test is finished', () => {
    const create = vi.fn();
    vi.stubGlobal('AudioContext', create);
    renderHook(() => useTypingSound(false));
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' })));
    expect(create).not.toHaveBeenCalled();
  });
});
