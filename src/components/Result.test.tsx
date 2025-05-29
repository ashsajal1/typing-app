import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Result from './Result';

// Helper function to create test props
const createTestProps = (accuracy: number, wpm: number, wpmHistory: number[] = []) => ({
  accuracy,
  wpm,
  wpmHistory,
  currentErrorMap: new Map<string, number>(),
  currentTotalErrors: 0
});

describe('Result', () => {
  // Test different performance levels
  describe('performance levels', () => {
    it('shows excellent status for high performance', () => {
      render(<Result {...createTestProps(95, 65, [60, 62, 65])} />);
      expect(screen.getByText('Excellent!')).toBeInTheDocument();
      expect(screen.getByText("You're a typing master!")).toBeInTheDocument();
    });

    it('shows great job status for good performance', () => {
      render(<Result {...createTestProps(85, 55, [50, 52, 55])} />);
      expect(screen.getByText('Great Job!')).toBeInTheDocument();
      expect(screen.getByText("You're getting really good at this!")).toBeInTheDocument();
    });

    it('shows good effort status for average performance', () => {
      render(<Result {...createTestProps(75, 45, [40, 42, 45])} />);
      expect(screen.getByText('Good Effort!')).toBeInTheDocument();
      expect(screen.getByText('Nice work, keep practicing!')).toBeInTheDocument();
    });

    it('shows keep practicing status for low performance', () => {
      render(<Result {...createTestProps(65, 35, [30, 32, 35])} />);
      expect(screen.getByText('Keep Practicing!')).toBeInTheDocument();
      expect(screen.getByText("You'll improve with more practice!")).toBeInTheDocument();
    });
  });

  // Test stats display
  describe('stats display', () => {
    it('displays correct accuracy', () => {
      render(<Result {...createTestProps(85, 50)} />);
      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('displays correct WPM', () => {
      render(<Result {...createTestProps(85, 50)} />);
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('calculates and displays error rate', () => {
      render(<Result {...createTestProps(85, 50)} />);
      expect(screen.getByText('15%')).toBeInTheDocument(); // 100 - 85
    });

    it('calculates and displays words per error', () => {
      render(<Result {...createTestProps(80, 40)} />);
      expect(screen.getByText('2.0')).toBeInTheDocument(); // 40 / 20
    });
  });

  // Test star rating
  describe('star rating', () => {
    it('displays correct number of stars for high performance', () => {
      // accuracy + wpm = 95 + 65 = 160, 160/30 = 5.33, floor = 5
      render(<Result {...createTestProps(95, 65)} />);
      const filledStars = document.querySelectorAll('.text-yellow-300');
      expect(filledStars.length).toBe(5);
    });

    it('displays correct number of stars for medium performance', () => {
      // accuracy + wpm = 80 + 40 = 120, 120/30 = 4
      render(<Result {...createTestProps(80, 40)} />);
      const filledStars = document.querySelectorAll('.text-yellow-300');
      expect(filledStars.length).toBe(4);
    });

    it('displays correct number of stars for low performance', () => {
      // accuracy + wpm = 60 + 30 = 90, 90/30 = 3
      render(<Result {...createTestProps(60, 30)} />);
      const filledStars = document.querySelectorAll('.text-yellow-300');
      expect(filledStars.length).toBe(3);
    });

    it('displays minimum of 1 star', () => {
      // accuracy + wpm = 20 + 10 = 30, 30/30 = 1
      render(<Result {...createTestProps(20, 10)} />);
      const filledStars = document.querySelectorAll('.text-yellow-300');
      expect(filledStars.length).toBe(1);
    });
  });

  // Test tips display
  describe('tips display', () => {
    it('shows appropriate tips for high performance', () => {
      render(<Result {...createTestProps(95, 65)} />);
      expect(screen.getByText('Try increasing your speed while maintaining accuracy')).toBeInTheDocument();
    });

    it('shows appropriate tips for low performance', () => {
      render(<Result {...createTestProps(65, 35)} />);
      expect(screen.getByText('Start with shorter texts')).toBeInTheDocument();
    });
  });

  // Test chart rendering
  describe('WPM chart', () => {
    it('renders chart with correct data', () => {
      const wpmHistory = [40, 45, 50];
      render(<Result {...createTestProps(85, 50, wpmHistory)} />);
      expect(screen.getByText('WPM Progress')).toBeInTheDocument();
    });

    it('handles empty WPM history', () => {
      render(<Result {...createTestProps(85, 50)} />);
      expect(screen.getByText('WPM Progress')).toBeInTheDocument();
    });
  });

  // Test action buttons
  describe('action buttons', () => {
    it('renders try again button', () => {
      render(<Result {...createTestProps(85, 50)} />);
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('renders restart test button', () => {
      render(<Result {...createTestProps(85, 50)} />);
      expect(screen.getByText('Restart Test')).toBeInTheDocument();
    });
  });
}); 