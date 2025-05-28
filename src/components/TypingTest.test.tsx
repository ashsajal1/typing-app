import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import TypingTest from './TypingTest';

describe('TypingTest', () => {
  const mockText = 'Hello world';
  const mockEclipsedTime = 60;

  beforeEach(() => {
    // Reset any mocks or state before each test
    vi.useFakeTimers();
  });

  it('renders initial state correctly', () => {
    render(<TypingTest text={mockText} eclipsedTime={mockEclipsedTime} />);
    
    // Check if the initial message is displayed
    expect(screen.getByText('Start typing to begin the test')).toBeInTheDocument();
    
    // Check if the stats are initialized
    expect(screen.getByText('0s')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('starts the test when user types', async () => {
    const user = userEvent.setup();
    render(<TypingTest text={mockText} eclipsedTime={mockEclipsedTime} />);
    
    // Type the first character
    await user.type(screen.getByPlaceholderText('Start typing...'), 'H');
    
    // Check if the test has started
    expect(screen.queryByText('Start typing to begin the test')).not.toBeInTheDocument();
    
    // Check if the timer has started
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('1s')).toBeInTheDocument();
  });

  it('handles correct typing', async () => {
    const user = userEvent.setup();
    render(<TypingTest text={mockText} eclipsedTime={mockEclipsedTime} />);
    
    // Type the correct text
    await user.type(screen.getByPlaceholderText('Start typing...'), 'Hello');
    
    // Check if the characters are marked as correct
    const correctChars = screen.getAllByText(/[H|e|l|o]/);
    correctChars.forEach(char => {
      expect(char).toHaveClass('text-green-500');
    });
  });

  it('handles incorrect typing', async () => {
    const user = userEvent.setup();
    render(<TypingTest text={mockText} eclipsedTime={mockEclipsedTime} />);
    
    // Type an incorrect character
    await user.type(screen.getByPlaceholderText('Start typing...'), 'X');
    
    // Check if the character is marked as incorrect
    const incorrectChar = screen.getByText('X');
    expect(incorrectChar).toHaveClass('text-red-500');
    
    // Check if the mistake alert is shown
    expect(screen.getByText('Fix the mistake before continuing!')).toBeInTheDocument();
  });

  it('calculates WPM and accuracy correctly', async () => {
    const user = userEvent.setup();
    render(<TypingTest text={mockText} eclipsedTime={mockEclipsedTime} />);
    
    // Type the text
    await user.type(screen.getByPlaceholderText('Start typing...'), 'Hello world');
    
    // Advance timer to calculate WPM
    act(() => {
      vi.advanceTimersByTime(60000); // 1 minute
    });
    
    // Check if WPM is calculated (should be 2 words per minute)
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('handles test completion', async () => {
    const user = userEvent.setup();
    render(<TypingTest text={mockText} eclipsedTime={mockEclipsedTime} />);
    
    // Type the complete text
    await user.type(screen.getByPlaceholderText('Start typing...'), 'Hello world');
    
    // Click finish button
    await user.click(screen.getByText('Finish'));
    
    // Check if the Result component is rendered
    expect(screen.getByText('Words per minute')).toBeInTheDocument();
  });

  it('handles reset functionality', async () => {
    const user = userEvent.setup();
    render(<TypingTest text={mockText} eclipsedTime={mockEclipsedTime} />);
    
    // Type some text
    await user.type(screen.getByPlaceholderText('Start typing...'), 'Hello');
    
    // Click reset button
    await user.click(screen.getByText('Reset'));
    
    // Check if the component is reset
    expect(screen.getByText('Start typing to begin the test')).toBeInTheDocument();
    expect(screen.getByText('0s')).toBeInTheDocument();
  });

  it('handles keyboard shortcuts', async () => {
    const user = userEvent.setup();
    render(<TypingTest text={mockText} eclipsedTime={mockEclipsedTime} />);
    
    // Test Escape key
    await user.keyboard('{Escape}');
    expect(screen.getByText('Start typing to begin the test')).toBeInTheDocument();
    
    // Test Enter key after typing
    await user.type(screen.getByPlaceholderText('Start typing...'), 'Hello world');
    await user.keyboard('{Enter}');
    expect(screen.getByText('Words per minute')).toBeInTheDocument();
  });

  it('handles mobile input correctly', () => {
    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    
    render(<TypingTest text={mockText} eclipsedTime={mockEclipsedTime} />);
    
    // Check if mobile input is rendered
    expect(screen.getByText('Type in the input field above')).toBeInTheDocument();
  });
}); 