import { useEffect, useMemo, useState } from 'react';
import { isModifierCode } from '../lib/fingerAssignment';

export interface PressedKeys {
  /** Every key currently held, in the order they were pressed. */
  codes: string[];
  /** The last non-modifier key pressed, which is the one the hands follow. */
  activeCode: string | null;
  /** Whether a shift is held, so the shifted legend can be shown. */
  shift: boolean;
}

const NO_PRESSED_KEYS: PressedKeys = { codes: [], activeCode: null, shift: false };

/**
 * Tracks which physical keys are held down so the on-screen keyboard can light
 * them up and the hands can follow along.
 *
 * Listening on `window` keeps this independent from the typing logic: that hook
 * only calls `preventDefault()`, so both listeners still run.
 */
export function usePressedKeys(enabled = true): PressedKeys {
  const [codes, setCodes] = useState<string[]>([]);

  useEffect(() => {
    if (!enabled) {
      setCodes([]);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Auto-repeat would keep re-adding keys and holding the animation.
      if (event.repeat) return;
      setCodes((prev) => (prev.includes(event.code) ? prev : [...prev, event.code]));
    };

    const release = (event: KeyboardEvent) => {
      setCodes((prev) => (prev.includes(event.code) ? prev.filter((code) => code !== event.code) : prev));
    };

    // Keys held while the tab loses focus never fire `keyup`.
    const releaseAll = () => setCodes([]);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', release);
    window.addEventListener('blur', releaseAll);
    document.addEventListener('visibilitychange', releaseAll);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', release);
      window.removeEventListener('blur', releaseAll);
      document.removeEventListener('visibilitychange', releaseAll);
    };
  }, [enabled]);

  return useMemo(() => {
    if (codes.length === 0) return NO_PRESSED_KEYS;
    let activeCode: string | null = null;
    for (const code of codes) {
      if (!isModifierCode(code)) activeCode = code;
    }
    return {
      codes,
      activeCode,
      shift: codes.includes('ShiftLeft') || codes.includes('ShiftRight'),
    };
  }, [codes]);
}
