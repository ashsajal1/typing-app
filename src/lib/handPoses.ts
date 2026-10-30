import type { Finger, FingerTarget, Hand } from './fingerAssignment';
import { getFingersForCode } from './fingerAssignment';
import type { Point } from './keyboardLayout';
import { getKeyByCode, getKeyCenter } from './keyboardLayout';
import {
  getKnuckle,
  getMaxReach,
  getMinReach,
  getShiftLimit,
  reachShift,
  THUMB,
} from './handKinematics';

/**
 * Works out where each hand sits for a given set of held keys.
 *
 * Each pressed key maps to the finger that owns it. The hand then slides just far
 * enough for that finger to sit at a comfortable distance from its key, which is
 * what keeps the pose natural instead of the fingers stretching unnaturally.
 *
 * The upcoming character is previewed at all times: the finger that will be used
 * lifts onto its key, so the user can see where to go before pressing rather than
 * only finding out from a mistake. A finger that is already pressing a key keeps
 * that key instead of jumping ahead.
 */

export type Digit = Exclude<Finger, 'thumb'>;

export interface HandPose {
  /** How far the whole hand slides towards the key being pressed. */
  shift: Point;
  /** Key each finger is reaching for; absent when the finger is idle. */
  targets: Partial<Record<Finger, Point>>;
  /** The finger that should be highlighted. */
  active: Finger | null;
}

const NEUTRAL: HandPose = { shift: { x: 0, y: 0 }, targets: {}, active: null };

/** How far a hand must slide so `finger` sits comfortably on `target`. */
function shiftFor(hand: Hand, finger: Finger, target: Point): Point {
  return finger === 'thumb'
    ? reachShift(
        THUMB[hand].base,
        target,
        THUMB[hand].idleReach,
        { x: 40, y: 40 },
        THUMB[hand].maxReach
      )
    : reachShift(
        getKnuckle(hand, finger),
        target,
        getMinReach(finger),
        getShiftLimit(),
        getMaxReach(finger)
      );
}

export function computeHandPoses(
  pressedCodes: string[],
  activeCode: string | null,
  nextFingers: FingerTarget[],
  nextCode: string | null
): Record<Hand, HandPose> {
  const requests: Record<Hand, { finger: Finger; target: Point }[]> = { left: [], right: [] };
  const active: Record<Hand, Finger | null> = { left: null, right: null };

  for (const code of pressedCodes) {
    const key = getKeyByCode(code);
    if (!key) continue;
    const target = getKeyCenter(key);
    for (const { hand, finger } of getFingersForCode(code)) {
      requests[hand].push({
        finger,
        // Each thumb presses its own end of the space bar, so space never
        // drags both hands towards the middle.
        target: finger === 'thumb' ? THUMB[hand].restTarget : target,
      });
      if (code === activeCode) active[hand] = finger;
    }
  }

  // Cue the upcoming key even while a key is held: the highlight should sit on
  // the key the next character needs, not fold back onto the home row as soon
  // as anything is pressed. A finger that is already pressing a key wins.
  if (nextCode) {
    const key = getKeyByCode(nextCode);
    if (key) {
      const target = getKeyCenter(key);
      for (const { hand, finger } of nextFingers) {
        const held = requests[hand].some((request) => request.finger === finger);
        if (!held) {
          requests[hand].push({
            finger,
            target: finger === 'thumb' ? THUMB[hand].restTarget : target,
          });
        }
      }
    }
  }

  const poses = {} as Record<Hand, HandPose>;
  for (const hand of ['left', 'right'] as Hand[]) {
    const fingers = requests[hand];
    if (fingers.length === 0) {
      poses[hand] = NEUTRAL;
      continue;
    }

    let shiftX = 0;
    let shiftY = 0;
    const targets: Partial<Record<Finger, Point>> = {};

    for (const { finger, target } of fingers) {
      targets[finger] = target;
      shiftX += shiftFor(hand, finger, target).x;
      shiftY += shiftFor(hand, finger, target).y;
    }

    // A chord (ctrl + c) would split the difference and leave both fingers
    // half-stretched, so the key being typed wins and the others stretch.
    const lead = fingers.find(({ finger }) => finger === active[hand]) ?? fingers[0];
    const leadShift = shiftFor(hand, lead.finger, lead.target);
    const isChord = fingers.length > 1;

    poses[hand] = {
      shift: isChord ? leadShift : { x: shiftX, y: shiftY },
      targets,
      active: active[hand],
    };
  }
  return poses;
}
