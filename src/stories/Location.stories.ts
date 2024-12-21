import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Location } from '../components/Location/Location';

const meta = {
  title: 'Location',
  component: Location,
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
    onPickUp: fn()
  },
} satisfies Meta<typeof Location>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    locationId: 919,
    name: "An empty room",
    description: "Nothing to see here",
    items: []
  },
};

export const TwoThings: Story = {
  args: {
    locationId: 920,
    name: "Something here",
    description: "A dark room, but with something to see.",
    items: [6, 10]
  },
};
