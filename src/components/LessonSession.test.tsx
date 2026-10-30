import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import LessonSession from './LessonSession';
import { useLessonStore } from '../store/lessonStore';
import { useKeyboardStore } from '../store/keyboardStore';
import { LESSONS } from '../lib/lessons';

vi.mock('@tanstack/react-router', () => ({ Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a> }));
vi.mock('./SEO', () => ({ SEO: () => null }));
vi.mock('./VirtualKeyboard', () => ({ default: () => null }));
const lesson = { ...LESSONS[0], exercises: ['fj', 'jf', 'ff'] };
afterEach(() => { cleanup(); useLessonStore.setState({ completed: {} }); });

describe('lesson sessions', () => {
  it('requires correcting mistakes and saves progress only after all exercises', () => {
    useKeyboardStore.setState({ soundEnabled: false });
    render(<LessonSession lesson={lesson} />);
    const field = () => screen.getByLabelText('Type the text above');
    fireEvent.change(field(), { target: { value: 'x' } });
    expect(screen.getByText('Press Backspace to correct the red tile.')).toBeInTheDocument();
    fireEvent.change(field(), { target: { value: 'xf' } });
    expect(field()).toHaveValue('x');
    fireEvent.change(field(), { target: { value: '' } });
    fireEvent.change(field(), { target: { value: 'f' } });
    fireEvent.change(field(), { target: { value: 'fj' } });
    expect(screen.getByText('Exercise complete')).toBeInTheDocument();
    expect(useLessonStore.getState().completed[lesson.id]).toBeUndefined();
    fireEvent.click(screen.getByText('Next exercise'));
    fireEvent.change(field(), { target: { value: 'j' } });
    fireEvent.change(field(), { target: { value: 'jf' } });
    fireEvent.click(screen.getByText('Next exercise'));
    fireEvent.change(field(), { target: { value: 'f' } });
    fireEvent.change(field(), { target: { value: 'ff' } });
    expect(screen.getByText('Lesson complete')).toBeInTheDocument();
    expect(useLessonStore.getState().completed[lesson.id].accuracy).toBe(89);
  });
  it('restarts an exercise without awarding completion', () => {
    render(<LessonSession lesson={lesson} />);
    fireEvent.change(screen.getByLabelText('Type the text above'), { target: { value: 'f' } });
    fireEvent.click(screen.getByText('Restart exercise'));
    expect(screen.getByLabelText('Type the text above')).toHaveValue('');
    expect(useLessonStore.getState().completed).toEqual({});
  });
});
