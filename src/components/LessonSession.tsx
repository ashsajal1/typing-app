import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { LESSONS, type TypingLesson } from '../lib/lessons';
import { getTypingGuidance } from '../lib/typingGuidance';
import { useLessonStore, type LessonScore } from '../store/lessonStore';
import { useKeyboardStore } from '../store/keyboardStore';
import { usePressedKeys } from '../hooks/usePressedKeys';
import { useTypingSound } from '../hooks/useTypingSound';
import VirtualKeyboard from './VirtualKeyboard';
import { SEO } from './SEO';

export default function LessonSession({ lesson }: { lesson: TypingLesson }) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const [scores, setScores] = useState<LessonScore[]>([]);
  const [result, setResult] = useState<LessonScore | null>(null);
  const started = useRef<number | null>(null);
  const field = useRef<HTMLInputElement>(null);
  const complete = useLessonStore(state => state.complete);
  const { soundEnabled, toggleSound, showVirtualKeyboard, toggleVirtualKeyboard } = useKeyboardStore();
  const keys = usePressedKeys(!result && showVirtualKeyboard);
  useTypingSound(!result);
  const text = lesson.exercises[step];
  const wrong = !text.startsWith(input);
  const guidance = getTypingGuidance(text[input.length], wrong);
  const finished = !!result && step === lesson.exercises.length - 1;
  const next = LESSONS[LESSONS.findIndex(item => item.id === lesson.id) + 1];

  const cursor = Math.max(0, input.length - Number(wrong));
  const pageStart = Math.floor(cursor / 8) * 8;
  useEffect(() => {
    if (!result && window.innerWidth > 768) field.current?.focus({ preventScroll: true });
  }, [step, result]);

  function type(value: string) {
    if (result) return;
    if (value.length < input.length) { setInput(value); return; }
    if (wrong || value.length !== input.length + 1) return;
    started.current ??= Date.now();
    const mistake = !text.startsWith(value);
    const total = attempts + 1;
    const misses = errors + Number(mistake);
    setAttempts(total); setErrors(misses); setInput(value);
    if (value === text) {
      const score = {
        accuracy: Math.round((total - misses) / total * 100),
        wpm: Math.round((text.length / 5) / (Math.max(1000, Date.now() - started.current) / 60000)),
      };
      setResult(score);
      if (step === lesson.exercises.length - 1) {
        const all = [...scores, score];
        complete(lesson.id, {
          accuracy: Math.round(all.reduce((sum, item) => sum + item.accuracy, 0) / all.length),
          wpm: Math.round(all.reduce((sum, item) => sum + item.wpm, 0) / all.length),
        });
      }
    }
  }
  function reset(nextStep = step) {
    setStep(nextStep); setInput(''); setAttempts(0); setErrors(0); setResult(null); started.current = null;
    requestAnimationFrame(() => field.current?.focus());
  }

  return <main className="lesson-workspace">
    <SEO title={lesson.title} description={lesson.instruction} />
    <aside className="lesson-sidebar">
      <Link to="/lessons" className="inline-flex items-center gap-2 text-sm text-primary hover:underline"><ArrowLeft size={16} aria-hidden="true" /> All lessons</Link>
      <h1 className="mt-8 text-2xl font-bold">{lesson.title}</h1>
      <p className="mt-4 leading-relaxed text-base-content/75">{lesson.instruction}</p>
      <p className="mt-8 text-sm">Exercise {step + 1} of {lesson.exercises.length}</p>
      <progress className="progress progress-primary mt-3 w-full" aria-label="Lesson progress" value={step + (result ? 1 : cursor / text.length)} max={lesson.exercises.length} />
      <ol className="mt-5 space-y-3 text-sm">
        {['Get to know the keys', 'Build a rhythm', 'Put it into practice'].map((label, index) =>
          <li key={label} className={index === step ? 'font-semibold text-primary' : 'text-base-content/60'} aria-current={index === step ? 'step' : undefined}>{index < step ? '✓ ' : ''}{label}</li>)}
      </ol>
      <div className="mt-8 flex flex-col items-start gap-5">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="toggle toggle-primary toggle-sm" checked={soundEnabled} onChange={toggleSound} />Typing sound</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="toggle toggle-primary toggle-sm" checked={showVirtualKeyboard} onChange={toggleVirtualKeyboard} />Keyboard guide</label>
        <button className="btn btn-ghost btn-sm" onClick={() => reset()}><RotateCcw size={15} />Restart exercise</button>
      </div>
    </aside>
    <div className="lesson-stage">
    {result ? <section className="mx-auto max-w-xl py-14 text-center" aria-live="polite">
      <CheckCircle2 size={40} className="mx-auto mb-5 text-success" aria-hidden="true" />
      <h2 className="text-3xl font-bold">{finished ? 'Lesson complete' : 'Exercise complete'}</h2>
      <p className="mt-3 text-base-content/70">{finished ? 'Your progress is saved. Come back anytime to practice again.' : 'Take a breath, then try the next exercise.'}</p>
      <dl className="my-8 flex justify-center gap-12"><div><dt className="text-sm text-base-content/65">Exercise accuracy</dt><dd className="mt-1 text-3xl font-semibold">{result.accuracy}%</dd></div><div><dt className="text-sm text-base-content/65">Words per minute</dt><dd className="mt-1 text-3xl font-semibold">{result.wpm}</dd></div></dl>
      <div className="flex flex-wrap justify-center gap-3">
        <button className="btn btn-outline" onClick={() => { if (finished) { setScores([]); reset(0); } else reset(); }}><RotateCcw size={16} />{finished ? 'Repeat lesson' : 'Try again'}</button>
        {!finished ? <button className="btn btn-primary" onClick={() => { setScores([...scores, result]); reset(step + 1); }}>Next exercise <ArrowRight size={16} /></button> :
          next ? <Link className="btn btn-primary" to="/lessons/$lessonId" params={{ lessonId: next.id }}>Next lesson <ArrowRight size={16} /></Link> : <Link to="/lessons" className="btn btn-primary">Back to lessons</Link>}
      </div>
    </section> : <>
      <section className="lesson-drill" aria-label="Typing exercise" onClick={() => field.current?.focus({ preventScroll: true })}>
        <div className="lesson-status" id="lesson-feedback" aria-live="polite">
          <span className={wrong ? 'text-error' : 'text-base-content/70'}>{wrong ? 'Press Backspace to correct the red tile.' : guidance.label ? `Use ${guidance.label}.` : 'Keep going.'}</span>
          <span className="text-sm text-base-content/60">{cursor} / {text.length}</span>
        </div>
        <div className="lesson-tiles" aria-label={`Type: ${text}`}>
          {Array.from({ length: 8 }, (_, offset) => {
            const index = pageStart + offset;
            const char = text[index];
            const current = index === cursor;
            return <div key={index} aria-hidden="true" className={`lesson-tile ${!char ? 'lesson-tile-empty' : wrong && current ? 'lesson-tile-wrong' : current ? 'lesson-tile-current' : index < cursor ? 'lesson-tile-done' : ''}`}>
              {!attempts && current && <span className="lesson-start-hint">Start typing!</span>}
              {char === ' ' ? '␣' : char}
            </div>;
          })}
        </div>
        <label htmlFor="lesson-input" className="sr-only">Type the text above</label>
        <input ref={field} id="lesson-input" className="lesson-capture" value={input} onChange={event => type(event.target.value)}
          onPaste={event => event.preventDefault()} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          aria-describedby="lesson-feedback" aria-invalid={wrong} placeholder="Tap here to type…" />
        {showVirtualKeyboard && <div className="lesson-keyboard"><VirtualKeyboard fitViewport={false} pressedCodes={keys.codes} activeCode={keys.activeCode} shift={keys.shift} nextCode={guidance.code} nextShiftCode={guidance.shiftCode} nextFingers={guidance.fingers} /></div>}
      </section>
    </>}
    </div>
  </main>;
}
