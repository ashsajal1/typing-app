import type { Meta, StoryObj } from '@storybook/react';
import TypingTest from './TypingTest';

const meta = {
  title: 'Components/TypingTest',
  component: TypingTest,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'The text to type',
    },
    eclipsedTime: {
      control: 'number',
      description: 'Time limit in seconds (Infinity for no limit)',
    },
  },
} satisfies Meta<typeof TypingTest>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story with a simple text
export const Default: Story = {
  args: {
    text: 'The quick brown fox jumps over the lazy dog',
    eclipsedTime: Infinity,
  },
};

// Story with a time limit
export const WithTimeLimit: Story = {
  args: {
    text: 'The quick brown fox jumps over the lazy dog',
    eclipsedTime: 30,
  },
};

// Story with text containing translations
export const WithTranslations: Story = {
  args: {
    text: 'Hello [world](mundo) [how](como) are [you](tu)',
    eclipsedTime: Infinity,
  },
};

// Story with a longer text
export const LongText: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    eclipsedTime: Infinity,
  },
}; 