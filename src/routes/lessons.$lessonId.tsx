import { createFileRoute, Link } from '@tanstack/react-router';
import { LESSONS } from '../lib/lessons';
import LessonSession from '../components/LessonSession';

export const Route = createFileRoute('/lessons/$lessonId')({ component: LessonPage });
function LessonPage() {
  const { lessonId } = Route.useParams();
  const lesson = LESSONS.find(item => item.id === lessonId);
  if (!lesson) return <main className="mx-auto max-w-3xl p-10"><h1 className="text-3xl font-bold">Lesson not found</h1><Link to="/lessons" className="btn btn-primary mt-6">Browse lessons</Link></main>;
  return <LessonSession key={lesson.id} lesson={lesson} />;
}
