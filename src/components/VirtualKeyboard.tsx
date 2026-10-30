import { useMemo } from 'react';
import KeyboardHands from './KeyboardHands';
import type { KeyboardKey } from '../lib/keyboardLayout';
import {
  getKeyByCode,
  getKeyWidth,
  getKeyX,
  getKeyY,
  KEY_OFFSET,
  KEYBOARD_HEIGHT,
  KEYBOARD_KEYS,
  KEYBOARD_WIDTH,
  KEY_SIZE,
  VIEW_HEIGHT,
  VIEW_WIDTH,
} from '../lib/keyboardLayout';
import type { FingerTarget } from '../lib/fingerAssignment';

/** Keys marked with a notch on real boards. */
const HOME_KEYS = new Set(['KeyF', 'KeyJ']);
const KEY_RADIUS = 10;
/** Visible thickness of a keycap: the side wall showing below the top face. */
const KEY_DEPTH = 5;
/** Outer case and the recessed plate the keycaps sit in. */
const CASE_INSET = 6;
const CASE_RADIUS = 26;
const PLATE_MARGIN = 14;
const PLATE_RADIUS = 12;
/** Bottom of the case; the lip below the last row makes it read as 3D. */
const CASE_BOTTOM = KEY_OFFSET * 2 + KEYBOARD_HEIGHT;

interface KeyCapProps {
  keyDef: KeyboardKey;
  isPressed: boolean;
  isShifted: boolean;
}

/**
 * One physical-looking keycap: a grey side wall under a topped cap. Pressing
 * sinks the top face onto the wall, so the key visibly travels down.
 */
function KeyCap({ keyDef, isPressed, isShifted }: KeyCapProps) {
  const width = getKeyWidth(keyDef);
  const hasShift = Boolean(keyDef.shiftLabel);
  // While shift is held the big legend becomes the character that will actually
  // be typed, so the small one above it would just repeat itself.
  const label = isShifted && hasShift ? keyDef.shiftLabel! : keyDef.label;
  const fontSize = label.length > 2 ? 15 : 22;
  const labelOffsetY = hasShift && !isShifted ? 6 : 0;

  return (
    <g
      className={isPressed ? 'keycap keycap-pressed' : 'keycap'}
      style={{ transform: `translate(${getKeyX(keyDef)}px, ${getKeyY(keyDef)}px)` }}
    >
      <rect y={KEY_DEPTH} width={width} height={KEY_SIZE} rx={KEY_RADIUS} className="keycap-side" />
      <g className="keycap-top">
        <rect width={width} height={KEY_SIZE} rx={KEY_RADIUS} className="keycap-body" />
        {hasShift && !isShifted && (
          <text x={width - 9} y={16} className="keycap-legend-sm" textAnchor="end" fontSize={13}>
            {keyDef.shiftLabel}
          </text>
        )}
        {label && (
          <text
            x={width / 2}
            y={KEY_SIZE / 2 + labelOffsetY + fontSize * 0.35}
            className="keycap-legend"
            textAnchor="middle"
            fontSize={fontSize}
          >
            {label}
          </text>
        )}
        {HOME_KEYS.has(keyDef.code) && (
          <rect
            x={width / 2 - 11}
            y={KEY_SIZE - 9}
            width={22}
            height={3}
            rx={1.5}
            className="keycap-notch"
          />
        )}
      </g>
    </g>
  );
}

interface VirtualKeyboardProps {
  fitViewport?: boolean;
  /** Every key currently held down, in the order they were pressed. */
  pressedCodes: string[];
  /** The last non-modifier key pressed, which the hands follow. */
  activeCode: string | null;
  /** Whether a shift is held, so the shifted legends can be shown. */
  shift: boolean;
  /** The key the next character needs, ringed as a coaching cue. */
  nextCode?: string | null;
  nextShiftCode?: string | null;
  /** Fingers that should press the next character. */
  nextFingers?: FingerTarget[];
}

/**
 * An on-screen 60% keyboard, drawn as a physical board - case, recessed plate
 * and keycaps with real thickness - with two translucent hands that press the
 * keys being typed, so nobody has to glance down at their physical board.
 */
export default function VirtualKeyboard({
  fitViewport = true,
  pressedCodes,
  activeCode,
  shift,
  nextCode = null,
  nextShiftCode = null,
  nextFingers = [],
}: VirtualKeyboardProps) {
  const pressed = useMemo(() => new Set(pressedCodes), [pressedCodes]);
  const nextKeys = [nextCode, nextShiftCode].flatMap(code => {
    const key = code ? getKeyByCode(code) : undefined;
    return key && !pressed.has(code!) ? [key] : [];
  });

  return (
    <div className="w-full select-none overflow-hidden" aria-hidden="true">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        // Capped so the whole board, hands included, stays on screen without
        // scrolling. `meet` keeps it centred rather than squashed.
        className="mx-auto block h-auto w-full max-w-7xl"
        style={{ maxHeight: fitViewport ? '78vh' : undefined }}
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <defs>
          <linearGradient id="kb-case-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--kb-case-top, #f7f8fa)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--kb-case-bottom, #e2e5ea)' }} />
          </linearGradient>
          <linearGradient id="kb-key-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--kb-key-top, #ffffff)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--kb-key-bottom, #f1f2f4)' }} />
          </linearGradient>
          {/* Inner shadow along the top of the plate, so it reads as recessed. */}
          <linearGradient id="kb-plate-shade-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: 'oklch(var(--bc) / 0.18)' }} />
            <stop offset="100%" style={{ stopColor: 'oklch(var(--bc) / 0)' }} />
          </linearGradient>
        </defs>

        {/* A slab peeking out below the case, so the board sits on a lip. */}
        <rect
          className="keyboard-case-base"
          x={CASE_INSET - 2}
          y={CASE_INSET + 7}
          width={VIEW_WIDTH - (CASE_INSET - 2) * 2}
          height={CASE_BOTTOM - CASE_INSET - 7}
          rx={CASE_RADIUS}
        />
        <rect
          className="keyboard-frame"
          x={CASE_INSET}
          y={CASE_INSET}
          width={VIEW_WIDTH - CASE_INSET * 2}
          height={CASE_BOTTOM - CASE_INSET}
          rx={CASE_RADIUS}
        />
        {/* The well the keycaps are sunk into. */}
        <rect
          className="keyboard-plate"
          x={KEY_OFFSET - PLATE_MARGIN}
          y={KEY_OFFSET - PLATE_MARGIN}
          width={KEYBOARD_WIDTH + PLATE_MARGIN * 2}
          height={KEYBOARD_HEIGHT + PLATE_MARGIN * 2}
          rx={PLATE_RADIUS}
        />
        <rect
          className="keyboard-plate-shade"
          x={KEY_OFFSET - PLATE_MARGIN + 2}
          y={KEY_OFFSET - PLATE_MARGIN + 2}
          width={KEYBOARD_WIDTH + PLATE_MARGIN * 2 - 4}
          height={12}
          rx={PLATE_RADIUS - 4}
        />

        {/* Keys and hands share the key block's coordinate space. */}
        <g transform={`translate(${KEY_OFFSET} ${KEY_OFFSET})`}>
          <g className="keyboard-keys">
            {KEYBOARD_KEYS.map((keyDef) => (
              <KeyCap
                key={keyDef.code}
                keyDef={keyDef}
                isPressed={pressed.has(keyDef.code)}
                isShifted={shift}
              />
            ))}
          </g>

          {/* The cue sits under the hands so it reads as "press this next". */}
          {nextKeys.map(nextKey => (
            <rect
              key={nextKey.code}
              x={getKeyX(nextKey)}
              y={getKeyY(nextKey)}
              width={getKeyWidth(nextKey)}
              height={KEY_SIZE}
              rx={KEY_RADIUS}
              className={nextKey.code === 'Backspace' ? 'keycap-next keycap-correction' : 'keycap-next'}
            />
          ))}

          <KeyboardHands
            pressedCodes={pressedCodes}
            activeCode={activeCode}
            nextFingers={nextFingers}
            nextCode={nextCode}
          />

          {/* Drawn last so a pressed key stays readable underneath the hands. */}
          <g className="keyboard-press-ring" transform={`translate(0 ${KEY_DEPTH})`}>
            {KEYBOARD_KEYS.filter((keyDef) => pressed.has(keyDef.code)).map((keyDef) => (
              <rect
                key={keyDef.code}
                x={getKeyX(keyDef)}
                y={getKeyY(keyDef)}
                width={getKeyWidth(keyDef)}
                height={KEY_SIZE}
                rx={KEY_RADIUS}
                className="keycap-ring"
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
