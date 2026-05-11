import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '../../themes/theme.js';
import { midnightStyleSheet } from '../../themes/themes/midnight/index.js';
import { VStack } from '../../stacks/v_stack.js';
import { HStack } from '../../stacks/h_stack.js';
import { Input } from '../input/input.js';
import { Textarea } from '../textarea/textarea.js';

const meta: Meta = {
  title: 'Inputs/Input & Textarea',
  decorators: [
    (Story) => (
      <Theme styleSheets={[midnightStyleSheet]} style={{ padding: 32 }}>
        <Story />
      </Theme>
    ),
  ],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const InputBasic: Story = {
  render: () => <Input placeholder="Type here…" />,
};

export const InputSizes: Story = {
  render: () => (
    <VStack gap="12px" >
      <Input size="sm" placeholder="sm" />
      <Input size="md" placeholder="md" />
      <Input size="lg" placeholder="lg" />
    </VStack>
  ),
};

export const InputPreFilled: Story = {
  render: () => <Input defaultValue="hello world" />,
};

export const InputInvalid: Story = {
  parameters: {
    docs: {
      description: {
        story: 'invalid switches the border to the error color and inherits the same on focus halo.',
      },
    },
  },
  render: () => <Input invalid defaultValue="not-an-email" />,
};

export const InputDisabled: Story = {
  render: () => <Input disabled defaultValue="locked" />,
};

export const InputWidthFill: Story = {
  parameters: {
    docs: {
      description: {
        story: 'width="fill" grows the input on the parent stack\'s main axis.',
      },
    },
  },
  render: () => (
    <HStack gap="8px">
      <Input width="120px" placeholder="fixed 120px" />
      <Input width="fill" placeholder='width="fill"' />
    </HStack>
  ),
};

export const TextareaBasic: Story = {
  render: () => <Textarea placeholder="Type a longer message…" rows={4} />,
};

export const TextareaSizes: Story = {
  render: () => (
    <VStack gap="12px">
      <Textarea size="sm" rows={3} placeholder="sm" />
      <Textarea size="md" rows={3} placeholder="md" />
      <Textarea size="lg" rows={3} placeholder="lg" />
    </VStack>
  ),
};
