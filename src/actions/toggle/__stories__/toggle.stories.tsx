import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HStack } from '../../../stacks/h_stack.js';
import { VStack } from '../../../stacks/v_stack.js';
import { BodyText } from '../../../typography/body_text.js';
import { Toggle } from '../toggle.js';

const meta: Meta<typeof Toggle> = {
  title: 'Actions/Toggle',
  component: Toggle,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Basic: Story = {
  render: () => {
    const [on, setOn] = React.useState(false);
    return (
      <VStack gap="8px" hAlign="start">
        <Toggle selected={on} onSelectedChange={setOn}>
          {on ? 'On' : 'Off'}
        </Toggle>
        <BodyText>Currently {on ? 'on' : 'off'}</BodyText>
      </VStack>
    );
  },
};

export const Uncontrolled: Story = {
  render: () => <Toggle defaultSelected>Pinned</Toggle>,
};

export const Sizes: Story = {
  render: () => (
    <HStack gap="8px" vAlign="center">
      <Toggle size="sm" defaultSelected>Small</Toggle>
      <Toggle size="md" defaultSelected>Medium</Toggle>
      <Toggle size="lg" defaultSelected>Large</Toggle>
    </HStack>
  ),
};

export const Severities: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Severity flows through to the underlying Button — a destructive toggle (e.g. "delete mode") can use `dangerous`.',
      },
    },
  },
  render: () => (
    <HStack gap="8px">
      <Toggle defaultSelected severity="neutral">Neutral</Toggle>
      <Toggle defaultSelected severity="suggested">Suggested</Toggle>
      <Toggle defaultSelected severity="encouraged">Encouraged</Toggle>
      <Toggle defaultSelected severity="cautious">Cautious</Toggle>
      <Toggle defaultSelected severity="dangerous">Dangerous</Toggle>
    </HStack>
  ),
};

export const Disabled: Story = {
  render: () => (
    <HStack gap="8px">
      <Toggle disabled>Off / Disabled</Toggle>
      <Toggle disabled defaultSelected>On / Disabled</Toggle>
    </HStack>
  ),
};

export const Utility: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Icon-only toggles using `utility`. Useful for B / I / U-style toolbars.',
      },
    },
  },
  render: () => {
    const [bold, setBold] = React.useState(false);
    const [italic, setItalic] = React.useState(true);
    const [underline, setUnderline] = React.useState(false);
    return (
      <HStack gap="4px">
        <Toggle utility selected={bold} onSelectedChange={setBold} aria-label="Bold">B</Toggle>
        <Toggle utility selected={italic} onSelectedChange={setItalic} aria-label="Italic">I</Toggle>
        <Toggle utility selected={underline} onSelectedChange={setUnderline} aria-label="Underline">U</Toggle>
      </HStack>
    );
  },
};

export const SegmentedView: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Multiple toggles where exactly one is on — a segmented control. Selection logic lives at the parent.',
      },
    },
  },
  render: () => {
    const [view, setView] = React.useState<'day' | 'week' | 'month'>('week');
    return (
      <HStack gap="4px">
        <Toggle selected={view === 'day'} onSelectedChange={(s) => s && setView('day')}>Day</Toggle>
        <Toggle selected={view === 'week'} onSelectedChange={(s) => s && setView('week')}>Week</Toggle>
        <Toggle selected={view === 'month'} onSelectedChange={(s) => s && setView('month')}>Month</Toggle>
      </HStack>
    );
  },
};
