import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Adventurer } from '../components/Adventurer/Adventurer';

const meta = {
  title: 'Adventurer',
  component: Adventurer,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onDrop: fn()
  },
} satisfies Meta<typeof Adventurer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Alice: Story = {
  args: {
    name: "Alice",
    race: "Human",
    class: "Cleric",
    items: []
  },
};
