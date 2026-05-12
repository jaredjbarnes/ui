import type { Meta, StoryObj } from '@storybook/react';
import { HStack } from '../../stacks/h_stack.js';
import { Radio } from '../radio/radio.js';
import { RadioGroup } from '../radio/radio_group.js';
import { BodyText } from '../../typography/body_text.js';

const meta: Meta = {
  title: 'Inputs/Radio',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const SingleRadio: Story = {
  render: () => <Radio name="solo" value="x" defaultChecked />,
};

export const Group: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'RadioGroup manages selection state and passes name / value / onChange to children via context. Each Radio supplies its own value.',
      },
    },
  },
  render: () => (
    <RadioGroup name="plan" defaultValue="pro">
      <HStack gap="8px" vAlign="center">
        <Radio id="plan-free" value="free" />
        <BodyText as="label" htmlFor="plan-free">Free</BodyText>
      </HStack>
      <HStack gap="8px" vAlign="center">
        <Radio id="plan-pro" value="pro" />
        <BodyText as="label" htmlFor="plan-pro">Pro</BodyText>
      </HStack>
      <HStack gap="8px" vAlign="center">
        <Radio id="plan-team" value="team" />
        <BodyText as="label" htmlFor="plan-team">Team</BodyText>
      </HStack>
    </RadioGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <RadioGroup name="size-demo" defaultValue="md">
      <HStack gap="12px" vAlign="center">
        <Radio size="sm" value="sm" />
        <Radio size="md" value="md" />
        <Radio size="lg" value="lg" />
      </HStack>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup name="disabled-demo" defaultValue="b" disabled>
      <HStack gap="8px" vAlign="center">
        <Radio id="d-a" value="a" />
        <BodyText as="label" htmlFor="d-a">Option A</BodyText>
      </HStack>
      <HStack gap="8px" vAlign="center">
        <Radio id="d-b" value="b" />
        <BodyText as="label" htmlFor="d-b">Option B (selected)</BodyText>
      </HStack>
    </RadioGroup>
  ),
};
