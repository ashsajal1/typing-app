import type { Meta, StoryObj } from '@storybook/react';
import { RouterProvider, createRouter, createRootRoute, createMemoryHistory } from '@tanstack/react-router';
import Navbar from './Navbar';

// Create a simple router for the stories
const rootRoute = createRootRoute({
  component: () => <Navbar />,
});

const router = createRouter({
  routeTree: rootRoute,
  history: createMemoryHistory(),
});

// Create a decorator to provide router context
const RouterDecorator = (Story: React.ComponentType) => (
  <RouterProvider router={router}>
    <Story />
  </RouterProvider>
);

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen', // Use fullscreen layout for navbar
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