import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VStack } from '../../stacks/v_stack.js';
import { HStack } from '../../stacks/h_stack.js';
import { BodyText } from '../../typography/body_text.js';
import { Caption } from '../../typography/caption.js';
import { ControlRow } from '../control_row/control_row.js';
import { Input } from '../input/input.js';
import { DatePickerInput } from '../date_picker/date_picker_input.js';

const meta: Meta = {
  title: 'Inputs/DatePickerInput',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => {
    const [value, setValue] = React.useState<Date | null>(null);
    return (
      <VStack gap="8px" maxWidth="280px">
        <DatePickerInput value={value} onChange={setValue} />
        <Caption>{value ? value.toString() : 'Empty'}</Caption>
      </VStack>
    );
  },
};

export const WithDefaultValue: Story = {
  render: () => (
    <VStack maxWidth="280px">
      <DatePickerInput defaultValue={new Date()} />
    </VStack>
  ),
};

export const WithTime: Story = {
  render: () => {
    const [value, setValue] = React.useState<Date | null>(new Date());
    return (
      <VStack gap="8px" maxWidth="320px">
        <DatePickerInput showTime value={value} onChange={setValue} />
        <Caption>{value ? value.toString() : 'Empty'}</Caption>
      </VStack>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <VStack gap="12px" maxWidth="320px">
      <DatePickerInput size="sm" defaultValue={new Date()} />
      <DatePickerInput size="md" defaultValue={new Date()} />
      <DatePickerInput size="lg" defaultValue={new Date()} />
    </VStack>
  ),
};

export const MinMax: Story = {
  render: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const min = new Date(today);
    min.setDate(today.getDate() - 5);
    const max = new Date(today);
    max.setDate(today.getDate() + 10);
    return (
      <VStack gap="8px" maxWidth="320px">
        <DatePickerInput defaultValue={today} min={min} max={max} />
        <BodyText>Range: {min.toDateString()} → {max.toDateString()}</BodyText>
      </VStack>
    );
  },
};

export const Invalid: Story = {
  render: () => (
    <VStack maxWidth="280px">
      <DatePickerInput invalid placeholder="Required" />
    </VStack>
  ),
};

export const Disabled: Story = {
  render: () => (
    <VStack maxWidth="280px">
      <DatePickerInput disabled defaultValue={new Date()} />
    </VStack>
  ),
};

export const InsideControlRow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Popover and nested popovers (the month Select, the year selector) are portaled out, so they escape ControlRow\'s overflow and stay positioned correctly.',
      },
    },
  },
  render: () => (
    <ControlRow maxWidth="480px">
      <DatePickerInput width="auto" placeholder="Pick a date" />
      <Input width="fill" placeholder="Notes" />
    </ControlRow>
  ),
};

export const Locale: Story = {
  render: () => (
    <HStack gap="16px" allowFlow>
      <DatePickerInput locale="fr-FR" defaultValue={new Date()} width="220px" />
      <DatePickerInput locale="ja-JP" defaultValue={new Date()} width="220px" />
    </HStack>
  ),
};
