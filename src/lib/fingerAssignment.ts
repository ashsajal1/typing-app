/**
 * Touch-typing finger assignment for a US ANSI board.
 *
 * `KeyboardEvent.code` is used rather than `KeyboardEvent.key` so the mapping
 * stays correct while a shift is held.
 */

export type Hand = 'left' | 'right';
export type Finger = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';

export interface FingerTarget {
  hand: Hand;
  finger: Finger;
}

/** Order used by <KeyboardHands />: pinky first, index last. */
export const FINGER_ORDER: Finger[] = ['pinky', 'ring', 'middle', 'index'];

/**
 * Keys that are held rather than tapped. They are rendered as pressed but never
 * steal the "active finger" from the character being typed.
 */
export const MODIFIER_CODES: ReadonlySet<string> = new Set([
  'ShiftLeft',
  'ShiftRight',
  'ControlLeft',
  'ControlRight',
  'AltLeft',
  'AltRight',
  'MetaLeft',
  'MetaRight',
  'CapsLock',
]);

const LEFT: Record<string, Finger> = {
  Backquote: 'pinky',
  Digit1: 'pinky',
  Digit2: 'ring',
  Digit3: 'middle',
  Digit4: 'index',
  Digit5: 'index',

  Tab: 'pinky',
  KeyQ: 'pinky',
  KeyW: 'ring',
  KeyE: 'middle',
  KeyR: 'index',
  KeyT: 'index',

  CapsLock: 'pinky',
  KeyA: 'pinky',
  KeyS: 'ring',
  KeyD: 'middle',
  KeyF: 'index',
  KeyG: 'index',

  ShiftLeft: 'pinky',
  KeyZ: 'pinky',
  KeyX: 'ring',
  KeyC: 'middle',
  KeyV: 'index',
  KeyB: 'index',

  ControlLeft: 'pinky',
  MetaLeft: 'pinky',
  AltLeft: 'pinky',
};

const RIGHT: Record<string, Finger> = {
  Backspace: 'pinky',
  Digit6: 'index',
  Digit7: 'index',
  Digit8: 'middle',
  Digit9: 'ring',
  Digit0: 'pinky',
  Minus: 'pinky',
  Equal: 'pinky',

  KeyY: 'index',
  KeyU: 'index',
  KeyI: 'middle',
  KeyO: 'ring',
  KeyP: 'pinky',
  BracketLeft: 'pinky',
  BracketRight: 'ring',
  Backslash: 'pinky',

  KeyH: 'index',
  KeyJ: 'index',
  KeyK: 'middle',
  KeyL: 'ring',
  Semicolon: 'pinky',
  Quote: 'pinky',
  Enter: 'pinky',

  KeyN: 'index',
  KeyM: 'index',
  Comma: 'middle',
  Period: 'ring',
  Slash: 'pinky',
  ShiftRight: 'pinky',

  AltRight: 'pinky',
  MetaRight: 'pinky',
  ControlRight: 'pinky',
};

/** Every key that a finger is responsible for, including the space bar. */
export const KEY_FINGER_MAP: Readonly<Record<string, FingerTarget[]>> = (() => {
  const map: Record<string, FingerTarget[]> = {};
  for (const [code, finger] of Object.entries(LEFT)) {
    map[code] = [{ hand: 'left', finger }];
  }
  for (const [code, finger] of Object.entries(RIGHT)) {
    map[code] = [{ hand: 'right', finger }];
  }
  // Both thumbs share the space bar.
  map.Space = [
    { hand: 'left', finger: 'thumb' },
    { hand: 'right', finger: 'thumb' },
  ];
  return map;
})();

/** Fingers responsible for a key, or an empty list for unknown keys. */
export function getFingersForCode(code: string): FingerTarget[] {
  return KEY_FINGER_MAP[code] ?? [];
}

/** Reads out as "left index finger" so the guidance is unambiguous. */
export function describeFingers(targets: FingerTarget[]): string {
  if (targets.length === 0) return '';
  if (targets.length > 1) return 'Both thumbs';
  const [{ hand, finger }] = targets;
  return `${hand} ${finger} finger`;
}

export function isModifierCode(code: string): boolean {
  return MODIFIER_CODES.has(code);
}
