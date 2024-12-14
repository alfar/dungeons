import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ItemSlot } from '../components/ItemSlot/ItemSlot';

const meta = {
    title: 'Inventory/ItemSlot',
    component: ItemSlot,
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
    args: { onClick: fn() },
  } satisfies Meta<typeof ItemSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    selected: false
  },
};

export const Selected: Story = {
  args: {
    selected: true
  },
};

export const Coin: Story = {
  args: {
    selected: false,
    itemIndex: 10
  }
};
  