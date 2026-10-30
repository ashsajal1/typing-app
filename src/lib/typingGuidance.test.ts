import { describe, expect, it } from 'vitest';
import { getTypingGuidance } from './typingGuidance';

describe('typing guidance', () => {
  it('cues the opposite Shift for uppercase letters and shifted punctuation', () => {
    expect(getTypingGuidance('A', false)).toMatchObject({ code: 'KeyA', shiftCode: 'ShiftRight' });
    expect(getTypingGuidance('N', false)).toMatchObject({ code: 'KeyN', shiftCode: 'ShiftLeft' });
    expect(getTypingGuidance('?', false)).toMatchObject({ code: 'Slash', shiftCode: 'ShiftLeft' });
    expect(getTypingGuidance('a', false).shiftCode).toBeNull();
  });
  it('replaces the next character with Backspace until a mistake is corrected', () => {
    expect(getTypingGuidance('A', true)).toMatchObject({
      code: 'Backspace', shiftCode: null, label: 'Backspace to correct',
      fingers: [{ hand: 'right', finger: 'pinky' }],
    });
    expect(getTypingGuidance(undefined, true).code).toBe('Backspace');
    expect(getTypingGuidance('A', false).code).toBe('KeyA');
  });
  it('handles newlines and completed text', () => {
    expect(getTypingGuidance('\n', false).code).toBe('Enter');
    expect(getTypingGuidance(undefined, false)).toMatchObject({ code: null, shiftCode: null, label: '' });
  });
});
