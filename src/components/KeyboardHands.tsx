import { useId, useMemo } from 'react';
import { getKnuckle, getRestTarget, HAND_FINGERS, THUMB } from '../lib/handKinematics';
import type { FingerTarget, Hand } from '../lib/fingerAssignment';
import { computeHandPoses, type HandPose } from '../lib/handPoses';

const HANDS: Hand[] = ['left', 'right'];

/** Draw both hands in the left hand's local frame, then mirror the right. */
function handShape(hand: Hand, pose: HandPose) {
  const localX = (x: number) => hand === 'left' ? x : 868 - x;
  const fingers = HAND_FINGERS.map((finger, i) => {
    const rest = getRestTarget(hand, finger);
    const target = pose.targets[finger];
    const x = localX(target ? target.x - pose.shift.x : rest.x);
    const y = target ? target.y - pose.shift.y : rest.y;
    const base = localX(getKnuckle(hand, finger).x);
    const width = [27, 30, 31, 29][i];
    // The raised knuckle sits behind the contact pad in this overhead view.
    const crown = y - [48, 58, 64, 24][i];
    // A bottom-row press curls into the palm: lower the finger root as well
    // as its tip, otherwise the contour doubles back through itself.
    const rootY = Math.max(222, y + 76);
    const shoulderY = crown + (rootY - crown) * 0.65;
    const left = base - width;
    const right = base + width;
    const contour = `C ${left} ${shoulderY} ${x - width - 8} ${crown + 35} ${x - width + 1} ${crown + 12}
      C ${x - width + 6} ${crown - 6} ${x + width - 6} ${crown - 8} ${x + width} ${crown + 13}
      C ${x + width + 7} ${crown + 40} ${right} ${shoulderY} ${right} ${rootY}`;
    return { finger, x, y, crown, left, right, rootY, contour,
      path: `M ${left} ${rootY} ${contour} Q ${base} ${rootY + 18} ${left} ${rootY} Z` };
  });
  const thumbTarget = pose.targets.thumb;
  const thumb = {
    x: localX(thumbTarget ? thumbTarget.x - pose.shift.x : THUMB[hand].restTarget.x) + (thumbTarget ? 0 : 70),
    y: thumbTarget ? thumbTarget.y - pose.shift.y : THUMB[hand].restTarget.y + 55,
  };
  const thumbCurve = `C 323 357 ${thumb.x - 42} ${thumb.y + 30} ${thumb.x - 30} ${thumb.y + 6}
    C ${thumb.x - 26} ${thumb.y - 21} ${thumb.x + 7} ${thumb.y - 29} ${thumb.x + 18} ${thumb.y - 4}
    C ${thumb.x + 24} ${thumb.y + 18} ${thumb.x + 25} ${thumb.y + 28} ${thumb.x + 30} ${thumb.y + 44}
    C ${thumb.x + 18} ${thumb.y + 87} 342 459 286 492`;
  const outline = `M 52 610 C 62 495 68 320 ${fingers[0].left} ${fingers[0].rootY} ` +
    fingers.map((f, i) => `${i ? `Q ${(fingers[i - 1].right + f.left) / 2} ${Math.max(fingers[i - 1].rootY, f.rootY) + 10} ${f.left} ${f.rootY}` : ''} ${f.contour}`).join(' ') +
    ` C 348 ${fingers[3].rootY + 30} 319 335 323 357 ${thumbCurve} C 263 510 245 559 242 610 Z`;
  return { fingers, outline, thumbPath: `M 323 357 ${thumbCurve} Q 308 414 323 357 Z` };
}

interface KeyboardHandsProps {
  pressedCodes: string[];
  activeCode: string | null;
  nextFingers?: FingerTarget[];
  nextCode?: string | null;
}

export default function KeyboardHands({ pressedCodes, activeCode, nextFingers = [], nextCode = null }: KeyboardHandsProps) {
  const id = useId().replace(/:/g, '');
  const poses = useMemo(() => computeHandPoses(pressedCodes, activeCode, nextFingers, nextCode),
    [pressedCodes, activeCode, nextFingers, nextCode]);
  return (
    <g className="typing-hands">
      <defs>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#947572" />
          <stop offset="0.26" stopColor="#c5a4a0" />
          <stop offset="0.65" stopColor="#d2b3ae" />
          <stop offset="1" stopColor="#9f7d79" />
        </linearGradient>
        <linearGradient id={`${id}-fade`} gradientUnits="userSpaceOnUse" x1="0" y1="440" x2="0" y2="610">
          <stop offset="0" stopColor="white" /><stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id={`${id}-wrist`} maskUnits="userSpaceOnUse" x="-200" y="-200" width="1400" height="1000">
          <rect x="-200" y="-200" width="1400" height="1000" fill={`url(#${id}-fade)`} />
        </mask>
        <radialGradient id={`${id}-knuckle`}>
          <stop offset="0" stopColor="#ffe5dc" stopOpacity="0.42" />
          <stop offset="1" stopColor="#ffe5dc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-cue`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24b5dd" stopOpacity="0.88" />
          <stop offset="1" stopColor="#24b5dd" stopOpacity="0" />
        </linearGradient>
      </defs>
      {HANDS.map((hand) => {
        const pose = poses[hand];
        const shape = handShape(hand, pose);
        return (
          <g key={hand} className="typing-hand-shift" style={{ transform: `translate(${pose.shift.x}px, ${pose.shift.y}px)` }}>
            <g transform={hand === 'right' ? 'translate(868 0) scale(-1 1)' : undefined}>
              <g className="typing-hand" mask={`url(#${id}-wrist)`} data-hand={hand}>
                <path d={shape.outline} fill={`url(#${id}-skin)`} className="typing-hand-outline" />
                <clipPath id={`${id}-${hand}-clip`}><path d={shape.outline} /></clipPath>
                <g clipPath={`url(#${id}-${hand}-clip)`}>
                  {shape.fingers.map(({ finger, path, x, crown }) => (
                    <g key={finger} data-finger={finger} data-active={pose.active === finger || undefined}>
                      <ellipse cx={x - 5} cy={crown + 30} rx="32" ry="52" fill={`url(#${id}-knuckle)`} />
                      {(pose.active === finger || nextFingers.some(f => f.hand === hand && f.finger === finger)) &&
                        <path d={path} fill={`url(#${id}-cue)`} />}
                      <path d={`M ${x - 16} ${crown + 56} Q ${x} ${crown + 62} ${x + 14} ${crown + 55}`} className="typing-hand-crease" />
                    </g>
                  ))}
                  {(pose.active === 'thumb' || nextFingers.some(f => f.hand === hand && f.finger === 'thumb')) &&
                    <path d={shape.thumbPath} fill={`url(#${id}-cue)`} />}
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </g>
  );
}
