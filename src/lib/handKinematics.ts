import type { Point } from './keyboardLayout';
import { getKeyByCode, getKeyCenter, KEY_UNIT } from './keyboardLayout';
import type { Finger, Hand } from './fingerAssignment';

/**
 * Anatomy and kinematics for the on-screen hands.
 *
 * Fingers are drawn as gently curved silhouettes from the knuckle to the key.
 * The whole hand slides when a key is outside a comfortable reach.
 */

export interface FingerAnatomy {
  /** Length of each bone, in SVG units. */
  segments: [number, number, number];
  /** Half-width of each joint plus the fingertip, tapering towards the tip. */
  widths: [number, number, number, number];
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Place the visible joints along a gently curved path to the target. A typing
 * hand is seen from above, so curling shortens the visible finger rather than
 * making its joints fold sideways across neighbouring keys.
 */
export function solveFinger(
  knuckle: Point,
  anatomy: FingerAnatomy,
  target: Point,
  sign = 1
): Point[] {
  const dx = target.x - knuckle.x;
  const dy = target.y - knuckle.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 1) return [knuckle, knuckle, knuckle, knuckle];

  const maxReach = anatomy.segments.reduce((sum, bone) => sum + bone, 0) - 2;
  const scale = Math.min(1, maxReach / distance);
  const bend = Math.min(distance * 0.025, 3) * sign;
  const normal = { x: -dy / distance, y: dx / distance };
  return [0, 1 / 3, 2 / 3, 1].map((t) => ({
    x: knuckle.x + dx * scale * t + normal.x * bend * Math.sin(Math.PI * t),
    y: knuckle.y + dy * scale * t + normal.y * bend * Math.sin(Math.PI * t),
  }));
}

/**
 * How far the hand must slide so its knuckle ends up a comfortable distance
 * from `target`: towards the key once the finger would be over-extended, away
 * from it when the key is too close to reach with a sane pose.
 *
 * Between `minReach` and `maxReach` the hand does not move at all - the finger
 * simply extends or curls to the key, which is what keeps far keys looking like
 * a reach instead of the whole hand sliding around.
 */
export function reachShift(
  knuckle: Point,
  target: Point,
  minReach: number,
  limit: Point,
  maxReach = Infinity
): Point {
  const toTarget = { x: target.x - knuckle.x, y: target.y - knuckle.y };
  const distance = Math.hypot(toTarget.x, toTarget.y) || 1;
  const ideal = clamp(distance, minReach, maxReach);
  const delta = distance - ideal;
  const x = clamp((toTarget.x / distance) * delta, -limit.x, limit.x);
  const y = clamp((toTarget.y / distance) * delta, -limit.y, limit.y);
  // A zero shift is zero, not minus zero: the sign of the direction vector
  // would otherwise leak into `translate()` and into equality checks.
  return { x: x === 0 ? 0 : x, y: y === 0 ? 0 : y };
}

/**
 * Traces a smooth, tapering outline around a bone chain.
 *
 * Stroking each bone separately leaves visible beads at the joints, so a finger
 * is filled as one silhouette: the chain is densified, relaxed a couple of
 * times so the joints read as bends rather than corners, each sample is offset
 * perpendicular to its neighbours by the interpolated half-width, and the tip
 * is closed with an explicit semicircle. Sampling the cap (rather than emitting
 * an SVG arc) keeps the winding unambiguous, which matters because the tip moves
 * every keystroke.
 */
export function buildBonePath(points: Point[], widths: number[]): string {
  if (points.length < 2) return '';

  const center: Point[] = [];
  const half: number[] = [];
  const SAMPLES = 8;

  for (let i = 0; i < points.length - 1; i += 1) {
    const from = points[i];
    const to = points[i + 1];
    const start = widths[Math.min(i, widths.length - 1)];
    const end = widths[Math.min(i + 1, widths.length - 1)];
    // The last bone contributes the tip sample, the others would double up.
    const steps = i === points.length - 2 ? SAMPLES : SAMPLES - 1;
    for (let step = 0; step <= steps; step += 1) {
      const t = step / SAMPLES;
      center.push({
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
      });
      half.push(start + (end - start) * t);
    }
  }

  // Relax the centerline in place (endpoints pinned) so the silhouette curves
  // through the joints instead of showing the hinge corners.
  const smooth: Point[] = center.map((point) => ({ ...point }));
  for (let pass = 0; pass < 2; pass += 1) {
    for (let i = 1; i < smooth.length - 1; i += 1) {
      const before = smooth[i - 1];
      const after = smooth[i + 1];
      smooth[i] = {
        x: smooth[i].x * 0.5 + (before.x + after.x) * 0.25,
        y: smooth[i].y * 0.5 + (before.y + after.y) * 0.25,
      };
    }
  }

  const count = smooth.length;
  const normalAt = (index: number): Point => {
    const before = smooth[Math.max(0, index - 1)];
    const after = smooth[Math.min(count - 1, index + 1)];
    const dx = after.x - before.x;
    const dy = after.y - before.y;
    const length = Math.hypot(dx, dy) || 1;
    return { x: -dy / length, y: dx / length };
  };

  const left = smooth.map((point, index) => {
    const normal = normalAt(index);
    return { x: point.x + normal.x * half[index], y: point.y + normal.y * half[index] };
  });
  const right = smooth.map((point, index) => {
    const normal = normalAt(index);
    return { x: point.x - normal.x * half[index], y: point.y - normal.y * half[index] };
  });

  const tip = smooth[count - 1];
  const radius = half[count - 1];
  const normal = normalAt(count - 1);
  const heading = {
    x: tip.x - smooth[count - 2].x,
    y: tip.y - smooth[count - 2].y,
  };
  const headingLength = Math.hypot(heading.x, heading.y) || 1;
  const forward = { x: heading.x / headingLength, y: heading.y / headingLength };

  const cap: Point[] = [];
  const CAP_STEPS = 8;
  for (let step = 1; step < CAP_STEPS; step += 1) {
    const angle = (Math.PI * step) / CAP_STEPS;
    cap.push({
      x: tip.x + radius * (Math.cos(angle) * normal.x + Math.sin(angle) * forward.x),
      y: tip.y + radius * (Math.cos(angle) * normal.y + Math.sin(angle) * forward.y),
    });
  }

  return [
    `M ${left[0].x} ${left[0].y}`,
    ...left.slice(1).map((p) => `L ${p.x} ${p.y}`),
    ...cap.map((p) => `L ${p.x} ${p.y}`),
    ...right
      .slice()
      .reverse()
      .map((p) => `L ${p.x} ${p.y}`),
    'Z',
  ].join(' ');
}

/**
 * Joins a ring of points into one continuous closed curve.
 *
 * Corner-cutting (quadratics pulled a third of the way along each edge) rounds
 * the silhouette everywhere, which keeps the palm from showing the facets that a
 * hand-written Bézier path tends to produce.
 */
function buildSmoothClosedPath(points: Point[]): string {
  const count = points.length;
  if (count < 3) return '';

  const commands = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 0; i < count; i++) {
    const current = points[i];
    const next = points[(i + 1) % count];
    commands.push(
      `Q ${current.x} ${current.y} ${(current.x + next.x) / 2} ${(current.y + next.y) / 2}`
    );
  }
  commands.push('Z');
  return commands.join(' ');
}

type Digit = Exclude<Finger, 'thumb'>;

/**
 * Bone lengths are tuned so that a finger at its idle reach sits at 90-95% of
 * full extension: the long, gently-arced finger a hand hovering over the home
 * row actually shows, rather than a deep checkmark fold.
 *
 * Widths are the half-widths of the silhouette: slim enough that four fingers
 * rest side by side on one key row without merging into a paddle.
 */
export const FINGER_ANATOMY: Record<Digit, FingerAnatomy> = {
  pinky: { segments: [108.75, 66.25, 47.5], widths: [27, 22, 18, 15] },
  ring: { segments: [108.75, 67.5, 46.25], widths: [29, 24, 20, 16] },
  middle: { segments: [105, 63.75, 46.25], widths: [30, 25, 21, 17] },
  index: { segments: [107.5, 65, 46.25], widths: [29, 24, 20, 16] },
};

/** Finger order from the outside of the hand towards the middle. */
export const HAND_FINGERS: Digit[] = ['pinky', 'ring', 'middle', 'index'];

/** MCP joint positions at rest, just below the bottom row. */
const KNUCKLE_X: Record<Hand, Record<Digit, number>> = {
  left: { pinky: 138, ring: 202, middle: 268, index: 334 },
  right: { pinky: 726, ring: 662, middle: 598, index: 534 },
};

/**
 * MCP joint positions at rest. The knuckles sit around the space bar row with
 * the middle finger furthest forward, so the fingers reach up across the board
 * instead of curling on the spot.
 */
const KNUCKLE_Y: Record<Digit, number> = {
  pinky: 297,
  ring: 296,
  middle: 292,
  index: 294,
};

/** The key each finger rests on. */
const HOME_KEY: Record<Hand, Record<Digit, string>> = {
  left: { pinky: 'KeyA', ring: 'KeyS', middle: 'KeyD', index: 'KeyF' },
  right: { index: 'KeyJ', middle: 'KeyK', ring: 'KeyL', pinky: 'Semicolon' },
};

/**
 * Comfortable, slightly curled reach: the distance from a knuckle to its home
 * key. Derived rather than hard-coded so the hands sit perfectly still on the
 * home row and never drift when the geometry above is tweaked.
 */
const IDLE_REACH: Record<Digit, number> = {
  pinky: Math.hypot(
    getRestTarget('left', 'pinky').x - getKnuckle('left', 'pinky').x,
    getRestTarget('left', 'pinky').y - getKnuckle('left', 'pinky').y
  ),
  ring: Math.hypot(
    getRestTarget('left', 'ring').x - getKnuckle('left', 'ring').x,
    getRestTarget('left', 'ring').y - getKnuckle('left', 'ring').y
  ),
  middle: Math.hypot(
    getRestTarget('left', 'middle').x - getKnuckle('left', 'middle').x,
    getRestTarget('left', 'middle').y - getKnuckle('left', 'middle').y
  ),
  index: Math.hypot(
    getRestTarget('left', 'index').x - getKnuckle('left', 'index').x,
    getRestTarget('left', 'index').y - getKnuckle('left', 'index').y
  ),
};

/** Never slide a hand further than this, to keep the motion believable. */
const SHIFT_LIMIT: Point = { x: 110, y: 150 };

export function getKnuckle(hand: Hand, finger: Digit): Point {
  return { x: KNUCKLE_X[hand][finger], y: KNUCKLE_Y[finger] };
}

export function getRestTarget(hand: Hand, finger: Digit): Point {
  return getKeyCenter(getKeyByCode(HOME_KEY[hand][finger])!);
}

export function getIdleReach(finger: Digit): number {
  return IDLE_REACH[finger];
}

/** Total bone length of a finger chain. */
function chainLength(finger: Digit): number {
  return FINGER_ANATOMY[finger].segments.reduce((sum, bone) => sum + bone, 0);
}

/**
 * The most a finger should have to stretch before the hand slides towards the
 * key: a few percent short of full extension, so a reach never looks like the
 * finger has been pulled straight.
 */
export function getMaxReach(finger: Digit): number {
  return chainLength(finger) * 0.98;
}

/**
 * The closest a finger folds before the hand steps in. The bottom row curls a
 * finger to about a third of its length, and that is normal, so the hand only
 * moves for keys nearer than this.
 */
export function getMinReach(finger: Digit): number {
  return chainLength(finger) * 0.32;
}

export function getShiftLimit(): Point {
  return SHIFT_LIMIT;
}

export interface ThumbSpec {
  base: Point;
  anatomy: FingerAnatomy;
  restTarget: Point;
  /** Reach the hand settles at while the thumb is idle. */
  idleReach: number;
  /** Reach at which the thumb is fully but comfortably extended. */
  maxReach: number;
}

const THUMB_ANATOMY: FingerAnatomy = { segments: [58, 46, 26], widths: [30, 25, 21, 17] };

/** The thumbs rest on either end of the space bar. */
const SPACE = getKeyByCode('Space')!;
const SPACE_LEFT = SPACE.unit * KEY_UNIT;
const SPACE_RIGHT = SPACE_LEFT + SPACE.units * KEY_UNIT;
const THUMB_REST_Y = getKeyCenter(SPACE).y + 12;

export const THUMB: Record<Hand, ThumbSpec> = {
  left: {
    base: { x: 350, y: 428 },
    anatomy: THUMB_ANATOMY,
    restTarget: { x: SPACE_LEFT + (SPACE_RIGHT - SPACE_LEFT) * 0.19, y: THUMB_REST_Y },
    idleReach: 110,
    maxReach: 128,
  },
  right: {
    base: { x: 530, y: 428 },
    anatomy: THUMB_ANATOMY,
    restTarget: { x: SPACE_RIGHT - (SPACE_RIGHT - SPACE_LEFT) * 0.19, y: THUMB_REST_Y },
    idleReach: 110,
    maxReach: 128,
  },
};

/**
 * Builds the palm outline from the knuckle line, so each hand's silhouette stays
 * in sync with its own bone positions instead of being an unrelated drawing.
 *
 * Note the two hands cannot simply be mirrored: the space bar sits left of the
 * board's centre line, so the right thumb's rest spot is not the mirror of the
 * left one's.
 */
export function buildPalmPath(hand: Hand): string {
  const outward = hand === 'left' ? -1 : 1;
  const top = HAND_FINGERS.map((finger) => ({
    x: KNUCKLE_X[hand][finger],
    y: KNUCKLE_Y[finger] - FINGER_ANATOMY[finger].widths[0] + 6,
  }));

  const wristCenter = KNUCKLE_X[hand].middle - outward * 6;
  const wristTop = KNUCKLE_Y.middle + 116;
  const wristBottom = KNUCKLE_Y.middle + 168;

  // Traced clockwise: across the knuckles, down the thumb side (past the heel of
  // the palm), around the wrist, then back up the pinky side.
  const outline: Point[] = [
    ...top,
    // Thumb side: the thenar muscle swells out past the index knuckle.
    { x: top[3].x - outward * 46, y: top[3].y + 54 },
    { x: top[3].x - outward * 40, y: wristTop - 26 },
    { x: wristCenter + 58, y: wristTop },
    { x: wristCenter + 62, y: wristBottom - 34 },
    { x: wristCenter, y: wristBottom },
    { x: wristCenter - 62, y: wristBottom - 34 },
    { x: wristCenter - 58, y: wristTop },
    // Pinky side sweeps back up to the little finger.
    { x: top[0].x + outward * 26, y: wristTop - 34 },
    { x: top[0].x + outward * 18, y: top[0].y + 52 },
  ];

  return buildSmoothClosedPath(outline);
}
