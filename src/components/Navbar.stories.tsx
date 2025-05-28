import type { Meta, StoryObj } from '@storybook/react';
import Navbar from './Navbar';

// Create a decorator that provides a mock router context
const RouterDecorator = (Story: React.ComponentType) => (
  <div className="min-h-screen bg-base-100">
    <Story />
  </div>
);

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [RouterDecorator],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {},
};

// Story with dark mode
export const DarkMode: Story = {
  args: {},
  parameters: {
    darkMode: {
      current: 'dark',
    },
  },
}; 