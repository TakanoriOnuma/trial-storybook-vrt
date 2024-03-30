import { Meta, StoryObj } from '@storybook/react';
import { fn, within, userEvent } from '@storybook/test';
import { useState } from 'react';

import { Counter } from './Counter';

type Story = StoryObj<typeof Counter>;

const meta: Meta<typeof Counter> = {
  title: 'Counter',
  component: Counter,
  args: {
    count: 0,
    onChangeCount: fn(),
  },
};

export default meta;

export const Base: Story = {};

const LocalTemplate: Story['render'] = ({
  count: initialCount,
  ...restArgs
}) => {
  const [count, setCount] = useState(initialCount);

  return <Counter {...restArgs} count={count} onChangeCount={setCount} />;
};

export const Local: Story = {
  render: LocalTemplate,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '+' }));
    await userEvent.click(canvas.getByRole('button', { name: '+' }));
    await userEvent.click(canvas.getByRole('button', { name: '+' }));
    await userEvent.click(canvas.getByRole('button', { name: '-' }));
  },
};
