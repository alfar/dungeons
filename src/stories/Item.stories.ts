import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Item } from '../components/Item/Item';

const meta = {
    title: 'Inventory/Item',
    component: Item,
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
    args: { },
  } satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const First: Story = {
  args: {
    itemIndex: 1
  },
};

export const Coin: Story = {
  args: {
    itemIndex: 10
  }
};

export const Map: Story = {
  args: {
    itemIndex: 21
  }
};

export const RedPotion: Story = {
  args: {
    itemIndex: 273
  }
};

export const YellowPotion: Story = {
  args: {
    itemIndex: 275
  }
};

export const GreenPotion: Story = {
  args: {
    itemIndex: 278
  }
};

export const Rose: Story = {
  args: {
    itemIndex: 299
  }
};

export const Carrot: Story = {
  args: {
    itemIndex: 310
  }
};

export const Steak: Story = {
  args: {
    itemIndex: 323
  }
};

export const Wine: Story = {
  args: {
    itemIndex: 343
  }
};

export const SilverKey: Story = {
  args: {
    itemIndex: 353
  }
};

export const GoldKey: Story = {
  args: {
    itemIndex: 354
  }
};

export const FancyKey: Story = {
  args: {
    itemIndex: 357
  }
};

export const SkullKey: Story = {
  args: {
    itemIndex: 358
  }
};

export const Letter: Story = {
  args: {
    itemIndex: 384
  }
};

export const Scroll: Story = {
  args: {
    itemIndex: 389
  }
};

export const Trumpet: Story = {
  args: {
    itemIndex: 401
  }
};

export const Teddy: Story = {
  args: {
    itemIndex: 427
  }
};

export const Swords: Story = {
  args: {
    itemIndex: 449
  }
};

export const Bow: Story = {
  args: {
    itemIndex: 528
  }
};

export const Shield: Story = {
  args: {
    itemIndex: 576
  }
};

export const Torso: Story = {
  args: {
    itemIndex: 608
  }
};

export const Flag: Story = {
  args: {
    itemIndex: 843
  }
};
