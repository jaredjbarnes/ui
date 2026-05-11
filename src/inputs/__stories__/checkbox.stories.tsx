import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '../../themes/theme.js';
import { midnightStyleSheet } from '../../themes/themes/midnight/index.js';
import { HStack } from '../../stacks/h_stack.js';
import { VStack } from '../../stacks/v_stack.js';
import { Checkbox } from '../checkbox/checkbox.js';
import { BodyText } from '../../typography/body_text.js';

const meta: Meta = {
  title: 'Inputs/Checkbox',
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
  render: () => <Checkbox defaultChecked />,
};

export const Sizes: Story = {
  render: () => (
    <HStack gap="12px" vAlign="center">
      <Checkbox size="sm" defaultChecked />
      <Checkbox size="md" defaultChecked />
      <Checkbox size="lg" defaultChecked />
    </HStack>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <VStack gap="8px">
      <HStack gap="8px" vAlign="center">
        <Checkbox id="cb-1" defaultChecked />
        <BodyText as="label" htmlFor="cb-1">
          Subscribe to newsletter
        </BodyText>
      </HStack>
      <HStack gap="8px" vAlign="center">
        <Checkbox id="cb-2" />
        <BodyText as="label" htmlFor="cb-2">
          Enable notifications
        </BodyText>
      </HStack>
    </VStack>
  ),
};

export const Disabled: Story = {
  render: () => (
    <HStack gap="12px" vAlign="center">
      <Checkbox disabled />
      <Checkbox disabled defaultChecked />
    </HStack>
  ),
};

export const Invalid: Story = {
  render: () => (
    <HStack gap="12px" vAlign="center">
      <Checkbox invalid />
      <Checkbox invalid defaultChecked />
    </HStack>
  ),
};
