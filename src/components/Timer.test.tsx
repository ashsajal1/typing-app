import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Timer from './Timer';

describe('Timer', () => {
  it('renders with correct time value', () => {
    const testTime = 42;
    render(<Timer time={testTime} />);
    
    // Check if the time is displayed correctly
    expect(screen.getByText(testTime.toString())).toBeInTheDocument();
  });

  it('renders with clock icon', () => {
    render(<Timer time={0} />);
    
    // Check if the clock icon is present
    const clockIcon = document.querySelector('svg');
    expect(clockIcon).toBeInTheDocument();
    expect(clockIcon).toHaveClass('h-4 w-4');
  });

  it('has correct styling classes', () => {
    render(<Timer time={0} />);
    
    // Get the main container
    const container = screen.getByText('0').parentElement;
    
    // Check if it has the correct classes
    expect(container).toHaveClass(
      'rounded',
      'w-full',
      'border',
      'border-success',
      'p-2',
      'flex',
      'items-center',
      'gap-2',
      'justify-start',
      'text-success'
    );
  });

  it('renders with zero time', () => {
    render(<Timer time={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders with large time value', () => {
    const largeTime = 999999;
    render(<Timer time={largeTime} />);
    expect(screen.getByText(largeTime.toString())).toBeInTheDocument();
  });
}); 