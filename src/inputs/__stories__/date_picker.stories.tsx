import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VStack } from '../../stacks/v_stack.js';
import { HStack } from '../../stacks/h_stack.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { DatePicker } from '../date_picker/date_picker.js';

const meta: Meta = {
  title: 'Inputs/DatePicker',
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

// Cedar City, Utah runs on Mountain Time, which observes daylight saving.
const CEDAR_CITY = 'America/Denver';
const HOUR_MS = 60 * 60 * 1000;

// Renders both the absolute instant and how it reads in Cedar City — the
// MST/MDT suffix flips across the transition, which is the whole point.
const readout = new Intl.DateTimeFormat('en-US', {
  timeZone: CEDAR_CITY,
  dateStyle: 'medium',
  timeStyle: 'long',
});

function DstColumn({
  title,
  note,
  initial,
}: {
  title: string;
  note: string;
  initial: Date;
}) {
  const [value, setValue] = React.useState<Date | null>(initial);
  return (
    <VStack gap="8px" width="auto">
      <BodyText style={{ fontWeight: 600 }}>{title}</BodyText>
      <BodyText>{note}</BodyText>
      <DatePicker
        showTime
        timeZone={CEDAR_CITY}
        timeIntervalInMinutes={30}
        // Zoom the slot list to midnight–6 AM so the 2 AM transition is in view.
        minVisibleTimeInMilliseconds={0}
        maxVisibleTimeInMilliseconds={6 * HOUR_MS}
        value={value}
        onChange={setValue}
      />
      <BodyText>In Cedar City: {value ? readout.format(value) : '—'}</BodyText>
      <BodyText>Absolute (UTC): {value ? value.toISOString() : '—'}</BodyText>
    </VStack>
  );
}

export const DaylightSavingTime: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Cedar City, Utah (America/Denver) across both 2026 DST transitions. ' +
          'Spring forward (Mar 8): 2:00 and 2:30 AM never happen, so those slots ' +
          'are disabled (struck through). Fall back (Nov 1): the 1 AM hour ' +
          'runs twice, so after the first 1:00–1:59 pass the hour repeats as a ' +
          'tinted block in the order it actually happens (hover for an ' +
          'explanation); each occurrence is independently selectable. In both ' +
          'cases `value` stays an absolute Date; watch the readout offset shift.',
      },
    },
  },
  render: () => (
    <HStack gap="32px" allowFlow>
      <DstColumn
        title="Spring forward — Mar 8, 2026"
        note="2:00 AM jumps to 3:00 AM. The 2 AM slots are disabled."
        // 08:30Z = 1:30 AM MST on Mar 8 (just before the gap).
        initial={new Date('2026-03-08T08:30:00Z')}
      />
      <DstColumn
        title="Fall back — Nov 1, 2026"
        note="2 AM falls back to 1 AM. The 1 AM hour repeats after its first pass (tinted). Hover it."
        // 07:30Z = 1:30 AM MDT on Nov 1 (first occurrence of 1:30).
        initial={new Date('2026-11-01T07:30:00Z')}
      />
    </HStack>
  ),
};
