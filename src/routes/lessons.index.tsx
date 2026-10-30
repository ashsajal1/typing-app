import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, Check, Keyboard } from 'lucide-react';
import { LESSONS, LESSON_UNITS } from '../lib/lessons';
import { useLessonStore } from '../store/lessonStore';
import { SEO } from '../components/SEO';

export const Route = createFileRoute('/lessons/')({ component: LessonsPage });
function LessonsPage() {
  const completed = useLessonStore(state => state.completed);
  const count = LESSONS.filter(lesson => completed[lesson.id]).length;
  const next = LESSONS.find(lesson => !completed[lesson.id]) ?? LESSONS[0];
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
    <SEO title="Typing lessons" description="Learn touch typing with guided lessons, finger placement, and short practice sessions." />
    <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
      <aside>
        <Keyboard className="mb-5 text-primary" size={36} aria-hidden="true" />
        <h1 className="text-4xl font-bold tracking-tight">Typing lessons</h1>
        <p className="mt-4 leading-relaxed text-base-content/75">Build good habits, one key at a time. Start on the home row and work your way to confident sentences.</p>
        <div className="mt-8">
          <div className="mb-2 flex justify-between text-sm"><span>Your progress</span><span>{count} / {LESSONS.length}</span></div>
          <progress className="progress progress-primary w-full" aria-label="Completed lessons" value={count} max={LESSONS.length} />
          <p className="mt-2 text-xs text-base-content/60">Saved on this browser. Every lesson is available to try.</p>
        </div>
        <Link to="/lessons/$lessonId" params={{ lessonId: next.id }} className="btn btn-primary mt-6 w-full">
          {count === LESSONS.length ? 'Practice again' : count ? 'Continue learning' : 'Start first lesson'} <ArrowRight size={17} aria-hidden="true" />
        </Link>
        <p className="mt-6 text-sm leading-relaxed text-base-content/70">Relax your shoulders. Find the bumps on F and J. Aim for accuracy first; speed comes with practice.</p>
      </aside>
      <div className="space-y-10">
        {LESSON_UNITS.map(unit => <section key={unit} aria-label={unit}>
          <h2 className="mb-2 text-xl font-semibold">{unit}</h2>
          <div className="divide-y divide-base-300 border-y border-base-300">
            {LESSONS.filter(lesson => lesson.unit === unit).map(lesson => {
              const score = completed[lesson.id];
              return <Link key={lesson.id} to="/lessons/$lessonId" params={{ lessonId: lesson.id }}
                className="group flex items-center gap-4 px-2 py-5 transition-colors hover:bg-base-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${score ? 'bg-success/15 text-success' : 'bg-base-200 text-base-content/60'}`}>
                  {score ? <Check size={18} aria-label="Completed" /> : <Keyboard size={18} aria-hidden="true" />}
                </span>
                <div className="min-w-0 flex-1"><h3 className="font-semibold">{lesson.title}</h3><p className="mt-1 text-sm text-base-content/65">{lesson.keys} · 3 exercises</p></div>
                {score && <span className="hidden text-sm text-success sm:block">{score.accuracy}% accuracy</span>}
                <ArrowRight size={18} className="shrink-0 text-primary" aria-hidden="true" />
              </Link>;
            })}
          </div>
        </section>)}
      </div>
    </div>
  </main>;
}
