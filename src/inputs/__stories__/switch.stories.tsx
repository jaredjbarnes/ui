import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '../../themes/theme.js';
import { midnightStyleSheet } from '../../themes/themes/midnight/index.js';
import { HStack } from '../../stacks/h_stack.js';
import { VStack } from '../../stacks/v_stack.js';
import { Switch } from '../switch/switch.js';
import { BodyText } from '../../typography/body_text.js';

const meta: Meta = {
  title: 'Inputs/Switch',
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

export const Basic: Story = {
  render: () => <Switch defaultChecked />,
};

export const Sizes: Story = {
  render: () => (
    <HStack gap="12px" vAlign="center">
      <Switch size="sm" defaultChecked />
      <Switch size="md" defaultChecked />
      <Switch size="lg" defaultChecked />
    </HStack>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <VStack gap="12px">
      <HStack gap="8px" vAlign="center">
        <Switch id="sw-1" defaultChecked />
        <BodyText as="label" htmlFor="sw-1">Email notifications</BodyText>
      </HStack>
      <HStack gap="8px" vAlign="center">
        <Switch id="sw-2" />
        <BodyText as="label" htmlFor="sw-2">Push notifications</BodyText>
      </HStack>
    </VStack>
  ),
};

export const Disabled: Story = {
  render: () => (
    <HStack gap="12px" vAlign="center">
      <Switch disabled />
      <Switch disabled defaultChecked />
    </HStack>
  ),
};
