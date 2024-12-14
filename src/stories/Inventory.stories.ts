import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Inventory } from '../components/Inventory/Inventory';

const meta = {
    title: 'Inventory/Inventory',
    component: Inventory,
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
    args: { onSlotClicked: fn() },
  } satisfies Meta<typeof Inventory>;
  
  export default meta;
  type Story = StoryObj<typeof meta>;

  export const Empty: Story = {
    args: {
      slots: 4,
      selectedSlotIndex: 1
    },
  };
  
  export const Full: Story = {
    args: {
      slots: 4,
      selectedSlotIndex: 0,
      items: [1, 10, 6, 300]
    },
  };
  