import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VStack } from '../../../stacks/v_stack.js';
import { HStack } from '../../../stacks/h_stack.js';
import { Button } from '../button/button.js';
import { ButtonGroup } from '../button_group/button_group.js';
import { Toggle } from '../../toggle/toggle.js';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Actions/ButtonGroup',
  component: ButtonGroup,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Basic: Story = {
  render: () => (
    <ButtonGroup>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
  ),
};

export const Hierarchies: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The group enforces its hierarchy on every child, so all buttons read as one unified control.',
      },
    },
  },
  render: () => (
    <VStack gap="12px">
      <ButtonGroup hierarchy="tertiary">
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
      </ButtonGroup>
      <ButtonGroup hierarchy="secondary">
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
      </ButtonGroup>
      <ButtonGroup hierarchy="primary">
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
      </ButtonGroup>
    </VStack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <VStack gap="12px" hAlign="start">
      <ButtonGroup size="sm">
        <Button>Small</Button>
        <Button>Group</Button>
      </ButtonGroup>
      <ButtonGroup size="md">
        <Button>Medium</Button>
        <Button>Group</Button>
      </ButtonGroup>
      <ButtonGroup size="lg">
        <Button>Large</Button>
        <Button>Group</Button>
      </ButtonGroup>
    </VStack>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Active</Button>
      <Button disabled>Disabled</Button>
      <Button>Active</Button>
    </ButtonGroup>
  ),
};

export const Utility: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Icon-only buttons stay square via the utility prop.',
      },
    },
  },
  render: () => (
    <VStack gap="12px">
      <ButtonGroup hierarchy="tertiary">
        <Button utility aria-label="Bold">B</Button>
        <Button utility aria-label="Italic">I</Button>
        <Button utility aria-label="Underline">U</Button>
      </ButtonGroup>
      <ButtonGroup hierarchy="secondary">
        <Button utility aria-label="Bold">B</Button>
        <Button utility aria-label="Italic">I</Button>
        <Button utility aria-label="Underline">U</Button>
      </ButtonGroup>
      <ButtonGroup hierarchy="primary">
        <Button utility aria-label="Bold">B</Button>
        <Button utility aria-label="Italic">I</Button>
        <Button utility aria-label="Underline">U</Button>
      </ButtonGroup>
    </VStack>
  ),
};

export const Mixed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Mixing utility (icon-only) and text buttons inside a single group still aligns vertically because both use the same min-height.',
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <Button utility aria-label="Search">⌕</Button>
      <Button>Filter</Button>
      <Button utility aria-label="More">⋯</Button>
    </ButtonGroup>
  ),
};

export const TwoButtons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A common shape for a date picker header — month + year as one connected control.',
      },
    },
  },
  render: () => (
    <HStack>
      <ButtonGroup hierarchy="tertiary">
        <Button>March</Button>
        <Button>2026</Button>
      </ButtonGroup>
    </HStack>
  ),
};

export const SegmentedToggles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Toggle children form a segmented control — each toggle owns its own selected state, and ButtonGroup just visually unifies them. The group-injected hierarchy is ignored by Toggle (it controls its own off→secondary / on→primary mapping), so each toggle independently flips between outlined and filled.',
      },
    },
  },
  render: () => {
    const [view, setView] = React.useState<'day' | 'week' | 'month'>('week');
    return (
      <ButtonGroup>
        <Toggle selected={view === 'day'} onSelectedChange={(s) => s && setView('day')}>
          Day
        </Toggle>
        <Toggle selected={view === 'week'} onSelectedChange={(s) => s && setView('week')}>
          Week
        </Toggle>
        <Toggle selected={view === 'month'} onSelectedChange={(s) => s && setView('month')}>
          Month
        </Toggle>
      </ButtonGroup>
    );
  },
};

export const MultiSelectToggles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Independent toggles in a group — a B / I / U toolbar where multiple can be on at once.',
      },
    },
  },
  render: () => (
    <ButtonGroup hierarchy="secondary" size="sm">
      <Toggle aria-label="Bold">B</Toggle>
      <Toggle aria-label="Italic" defaultSelected>I</Toggle>
      <Toggle aria-label="Underline">U</Toggle>
    </ButtonGroup>
  ),
};
