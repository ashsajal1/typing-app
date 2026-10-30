import { describe, expect, it } from 'vitest';
import {
  FINGER_ANATOMY,
  getKnuckle,
  getMaxReach,
  getMinReach,
  getRestTarget,
  getShiftLimit,
  reachShift,
  solveFinger,
  THUMB,
} from './handKinematics';
import { getFingersForCode } from './fingerAssignment';
import { getKeyByCode, getKeyCenter, KEYBOARD_KEYS } from './keyboardLayout';
import type { Finger, Hand } from './fingerAssignment';

type Digit = Exclude<Finger, 'thumb'>;

/** Mirrors how `KeyboardHands` draws a finger: solved in the hand's own frame,
 * then the whole hand is translated by the shift, so this yields the on-screen tip. */
function fingertipOnKey(
  hand: Hand,
  finger: Finger,
  keyCode: string
): { tip: { x: number; y: number }; target: { x: number; y: number } } {
  // Thumbs aim at their own end of the space bar, not the middle of the key.
  const target =
    finger === 'thumb'
      ? THUMB[hand].restTarget
      : getKeyCenter(getKeyByCode(keyCode)!);
  const knuckle = finger === 'thumb' ? THUMB[hand].base : getKnuckle(hand, finger as Digit);
  const minReach =
    finger === 'thumb' ? THUMB[hand].idleReach : getMinReach(finger as Digit);
  const maxReach = finger === 'thumb' ? THUMB[hand].maxReach : getMaxReach(finger as Digit);
  const limit = finger === 'thumb' ? { x: 40, y: 40 } : getShiftLimit();
  const shift = reachShift(knuckle, target, minReach, limit, maxReach);

  const anatomy = finger === 'thumb' ? THUMB[hand].anatomy : FINGER_ANATOMY[finger as Digit];
  const origin = { x: knuckle.x + shift.x, y: knuckle.y + shift.y };
  const points = solveFinger(origin, anatomy, target, hand === 'left' ? 1 : -1);
  return { tip: points[points.length - 1], target };
}

describe('solveFinger', () => {
  it('puts the fingertip on its home key at rest', () => {
    for (const hand of ['left', 'right'] as const) {
      for (const finger of ['pinky', 'ring', 'middle', 'index'] as Digit[]) {
        const target = getRestTarget(hand, finger);
        const points = solveFinger(
          getKnuckle(hand, finger),
          FINGER_ANATOMY[finger],
          target,
          hand === 'left' ? 1 : -1
        );
        const tip = points[points.length - 1];
        expect(Math.hypot(tip.x - target.x, tip.y - target.y)).toBeLessThan(0.01);
      }
    }
  });

  it('lands the fingertip on every key its finger owns', () => {
    const misses: string[] = [];
    for (const key of KEYBOARD_KEYS) {
      for (const { hand, finger } of getFingersForCode(key.code)) {
        const { tip, target } = fingertipOnKey(hand, finger, key.code);
        const error = Math.hypot(tip.x - target.x, tip.y - target.y);
        // A little slack for keys right at the edge of a finger's travel.
        if (error > 1) misses.push(`${key.code} (${hand} ${finger}): off by ${error.toFixed(1)}`);
      }
    }
    expect(misses).toEqual([]);
  });

  it('keeps the joints ordered from knuckle to tip', () => {
    const target = getKeyCenter(getKeyByCode('Digit5')!);
    const points = solveFinger(getKnuckle('left', 'index'), FINGER_ANATOMY.index, target, 1);
    for (let i = 1; i < points.length; i += 1) {
      expect(Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y))
        .toBeGreaterThan(0);
    }
  });

  it('does not throw when the target sits on the knuckle', () => {
    const knuckle = getKnuckle('left', 'index');
    expect(() => solveFinger(knuckle, FINGER_ANATOMY.index, knuckle)).not.toThrow();
  });
});

describe('reachShift', () => {
  it('leaves a hand alone when the key is already at a comfortable reach', () => {
    const shift = reachShift({ x: 0, y: 0 }, { x: 0, y: -100 }, 100, { x: 50, y: 50 });
    expect(shift.x).toBeCloseTo(0);
    expect(shift.y).toBeCloseTo(0);
  });

  it('does not move the hand while the finger can extend to the key', () => {
    const shift = reachShift({ x: 0, y: 0 }, { x: 0, y: -180 }, 100, { x: 50, y: 500 }, 190);
    expect(shift.x).toBeCloseTo(0);
    expect(shift.y).toBeCloseTo(0);
  });

  it('moves the hand towards a key that is too far to reach', () => {
    const shift = reachShift({ x: 0, y: 0 }, { x: 0, y: -300 }, 100, { x: 50, y: 500 }, 200);
    expect(shift.y).toBeLessThan(0);
  });

  it('pulls the hand back when the key is too close', () => {
    const shift = reachShift({ x: 0, y: 0 }, { x: 0, y: -40 }, 100, { x: 50, y: 500 });
    expect(shift.y).toBeGreaterThan(0);
  });

  it('respects its limits', () => {
    const shift = reachShift({ x: 0, y: 0 }, { x: 900, y: -900 }, 10, { x: 30, y: 40 });
    expect(shift.x).toBeLessThanOrEqual(30);
    expect(shift.y).toBeGreaterThanOrEqual(-40);
  });
});
