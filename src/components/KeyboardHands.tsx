import { useMemo, type CSSProperties } from 'react';
import {
  buildBonePath,
  buildPalmPath,
  FINGER_ANATOMY,
  getKnuckle,
  getRestTarget,
  HAND_FINGERS,
  solveFinger,
  THUMB,
} from '../lib/handKinematics';
import type { Point } from '../lib/keyboardLayout';
import type { Finger, FingerTarget, Hand } from '../lib/fingerAssignment';
import type { Digit, HandPose } from '../lib/handPoses';
import { computeHandPoses } from '../lib/handPoses';

const HANDS: Hand[] = ['left', 'right'];

/**
 * Pose for each hand, recomputed only when the keys being typed change. The
 * maths lives in `handPoses` so it can be unit-tested without a render.
 */
function useHandPoses(
  pressedCodes: string[],
  activeCode: string | null,
  nextFingers: FingerTarget[],
  nextCode: string | null
): Record<Hand, HandPose> {
  return useMemo(
    () => computeHandPoses(pressedCodes, activeCode, nextFingers, nextCode),
    [pressedCodes, activeCode, nextFingers, nextCode]
  );
}

/** Unit-length direction from `from` towards `to`. */
function direction(from: Point, to: Point): Point {
  const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  return { x: (to.x - from.x) / length, y: (to.y - from.y) / length };
}

interface FingerShapeProps {
  hand: Hand;
  finger: Finger;
  pose: HandPose;
  /** The finger that should press the next character, highlighted as a cue. */
  isNext?: boolean;
  silhouette?: boolean;
}

/** Draws one finger as a tapering silhouette with a nail and joint creases. */
function FingerShape({ hand, finger, pose, isNext = false, silhouette = false }: FingerShapeProps) {
  const isThumb = finger === 'thumb';
  const knuckle = isThumb ? THUMB[hand].base : getKnuckle(hand, finger as Digit);
  const anatomy = isThumb ? THUMB[hand].anatomy : FINGER_ANATOMY[finger as Digit];
  // Fingers are solved in the hand's own frame: the slide towards the key is
  // applied to the whole hand by an ancestor, so palm and fingers move as one
  // piece. A finger with nothing to press simply keeps its resting pose.
  const rest = isThumb ? THUMB[hand].restTarget : getRestTarget(hand, finger as Digit);
  const target = pose.targets[finger];
  const aim = target
    ? { x: target.x - pose.shift.x, y: target.y - pose.shift.y }
    : rest;
  // Joints are solved from the knuckle, so the bones and the palm can never
  // drift apart while the hand glides towards a key.
  const points = solveFinger(knuckle, anatomy, aim, hand === 'left' ? 1 : -1);
  const isActive = pose.active === finger;
  const tipWidth = anatomy.widths[anatomy.widths.length - 1];

  const className = [
    'hand-bone',
    isActive && 'hand-bone-active',
    !isActive && isNext && 'hand-bone-next',
  ]
    .filter(Boolean)
    .join(' ');
  const bodyPath = buildBonePath(points, anatomy.widths);
  if (silhouette) return <path d={bodyPath} fill="white" />;

  // A narrower copy of the same silhouette, offset towards the light, reads as
  // a soft highlight along each rounded finger.
  const sheenPath = buildBonePath(
    points,
    anatomy.widths.map((width) => width * 0.32)
  );

  // Joint + nail details need the full 4-point chain (knuckle + 3 joints).
  const hasJoints = points.length >= 4;
  const joints = hasJoints ? [points[1], points[2]] : [];
  const tip = points[points.length - 1];
  const beforeTip = points.length >= 2 ? points[points.length - 2] : knuckle;
  const tipDir = direction(beforeTip, tip);
  // Perpendicular to the fingertip, used for creases and the nail's short axis.
  const tipNormal = { x: -tipDir.y, y: tipDir.x };
  const tipAngle = (Math.atan2(tipDir.y, tipDir.x) * 180) / Math.PI;
  const nailBack = tipWidth * (isThumb ? 1.5 : 1.35);
  const nail = {
    x: tip.x - tipDir.x * nailBack,
    y: tip.y - tipDir.y * nailBack,
  };
  const nailRx = tipWidth * (isThumb ? 0.78 : 0.68);
  const nailRy = tipWidth * (isThumb ? 0.62 : 0.52);

  return (
    <g
      className={
        isActive
          ? 'hand-finger hand-finger-active'
          : isNext
            ? 'hand-finger hand-finger-next'
            : 'hand-finger'
      }
      data-hand={hand}
      data-finger={finger}
      data-active={isActive || undefined}
      data-next={!isActive && isNext ? true : undefined}
    >
      {isActive && (
        <ellipse
          cx={aim.x}
          cy={aim.y}
          rx={tipWidth * 1.25}
          ry={tipWidth * 0.9}
          className="hand-contact-shadow"
        />
      )}
      {/* The outline and shaded fill give each finger a soft edge. */}
      {(isActive || isNext) && <path d={bodyPath} className="hand-outline" />}
      {(isActive || isNext) && <path d={bodyPath} className={className} />}
      {(isActive || isNext) && hasJoints && (
        <path d={sheenPath} className="hand-sheen" transform="translate(-2 -3)" />
      )}
      {(isActive || isNext) && joints.map((joint, index) => {
        const prev = points[index];
        const next = points[index + 2];
        const along = direction(prev, next);
        const normal = { x: -along.y, y: along.x };
        const halfLen = anatomy.widths[index + 1] * 0.52;
        return (
          <line
            key={index}
            x1={joint.x - normal.x * halfLen}
            y1={joint.y - normal.y * halfLen}
            x2={joint.x + normal.x * halfLen}
            y2={joint.y + normal.y * halfLen}
            className="hand-crease"
          />
        );
      })}
      {(isActive || isNext) && hasJoints && (
        <ellipse
          cx={nail.x}
          cy={nail.y}
          rx={nailRx}
          ry={nailRy}
          transform={`rotate(${tipAngle + 90} ${nail.x} ${nail.y})`}
          className="hand-nail"
          style={
            {
              '--nail-tilt-x': tipNormal.x.toFixed(3),
              '--nail-tilt-y': tipNormal.y.toFixed(3),
            } as CSSProperties
          }
        />
      )}
    </g>
  );
}

interface KeyboardHandsProps {
  /** Every key currently held down, in the order they were pressed. */
  pressedCodes: string[];
  /** The last non-modifier key pressed. */
  activeCode: string | null;
  /** Fingers that should press the next character, used as a coaching cue. */
  nextFingers?: FingerTarget[];
  /** The key the next character needs, previewed when nothing is held down. */
  nextCode?: string | null;
}

export default function KeyboardHands({
  pressedCodes,
  activeCode,
  nextFingers = [],
  nextCode = null,
}: KeyboardHandsProps) {
  const poses = useHandPoses(pressedCodes, activeCode, nextFingers, nextCode);

  const isNext = (hand: Hand, finger: Finger) =>
    nextFingers.some((target) => target.hand === hand && target.finger === finger);

  const orderFingers = (hand: Hand, pose: HandPose): Finger[] => {
    const all: Finger[] = [...HAND_FINGERS, 'thumb'];
    const rank = (finger: Finger) =>
      pose.active === finger ? 2 : isNext(hand, finger) ? 1 : 0;
    // Inactive fingers first so the pressing / cued finger paints on top.
    return [...all].sort((a, b) => rank(a) - rank(b));
  };

  return (
    <g className="hand-layer hand-fade">
      <defs>
        {/* Translucent shading keeps the key labels readable beneath the hands. */}
        <radialGradient id="hand-palm-grad" cx="45%" cy="35%" r="70%">
          <stop offset="0%" style={{ stopColor: 'var(--hand-glass-top)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--hand-glass-bottom)' }} />
        </radialGradient>
        <radialGradient id="hand-finger-grad" cx="40%" cy="35%" r="75%">
          <stop offset="0%" style={{ stopColor: 'var(--hand-glass-top)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--hand-glass-bottom)' }} />
        </radialGradient>
        <linearGradient id="hand-active-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--hand-active-top)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--hand-active-bottom)' }} />
        </linearGradient>
        <linearGradient id="hand-next-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--hand-next-top)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--hand-next-bottom)' }} />
        </linearGradient>
      </defs>
      {HANDS.map((hand) => {
        const pose = poses[hand];
        return (
          <g key={hand} className="hand" data-hand={hand}>
            {/* One transform for the whole hand: the palm and every finger
                glide together, instead of the fingers jumping ahead of the
                palm each time the hand reaches for a key. */}
            <g
              className="hand-shift"
              style={{ transform: `translate(${pose.shift.x}px, ${pose.shift.y}px)` }}
            >
              <mask id={`hand-silhouette-${hand}`} maskUnits="userSpaceOnUse" x="-200" y="-200" width="1400" height="1000">
                <path d={buildPalmPath(hand)} fill="white" />
                {([...HAND_FINGERS, 'thumb'] as Finger[]).map((finger) => (
                  <FingerShape key={finger} hand={hand} finger={finger} pose={pose} silhouette />
                ))}
              </mask>
              <rect x="-200" y="-200" width="1400" height="1000" className="hand-surface" mask={`url(#hand-silhouette-${hand})`} />
              {orderFingers(hand, pose).map((finger) => (
                <FingerShape
                  key={finger}
                  hand={hand}
                  finger={finger}
                  pose={pose}
                  isNext={isNext(hand, finger)}
                />
              ))}
            </g>
          </g>
        );
      })}
    </g>
  );
}
