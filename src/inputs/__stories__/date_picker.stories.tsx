import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '../../themes/theme.js';
import { midnightStyleSheet } from '../../themes/themes/midnight/index.js';
import { VStack } from '../../stacks/v_stack.js';
import { HStack } from '../../stacks/h_stack.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { DatePicker } from '../date_picker/date_picker.js';

const meta: Meta = {
  title: 'Inputs/DatePicker',
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

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export const Basic: Story = {
  render: () => {
    const [value, setValue] = React.useState<Date | null>(null);
    return (
      <VStack gap="12px" maxWidth="380px">
        <DatePicker value={value} onChange={setValue} />
        <BodyText>{value ? value.toString() : 'No date selected'}</BodyText>
      </VStack>
    );
  },
};

export const WithTime: Story = {
  render: () => {
    const [value, setValue] = React.useState<Date | null>(new Date());
    return (
      <VStack gap="12px" maxWidth="560px">
        <DatePicker showTime value={value} onChange={setValue} timeIntervalInMinutes={30} />
        <BodyText>{value ? value.toString() : 'No date selected'}</BodyText>
      </VStack>
    );
  },
};

export const MinMax: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Min/max bounds disable out-of-range cells and prevent month navigation past them.',
      },
    },
  },
  render: () => {
    const today = startOfDay(new Date());
    const min = new Date(today);
    min.setDate(today.getDate() - 7);
    const max = new Date(today);
    max.setDate(today.getDate() + 14);
    const [value, setValue] = React.useState<Date | null>(today);
    return (
      <VStack gap="12px">
        <DatePicker value={value} onChange={setValue} min={min} max={max} />
        <BodyText>Range: {min.toDateString()} → {max.toDateString()}</BodyText>
      </VStack>
    );
  },
};

export const DisabledDates: Story = {
  render: () => {
    const today = startOfDay(new Date());
    const disabled = [1, 3, 5].map((delta) => {
      const d = new Date(today);
      d.setDate(today.getDate() + delta);
      return d;
    });
    const [value, setValue] = React.useState<Date | null>(today);
    return (
      <DatePicker value={value} onChange={setValue} disabledDates={disabled} />
    );
  },
};

export const Locale: Story = {
  render: () => (
    <HStack gap="24px" allowFlow>
      <VStack gap="6px" width="auto">
        <BodyText>fr-FR</BodyText>
        <DatePicker locale="fr-FR" />
      </VStack>
      <VStack gap="6px" width="auto">
        <BodyText>ja-JP</BodyText>
        <DatePicker locale="ja-JP" />
      </VStack>
    </HStack>
  ),
};

export const WithActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'renderActions exposes selectDate / goToToday / clear so consumers can build their own footer controls.',
      },
    },
  },
  render: () => {
    const [value, setValue] = React.useState<Date | null>(null);
    return (
      <DatePicker
        value={value}
        onChange={setValue}
        renderActions={(api) => (
          <>
            <Button hierarchy="tertiary" onClick={api.goToToday}>Today</Button>
            <Button hierarchy="tertiary" onClick={api.clear}>Clear</Button>
          </>
        )}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => <DatePicker disabled value={new Date()} />,
};
