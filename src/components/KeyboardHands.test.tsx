import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import KeyboardHands from './KeyboardHands';
import { getKeyCenter, KEYBOARD_KEYS } from '../lib/keyboardLayout';
import { getFingersForCode } from '../lib/fingerAssignment';

describe('KeyboardHands', () => {
  it.each(['KeyN', 'KeyM'])('keeps the %s index-finger root below its curled tip', (code) => {
    const key = KEYBOARD_KEYS.find(key => key.code === code)!;
    for (const pressed of [false, true]) {
      const html = renderToStaticMarkup(<svg><KeyboardHands
        pressedCodes={pressed ? [code] : []} activeCode={pressed ? code : null}
        nextCode={code} nextFingers={getFingersForCode(code)}
      /></svg>);
      const doc = new DOMParser().parseFromString(html, 'image/svg+xml');
      const finger = doc.querySelector('[data-hand="right"] [data-finger="index"]');
      const cue = finger!.querySelector('path[fill]')!;
      const rootY = Number(cue.getAttribute('d')!.split(/\s+/)[2]);
      expect(rootY).toBeGreaterThan(getKeyCenter(key).y + 60);
    }
  });
  it('renders two continuous hands and valid curves for every assigned key', () => {
    for (const key of KEYBOARD_KEYS) {
      if (!getFingersForCode(key.code).length) continue;
      const html = renderToStaticMarkup(<svg><KeyboardHands pressedCodes={[key.code]} activeCode={key.code} /></svg>);
      expect(html.match(/class="typing-hand-outline"/g)).toHaveLength(2);
      expect(html).not.toMatch(/NaN|Infinity|undefined/);
      expect(html).toContain('translate(868 0) scale(-1 1)');
    }
  });
});
