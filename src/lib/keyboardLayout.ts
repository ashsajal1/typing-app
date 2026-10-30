/**
 * Geometry and key data for the 60% ANSI board drawn by <VirtualKeyboard />.
 *
 * Everything is expressed in "key units" (u) so the layout stays readable; the
 * helpers below convert to the SVG user units the components actually draw in.
 */

/** Width of a 1u cell, in SVG user units. */
export const KEY_UNIT = 64;
/** Gap between neighbouring keycaps. */
export const KEY_GAP = 4;
/** Drawn size of a 1u keycap. */
export const KEY_SIZE = KEY_UNIT - KEY_GAP;
/** 60% boards are 15u wide and 5 rows tall. */
export const KEYBOARD_UNITS = 15;
/** Width of the key block itself, without the case around it. */
export const KEYBOARD_WIDTH = KEY_UNIT * KEYBOARD_UNITS;
export const KEYBOARD_HEIGHT = KEY_UNIT * 5;
/**
 * Case bezel: the key block is drawn offset by this much, so the outer case
 * and the recessed plate have room to wrap around it like a real board.
 */
export const KEY_OFFSET = 30;
/** Room reserved below the board for the palms and wrists. */
export const HANDS_AREA_HEIGHT = 300;
export const VIEW_WIDTH = KEYBOARD_WIDTH + KEY_OFFSET * 2;
export const VIEW_HEIGHT = KEYBOARD_HEIGHT + KEY_OFFSET + HANDS_AREA_HEIGHT;

/** y of the home row (A S D F ...), used as the neutral wrist position. */
export const HOME_ROW_Y = KEY_UNIT * 2 + KEY_UNIT / 2;

export interface KeyboardKey {
  /** `KeyboardEvent.code` of the key. */
  code: string;
  /** Legend drawn on the key. */
  label: string;
  /** Legend drawn while a shift is held. */
  shiftLabel?: string;
  /** Width of the keycap, in key units. */
  units: number;
  /** Left edge of the keycap, in key units. */
  unit: number;
  /** Row index, 0 (numbers) to 4 (space). */
  row: number;
}

type KeySeed = [code: string, label: string, units?: number, shiftLabel?: string];

function buildRow(row: number, seeds: KeySeed[]): KeyboardKey[] {
  let unit = 0;
  return seeds.map(([code, label, units = 1, shiftLabel]) => {
    const key: KeyboardKey = { code, label, shiftLabel, units, unit, row };
    unit += units;
    return key;
  });
}

const NUMBER_ROW: KeySeed[] = [
  ['Backquote', '`', 1, '~'],
  ['Digit1', '1', 1, '!'],
  ['Digit2', '2', 1, '@'],
  ['Digit3', '3', 1, '#'],
  ['Digit4', '4', 1, '$'],
  ['Digit5', '5', 1, '%'],
  ['Digit6', '6', 1, '^'],
  ['Digit7', '7', 1, '&'],
  ['Digit8', '8', 1, '*'],
  ['Digit9', '9', 1, '('],
  ['Digit0', '0', 1, ')'],
  ['Minus', '-', 1, '_'],
  ['Equal', '=', 1, '+'],
  ['Backspace', '⌫', 2],
];

const QWERTY_ROW: KeySeed[] = [
  ['Tab', 'Tab', 1.5],
  ['KeyQ', 'Q'],
  ['KeyW', 'W'],
  ['KeyE', 'E'],
  ['KeyR', 'R'],
  ['KeyT', 'T'],
  ['KeyY', 'Y'],
  ['KeyU', 'U'],
  ['KeyI', 'I'],
  ['KeyO', 'O'],
  ['KeyP', 'P'],
  ['BracketLeft', '[', 1, '{'],
  ['BracketRight', ']', 1, '}'],
  ['Backslash', '\\', 1.5, '|'],
];

const HOME_ROW: KeySeed[] = [
  ['CapsLock', 'Caps', 1.75],
  ['KeyA', 'A'],
  ['KeyS', 'S'],
  ['KeyD', 'D'],
  ['KeyF', 'F'],
  ['KeyG', 'G'],
  ['KeyH', 'H'],
  ['KeyJ', 'J'],
  ['KeyK', 'K'],
  ['KeyL', 'L'],
  ['Semicolon', ';', 1, ':'],
  ['Quote', "'", 1, '"'],
  ['Enter', 'Enter', 2.25],
];

const ZXCV_ROW: KeySeed[] = [
  ['ShiftLeft', 'Shift', 2.25],
  ['KeyZ', 'Z'],
  ['KeyX', 'X'],
  ['KeyC', 'C'],
  ['KeyV', 'V'],
  ['KeyB', 'B'],
  ['KeyN', 'N'],
  ['KeyM', 'M'],
  ['Comma', ',', 1, '<'],
  ['Period', '.', 1, '>'],
  ['Slash', '/', 1, '?'],
  ['ShiftRight', 'Shift', 2.75],
];

const BOTTOM_ROW: KeySeed[] = [
  ['ControlLeft', 'Ctrl', 1.25],
  ['MetaLeft', 'Cmd', 1.25],
  ['AltLeft', 'Alt', 1.25],
  ['Space', '', 6.25],
  ['AltRight', 'Alt', 1.25],
  ['MetaRight', 'Cmd', 1.25],
  ['ControlRight', 'Ctrl', 1.25],
  ['ContextMenu', 'Fn', 1.25],
];

export const KEYBOARD_KEYS: KeyboardKey[] = [
  ...buildRow(0, NUMBER_ROW),
  ...buildRow(1, QWERTY_ROW),
  ...buildRow(2, HOME_ROW),
  ...buildRow(3, ZXCV_ROW),
  ...buildRow(4, BOTTOM_ROW),
];

const KEYS_BY_CODE = new Map(KEYBOARD_KEYS.map((key) => [key.code, key]));

/** Looks up a key by its `KeyboardEvent.code`, or `undefined` when unknown. */
export function getKeyByCode(code: string): KeyboardKey | undefined {
  return KEYS_BY_CODE.get(code);
}

/** Left edge of a keycap, in SVG user units. */
export function getKeyX(key: KeyboardKey): number {
  return key.unit * KEY_UNIT + KEY_GAP / 2;
}

/** Top edge of a keycap, in SVG user units. */
export function getKeyY(key: KeyboardKey): number {
  return key.row * KEY_UNIT + KEY_GAP / 2;
}

export function getKeyWidth(key: KeyboardKey): number {
  return key.units * KEY_UNIT - KEY_GAP;
}

/**
 * Resolves a character to the physical key that types it, so the correct finger
 * can be worked out before the user presses anything.
 *
 * Letters and digits are resolved directly; everything else falls back to a
 * legend search, which covers the punctuation on the board.
 */
export function getCodeForCharacter(char: string): string | undefined {
  if (char === ' ') return 'Space';
  if (/^[a-zA-Z]$/.test(char)) return `Key${char.toUpperCase()}`;
  if (/^[0-9]$/.test(char)) return `Digit${char}`;
  return KEYBOARD_KEYS.find((key) => key.label === char || key.shiftLabel === char)?.code;
}

/** Centre of a keycap, in SVG user units. */
export function getKeyCenter(key: KeyboardKey): { x: number; y: number } {
  return {
    x: key.unit * KEY_UNIT + (key.units * KEY_UNIT) / 2,
    y: key.row * KEY_UNIT + KEY_UNIT / 2,
  };
}

export interface Point {
  x: number;
  y: number;
}
