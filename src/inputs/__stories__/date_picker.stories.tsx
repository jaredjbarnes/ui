import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VStack } from '../../stacks/v_stack.js';
import { HStack } from '../../stacks/h_stack.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { DatePicker } from '../date_picker/date_picker.js';
import { Select } from '../select/select.js';
import { Option } from '../select/option.js';
import { getZonedParts, partsToInstant } from '../../utils/calendar/time_zone.js';

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

// Every IANA zone the runtime knows about (~400). Falls back to a short list
// on engines without Intl.supportedValuesOf.
const IANA_ZONES: string[] =
  typeof (Intl as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf ===
  'function'
    ? (Intl as { supportedValuesOf: (key: string) => string[] }).supportedValuesOf('timeZone')
    : ['UTC', 'America/Denver', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

// Both panels start on the same absolute instant, so out of the box they show
// the same epoch rendered as different local days/times.
const SHARED_INSTANT = new Date('2026-06-09T18:00:00Z');

/** Minutes `zone`'s wall clock is ahead of UTC at `date`. Rounded to whole
 *  minutes: getZonedParts drops sub-second precision, so the raw difference
 *  carries the input's milliseconds — rounding removes that (all real zone
 *  offsets are whole minutes) and keeps the equality checks below stable. */
function zoneOffsetMinutes(date: Date, zone: string): number {
  const p = getZonedParts(date, zone);
  return Math.round(
    (Date.UTC(p.year, p.month, p.day, p.hour, p.minute, p.second) - date.getTime()) / 60000,
  );
}

interface ZoneTransition {
  instant: Date;
  /** 'forward' = clocks +1h (spring forward); 'back' = clocks −1h (fall back). */
  type: 'forward' | 'back';
}

/** DST transitions for `zone` in `year`, found by scanning daily then bisecting
 *  to the minute. Empty for zones that don't observe DST. */
function findZoneTransitions(zone: string, year: number): ZoneTransition[] {
  const out: ZoneTransition[] = [];
  const DAY = 86400000;
  const end = Date.UTC(year + 1, 0, 1);
  let prev = zoneOffsetMinutes(new Date(Date.UTC(year, 0, 1)), zone);

  for (let t = Date.UTC(year, 0, 1) + DAY; t <= end; t += DAY) {
    const offset = zoneOffsetMinutes(new Date(t), zone);
    if (offset !== prev) {
      let lo = t - DAY;
      let hi = t;
      while (hi - lo > 60000) {
        const mid = lo + Math.floor((hi - lo) / 2);
        if (zoneOffsetMinutes(new Date(mid), zone) === prev) lo = mid;
        else hi = mid;
      }
      out.push({ instant: new Date(hi), type: offset > prev ? 'forward' : 'back' });
      prev = offset;
    }
  }
  return out;
}

function TimeZonePanel({ defaultZone }: { defaultZone: string }) {
  const [zone, setZone] = React.useState(defaultZone);
  const [value, setValue] = React.useState<Date | null>(SHARED_INSTANT);

  const transitions = React.useMemo(() => findZoneTransitions(zone, 2026), [zone]);

  const formatted = React.useMemo(() => {
    if (!value) return '—';
    return new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(value);
  }, [value, zone]);

  return (
    <VStack gap="10px" width="auto">
      <Select
        searchable
        value={zone}
        onChange={setZone}
        width="280px"
        searchPlaceholder="Search time zones…"
      >
        {IANA_ZONES.map((z) => (
          <Option key={z} value={z} label={z} />
        ))}
      </Select>

      {/* Jump straight to a DST transition so the time list shows the gap /
          repeated hour. Lands an hour before the change, on the same day. */}
      {transitions.length > 0 ? (
        <HStack gap="6px" allowFlow width="auto">
          {transitions.map((tr, i) => (
            <Button
              key={i}
              size="sm"
              hierarchy="tertiary"
              onClick={() => {
                // Select 1:00 AM on the transition day so the slot is
                // highlighted and the list scrolls to it — the gap / repeated
                // hour then sits just below.
                const p = getZonedParts(tr.instant, zone);
                setValue(
                  partsToInstant(
                    { year: p.year, month: p.month, day: p.day, hour: 1, minute: 0, second: 0 },
                    zone,
                  ),
                );
              }}
            >
              {(tr.type === 'forward' ? 'Spring forward (+1h) · ' : 'Fall back (−1h) · ') +
                new Intl.DateTimeFormat('en-US', {
                  timeZone: zone,
                  month: 'short',
                  day: 'numeric',
                }).format(tr.instant)}
            </Button>
          ))}
        </HStack>
      ) : (
        <BodyText size="sm">This zone does not observe DST.</BodyText>
      )}

      <HStack gap="16px" width="auto" vAlign="start">
        <DatePicker
          showTime
          timeZone={zone}
          timeIntervalInMinutes={30}
          value={value}
          onChange={setValue}
        />
        <VStack gap="6px" width="auto">
          <BodyText style={{ fontWeight: 600 }}>{formatted}</BodyText>
          <BodyText style={{ fontFamily: 'monospace' }}>
            epoch (ms): {value ? value.getTime() : '—'}
          </BodyText>
          <BodyText style={{ fontFamily: 'monospace' }}>
            epoch (s):&nbsp; {value ? Math.floor(value.getTime() / 1000) : '—'}
          </BodyText>
          <BodyText style={{ fontFamily: 'monospace' }}>
            ISO (UTC): {value ? value.toISOString() : '—'}
          </BodyText>
        </VStack>
      </HStack>
    </VStack>
  );
}

export const TimeZoneComparison: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Two independent pickers, each with a searchable dropdown of every ' +
          'IANA time zone. `value` is an absolute Date, so the epoch to the ' +
          'right is the same moment regardless of zone. Both start on the same ' +
          'instant — note the matching epochs but different local days/times. ' +
          'Change a zone or a date/time and watch the epoch update; pick ' +
          'different wall-clock days in two zones that land on the same epoch ' +
          'to prove they are the same instant. Each panel has time enabled and ' +
          'buttons that jump to that zone’s DST transitions, so you can see ' +
          'the spring-forward gap and fall-back repeated hour in the time list. ' +
          '(DST dates differ by zone — Denver and Sydney are in opposite ' +
          'hemispheres, so their transitions fall in different months.)',
      },
    },
  },
  render: () => (
    <VStack gap="28px" padding="16px">
      <BodyText>
        Pick a time zone for each calendar. The epoch (to the right) is the
        absolute instant — identical epochs mean the same moment, even when the
        local day and time differ.
      </BodyText>
      <HStack gap="48px" allowFlow vAlign="start">
        <TimeZonePanel defaultZone="America/Denver" />
        <TimeZonePanel defaultZone="Australia/Sydney" />
      </HStack>
    </VStack>
  ),
};
