import type { Meta, StoryObj } from '@storybook/react';
import ModeToggle from './ModeToggle';
import useMockThemeStore from '../store/__mocks__/themeStore';
import useStore from '../store/themeStore';

type StoreType = typeof useStore;

declare global {
  interface Window {
    __MOCK_STORE__: StoreType;
  }
}

// Create a decorator to provide store context
const StoreDecorator = (Story: React.ComponentType) => {
  window.__MOCK_STORE__ = useMockThemeStore as StoreType;
  return <Story />;
};

const meta = {
  title: 'Components/ModeToggle',
  component: ModeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [StoreDecorator],
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof ModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story (light mode)
export const LightMode: Story = {
  args: {},
};

// Dark mode story
export const DarkMode: Story = {
  args: {},
  parameters: {
    darkMode: {
      current: 'dark',
    },
  },
};

// Interactive story
export const Interactive: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      // Simulate a click to toggle the mode
      button.click();
    }
  },
}; 