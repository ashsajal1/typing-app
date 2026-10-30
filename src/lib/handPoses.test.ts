import { describe, expect, it } from 'vitest';
import type { HandPose } from './handPoses';
import { computeHandPoses } from './handPoses';
import type { Finger, Hand } from './fingerAssignment';
import { getFingersForCode } from './fingerAssignment';
import { FINGER_ANATOMY, getKnuckle, getRestTarget, solveFinger, THUMB } from './handKinematics';
import type { Point } from './keyboardLayout';
import { getKeyByCode, getKeyCenter } from './keyboardLayout';

type Digit = Exclude<Finger, 'thumb'>;

function key(code: string): Point {
  return getKeyCenter(getKeyByCode(code)!);
}

/** Where the fingertip appears on the board, mirroring how <KeyboardHands /> draws it. */
function fingertip(hand: Hand, finger: Finger, pose: HandPose): Point {
  const knuckle = finger === 'thumb' ? THUMB[hand].base : getKnuckle(hand, finger as Digit);
  const anatomy = finger === 'thumb' ? THUMB[hand].anatomy : FINGER_ANATOMY[finger as Digit];
  const rest = finger === 'thumb' ? THUMB[hand].restTarget : getRestTarget(hand, finger as Digit);
  const target = pose.targets[finger];
  // Fingers are solved in the hand's own frame; the pose shift moves the hand.
  const aim = target ? { x: target.x - pose.shift.x, y: target.y - pose.shift.y } : rest;
  const points = solveFinger(knuckle, anatomy, aim, hand === 'left' ? 1 : -1);
  const tip = points[points.length - 1];
  return { x: tip.x + pose.shift.x, y: tip.y + pose.shift.y };
}

describe('computeHandPoses', () => {
  it('previews the next key even while another key is held', () => {
    const poses = computeHandPoses(['KeyR'], 'KeyR', getFingersForCode('KeyE'), 'KeyE');

    expect(poses.left.targets.index).toEqual(key('KeyR'));
    expect(poses.left.targets.middle).toEqual(key('KeyE'));

    // The cued finger must really land on its key, not fold back onto its home
    // row, even though the hand is away pressing R.
    const tip = fingertip('left', 'middle', poses.left);
    const target = key('KeyE');
    expect(Math.hypot(tip.x - target.x, tip.y - target.y)).toBeLessThan(1);

    // The right hand has nothing to do and stays neutral.
    expect(poses.right).toEqual({ shift: { x: 0, y: 0 }, targets: {}, active: null });
  });

  it('lets a held key win over the cue for the same finger', () => {
    // F and R are both left-index keys: the finger stays on the key it is
    // pressing instead of jumping to the one it will press next.
    const poses = computeHandPoses(['KeyF'], 'KeyF', getFingersForCode('KeyR'), 'KeyR');
    expect(poses.left.targets.index).toEqual(key('KeyF'));
  });

  it('previews the next key without moving the hand out of home position', () => {
    const poses = computeHandPoses([], null, getFingersForCode('KeyE'), 'KeyE');
    expect(poses.left.targets.middle).toEqual(key('KeyE'));
    // E is above the home row but still within the middle finger's own reach,
    // so the hand itself does not shift: only that one finger moves.
    expect(poses.left.shift).toEqual({ x: 0, y: 0 });

    const tip = fingertip('left', 'middle', poses.left);
    const target = key('KeyE');
    expect(Math.hypot(tip.x - target.x, tip.y - target.y)).toBeLessThan(1);
    expect(poses.right.targets).toEqual({});
  });

  it('follows the key being typed when several keys are held', () => {
    const both = computeHandPoses(['KeyR', 'KeyE'], 'KeyE', [], null);
    const justE = computeHandPoses(['KeyE'], 'KeyE', [], null);
    // The key being typed leads the shift, so a held neighbour cannot drag the
    // hand into a half-stretched compromise.
    expect(both.left.shift).toEqual(justE.left.shift);
    expect(both.left.active).toBe('middle');
  });

  it('presses the space bar with both thumbs without dragging the hands', () => {
    const poses = computeHandPoses(['Space'], 'Space', [], null);
    expect(poses.left.active).toBe('thumb');
    expect(poses.right.active).toBe('thumb');
    // Each thumb stays on its own end of the bar, so the hands do not slide
    // towards the middle of the board.
    expect(poses.left.targets.thumb).toEqual(THUMB.left.restTarget);
    expect(poses.right.targets.thumb).toEqual(THUMB.right.restTarget);
    // Neither hand is dragged towards the middle of the board: the thumbs are
    // already resting on the bar, so at most a couple of pixels of settle.
    expect(Math.hypot(poses.left.shift.x, poses.left.shift.y)).toBeLessThan(5);
    expect(Math.hypot(poses.right.shift.x, poses.right.shift.y)).toBeLessThan(5);
  });
});
