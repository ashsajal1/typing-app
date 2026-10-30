import { describeFingers, getFingersForCode } from './fingerAssignment';
import { getCodeForCharacter, getKeyByCode } from './keyboardLayout';

export function getTypingGuidance(character: string | undefined, needsCorrection: boolean) {
  const code = needsCorrection ? 'Backspace' : character === '\n' ? 'Enter' :
    character ? getCodeForCharacter(character) ?? null : null;
  const fingers = code ? getFingersForCode(code) : [];
  const shifted = !needsCorrection && character &&
    (/^[A-Z]$/.test(character) || (code && getKeyByCode(code)?.shiftLabel === character));
  const shiftCode = shifted ? (fingers[0]?.hand === 'left' ? 'ShiftRight' : 'ShiftLeft') : null;
  const label = needsCorrection ? 'Backspace to correct' :
    `${shiftCode ? 'Shift + ' : ''}${describeFingers(fingers)}`;
  return { code, fingers, shiftCode, label };
}
