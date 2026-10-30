import { useEffect } from 'react';
import { useKeyboardStore } from '../store/keyboardStore';

/** A short, rounded key click; generated locally with no downloaded audio. */
export function useTypingSound(enabled: boolean) {
  const soundEnabled = useKeyboardStore(state => state.soundEnabled);
  useEffect(() => {
    if (!enabled || !soundEnabled || !window.AudioContext) return;
    let context: AudioContext | undefined;
    let buffer: AudioBuffer | undefined;
    const play = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
      if (event.key.length !== 1 && !['Backspace', 'Enter', 'Shift'].includes(event.key)) return;
      if ((event.target as Element | null)?.closest?.('button, select, a, input[type="checkbox"], [role="dialog"]')) return;
      try {
        context ??= new AudioContext();
        if (context.state === 'suspended') void context.resume().catch(() => {});
        if (!buffer) {
          buffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.045), context.sampleRate);
          const samples = buffer.getChannelData(0);
          let noise = 0;
          for (let i = 0; i < samples.length; i++) {
            const t = i / context.sampleRate;
            noise = noise * 0.65 + (Math.random() * 2 - 1) * 0.35;
            const attack = Math.min(1, t / 0.002);
            samples[i] = attack * Math.exp(-t * 125) *
              (noise * 0.18 + Math.sin(2 * Math.PI * 190 * t) * 0.07);
          }
        }
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = event.code === 'Space' || event.code === 'Backspace' ? 0.85 : 1;
        source.connect(context.destination);
        source.onended = () => source.disconnect();
        source.start();
      } catch {
        // Audio is optional; a blocked device must not interrupt typing.
      }
    };
    window.addEventListener('keydown', play);
    return () => {
      window.removeEventListener('keydown', play);
      if (context) void context.close().catch(() => {});
    };
  }, [enabled, soundEnabled]);
}
