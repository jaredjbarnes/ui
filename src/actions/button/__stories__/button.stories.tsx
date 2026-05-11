import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button/button.js';
import { Theme } from '../../../themes/theme.js';
import { midnightStyleSheet } from '../../../themes/themes/midnight/index.js';
import { HStack } from '../../../stacks/h_stack.js';
import { VStack } from '../../../stacks/v_stack.js';

const meta: Meta<typeof Button> = {
  title: 'Actions/Button',
  component: Button,
  decorators: [
    (Story) => (
      <Theme styleSheets={[midnightStyleSheet]} style={{ padding: 24 }}>
        <Story />
      </Theme>
    ),
  ],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  render: () => <Button>Click me</Button>,
};

export const Hierarchy: Story = {
  render: () => (
    <HStack gap="12px">
      <Button hierarchy="tertiary">Tertiary</Button>
      <Button hierarchy="secondary">Secondary</Button>
      <Button hierarchy="primary">Primary</Button>
    </HStack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <HStack gap="12px" vAlign="center">
      <Button hierarchy="primary" size="sm">SM</Button>
      <Button hierarchy="primary" size="md">MD</Button>
      <Button hierarchy="primary" size="lg">LG</Button>
    </HStack>
  ),
};

export const SeverityPrimary: Story = {
  render: () => (
    <HStack gap="12px">
      <Button hierarchy="primary" severity="neutral">neutral</Button>
      <Button hierarchy="primary" severity="suggested">suggested</Button>
      <Button hierarchy="primary" severity="encouraged">encouraged</Button>
      <Button hierarchy="primary" severity="cautious">cautious</Button>
      <Button hierarchy="primary" severity="dangerous">dangerous</Button>
    </HStack>
  ),
};

export const SeveritySecondary: Story = {
  render: () => (
    <HStack gap="12px">
      <Button hierarchy="secondary" severity="neutral">neutral</Button>
      <Button hierarchy="secondary" severity="suggested">suggested</Button>
      <Button hierarchy="secondary" severity="encouraged">encouraged</Button>
      <Button hierarchy="secondary" severity="cautious">cautious</Button>
      <Button hierarchy="secondary" severity="dangerous">dangerous</Button>
    </HStack>
  ),
};

export const SeverityTertiary: Story = {
  render: () => (
    <HStack gap="12px">
      <Button hierarchy="tertiary" severity="neutral">neutral</Button>
      <Button hierarchy="tertiary" severity="suggested">suggested</Button>
      <Button hierarchy="tertiary" severity="encouraged">encouraged</Button>
      <Button hierarchy="tertiary" severity="cautious">cautious</Button>
      <Button hierarchy="tertiary" severity="dangerous">dangerous</Button>
    </HStack>
  ),
};

export const StateHover: Story = {
  parameters: {
    docs: {
      description: {
        story: 'data-hover pins the hover state without needing a real cursor.',
      },
    },
  },
  render: () => <Button hierarchy="primary" data-hover>Hover</Button>,
};

export const StateFocus: Story = {
  render: () => <Button hierarchy="primary" data-focus-visible>Focus</Button>,
};

export const StatePress: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'data-active pins the press state. Press depresses (translateY +1px) and flips the box-shadow: drop shadow vanishes, top edge becomes inner shadow.',
      },
    },
  },
  render: () => <Button hierarchy="primary" data-active>Press</Button>,
};

export const Disabled: Story = {
  render: () => (
    <HStack gap="12px">
      <Button hierarchy="tertiary" disabled>Tertiary</Button>
      <Button hierarchy="secondary" disabled>Secondary</Button>
      <Button hierarchy="primary" disabled>Primary</Button>
    </HStack>
  ),
};

export const CustomColor: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `color` prop sets --j13b-button-color, which feeds into --mat for primary or --ink for outlined/ghost. State colors recompute against the new material automatically.',
      },
    },
  },
  render: () => (
    <HStack gap="12px">
      <Button hierarchy="tertiary" color="#d29922">Gold</Button>
      <Button hierarchy="secondary" color="#d29922">Gold</Button>
      <Button hierarchy="primary" color="#d29922">Gold</Button>
    </HStack>
  ),
};

export const Utility: Story = {
  parameters: {
    docs: {
      description: {
        story: 'utility makes the button square and content-sized — for icon-only or compact buttons.',
      },
    },
  },
  render: () => (
    <HStack gap="12px">
      <Button utility hierarchy="tertiary" aria-label="Close">×</Button>
      <Button utility hierarchy="secondary" aria-label="Add">+</Button>
      <Button utility hierarchy="primary" aria-label="Confirm">✓</Button>
    </HStack>
  ),
};

export const VStackComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Three rows showing rest / hover / focus / press for each hierarchy. Useful as a regression check.',
      },
    },
  },
  render: () => (
    <VStack gap="16px">
      <HStack gap="12px">
        <Button hierarchy="tertiary">rest</Button>
        <Button hierarchy="tertiary" data-hover>hover</Button>
        <Button hierarchy="tertiary" data-focus-visible>focus</Button>
        <Button hierarchy="tertiary" data-active>press</Button>
      </HStack>
      <HStack gap="12px">
        <Button hierarchy="secondary">rest</Button>
        <Button hierarchy="secondary" data-hover>hover</Button>
        <Button hierarchy="secondary" data-focus-visible>focus</Button>
        <Button hierarchy="secondary" data-active>press</Button>
      </HStack>
      <HStack gap="12px">
        <Button hierarchy="primary">rest</Button>
        <Button hierarchy="primary" data-hover>hover</Button>
        <Button hierarchy="primary" data-focus-visible>focus</Button>
        <Button hierarchy="primary" data-active>press</Button>
      </HStack>
    </VStack>
  ),
};
