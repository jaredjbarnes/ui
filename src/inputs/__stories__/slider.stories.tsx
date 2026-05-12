import type { Meta, StoryObj } from '@storybook/react';
import { VStack } from '../../stacks/v_stack.js';
import { Slider } from '../slider/slider.js';

const meta: Meta = {
  title: 'Inputs/Slider',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => <Slider defaultValue={50} />,
};

export const Sizes: Story = {
  render: () => (
    <VStack gap="20px" maxWidth="420px">
      <Slider size="sm" defaultValue={25} />
      <Slider size="md" defaultValue={50} />
      <Slider size="lg" defaultValue={75} />
    </VStack>
  ),
};

export const CustomRange: Story = {
  parameters: {
    docs: {
      description: {
        story: 'min / max / step are passed through to the native input. The track gradient updates via the --progress custom property.',
      },
    },
  },
  render: () => (
    <VStack gap="20px" maxWidth="420px">
      <Slider min={0} max={10} step={1} defaultValue={3} />
      <Slider min={-50} max={50} defaultValue={0} />
      <Slider min={0} max={1} step={0.01} defaultValue={0.42} />
    </VStack>
  ),
};

export const Disabled: Story = {
  render: () => <Slider disabled defaultValue={40} />,
};
