import React from 'react';
import { clsx } from 'clsx';
import { VStack } from '../../stacks/v_stack.js';
import styles from './date_picker_time_selector.module.css';

export interface DatePickerTimeSelectorProps {
  /** Whether a day is currently selected; when false the whole list is disabled. */
  daySelected: boolean;
  /** Epoch ms of the currently selected instant, for highlighting. */
  selectedInstant: number | null;
  /** Step between slots, in minutes. */
  intervalInMinutes: number;
  /** Restricts which times-of-day are visible (in ms since midnight). */
  minVisibleTimeInMilliseconds?: number;
  maxVisibleTimeInMilliseconds?: number;
  /**
   * Every absolute instant a wall-clock time maps to on the selected day, each
   * with a hover explanation. Returns:
   *   - one entry on a normal day (tooltip empty),
   *   - zero entries for a spring-forward gap (the time never occurs),
   *   - two entries for a fall-back repeated hour, so both occurrences are
   *     independently selectable; the second is marked distinctly.
   */
  resolveSlot?: (
    hours: number,
    minutes: number,
    seconds: number,
  ) => Array<{ instant: Date; tooltip: string }>;
  /** Absolute selectable range, in epoch ms. */
  minTime?: number;
  maxTime?: number;
  disabled?: boolean;
  height?: string;
  onSelect: (instant: Date) => void;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MINUTES_PER_DAY = 24 * 60;

interface Slot {
  key: string;
  label: string;
  /** Null only for gap slots (a wall time that doesn't exist that day). */
  instant: Date | null;
  /** Hover explanation for gap / repeated-hour slots; empty otherwise. */
  tooltip: string;
  isOutOfRange: boolean;
  /** True for a wall time skipped by a spring-forward DST transition. */
  isNonexistent: boolean;
  /** True for the later of a fall-back repeated hour's two occurrences. */
  isSecondOccurrence: boolean;
  isSelected: boolean;
}

export function DatePickerTimeSelector({
  daySelected,
  selectedInstant,
  intervalInMinutes,
  minVisibleTimeInMilliseconds = 0,
  maxVisibleTimeInMilliseconds = MS_PER_DAY,
  resolveSlot,
  minTime = -Infinity,
  maxTime = Infinity,
  disabled = false,
  height,
  onSelect,
}: DatePickerTimeSelectorProps) {
  const slots = React.useMemo<Slot[]>(() => {
    const stepMin = intervalInMinutes;
    const totalSteps = Math.floor(MINUTES_PER_DAY / stepMin);
    const minVisibleMin = minVisibleTimeInMilliseconds / 60000;
    const maxVisibleMin = maxVisibleTimeInMilliseconds / 60000;
    const out: Slot[] = [];

    const makeSlot = (
      entry: { instant: Date; tooltip: string },
      base: string,
      minutes: number,
      occ: number,
      isSecondOccurrence: boolean,
    ): Slot => {
      const t = entry.instant.getTime();
      return {
        key: `${minutes}-${occ}`,
        label: base,
        instant: entry.instant,
        tooltip: entry.tooltip,
        isOutOfRange: t < minTime || t > maxTime,
        isNonexistent: false,
        isSecondOccurrence,
        isSelected: selectedInstant != null && t === selectedInstant,
      };
    };

    // Second occurrences of a fall-back repeated hour are stashed here and
    // flushed when the overlap ends, so they appear as a contiguous block in
    // the chronological position they actually occur — i.e. after the first
    // pass of that hour, not interleaved row-by-row.
    let pending: Slot[] = [];

    for (let i = 0; i < totalSteps; i++) {
      const minutesFromMidnight = i * stepMin;
      if (minutesFromMidnight < minVisibleMin || minutesFromMidnight > maxVisibleMin) {
        continue;
      }
      // Wall-clock time computed arithmetically rather than by adding ms to a
      // midnight Date — the latter skips/repeats an hour on DST days.
      const hours = Math.floor(minutesFromMidnight / 60);
      const minutes = minutesFromMidnight % 60;
      const seconds = 0;

      let h12 = hours % 12;
      if (h12 === 0) h12 = 12;
      const meridiem = hours >= 12 ? 'PM' : 'AM';
      const base = `${String(h12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${meridiem}`;

      const resolved = resolveSlot?.(hours, minutes, seconds) ?? [];

      // Leaving an overlap: the stashed second occurrences happen, in real
      // time, immediately before this slot — emit them now.
      if (resolved.length < 2 && pending.length) {
        out.push(...pending);
        pending = [];
      }

      if (resolved.length === 0) {
        // No day selected → still render a full day of (disabled) slots. A day
        // selected but no instant → a spring-forward gap: disabled + struck.
        out.push({
          key: `${minutesFromMidnight}`,
          label: base,
          instant: null,
          tooltip: daySelected
            ? 'This time does not occur today (daylight saving begins).'
            : '',
          isOutOfRange: false,
          isNonexistent: daySelected,
          isSecondOccurrence: false,
          isSelected: false,
        });
        continue;
      }

      // First (or only) occurrence stays in line; the second is deferred.
      out.push(makeSlot(resolved[0]!, base, minutesFromMidnight, 0, false));
      if (resolved.length === 2) {
        pending.push(makeSlot(resolved[1]!, base, minutesFromMidnight, 1, true));
      }
    }
    // Overlap ran to the end of the visible range.
    if (pending.length) out.push(...pending);

    return out;
  }, [
    intervalInMinutes,
    minVisibleTimeInMilliseconds,
    maxVisibleTimeInMilliseconds,
    resolveSlot,
    minTime,
    maxTime,
    selectedInstant,
    daySelected,
  ]);

  // Roving tabindex: only one slot is in the tab order at a time. Default to
  // the selected slot, or the first slot.
  const initialFocus = React.useMemo(() => {
    const sel = slots.findIndex((s) => s.isSelected);
    return sel >= 0 ? sel : 0;
  }, [slots]);
  const [focusedIndex, setFocusedIndex] = React.useState(initialFocus);

  // When the slot list rebuilds (different day, interval change), keep the
  // cursor pointing at the selected slot if there is one.
  React.useEffect(() => {
    setFocusedIndex(initialFocus);
  }, [initialFocus]);

  const listRef = React.useRef<HTMLDivElement | null>(null);
  const moveFocusFlag = React.useRef(false);

  // Real focus moves only when keyboard nav explicitly requests it; that way
  // selecting a slot via mouse doesn't yank focus away from the calendar.
  React.useLayoutEffect(() => {
    if (!moveFocusFlag.current) return;
    moveFocusFlag.current = false;
    const list = listRef.current;
    if (!list) return;
    const target = list.children[focusedIndex] as HTMLElement | undefined;
    target?.focus({ preventScroll: true });
  });

  // Without this nudge a 15-minute step list opens with the selected slot
  // off-screen; scrolls minimally only when the target is out of view.
  React.useEffect(() => {
    if (initialFocus < 0) return;
    const list = listRef.current;
    if (!list) return;
    const target = list.children[initialFocus] as HTMLElement | undefined;
    target?.scrollIntoView({ block: 'nearest' });
  }, [initialFocus]);

  function moveTo(next: number) {
    if (slots.length === 0) return;
    const wrapped = ((next % slots.length) + slots.length) % slots.length;
    setFocusedIndex(wrapped);
    moveFocusFlag.current = true;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); moveTo(focusedIndex + 1); break;
      case 'ArrowUp':   e.preventDefault(); moveTo(focusedIndex - 1); break;
      case 'PageDown':  e.preventDefault(); moveTo(focusedIndex + 4); break;
      case 'PageUp':    e.preventDefault(); moveTo(focusedIndex - 4); break;
      case 'Home':      e.preventDefault(); moveTo(0); break;
      case 'End':       e.preventDefault(); moveTo(slots.length - 1); break;
    }
  }

  return (
    <VStack
      width="auto"
      height={height ?? 'default'}
      data-is-disabled={disabled || !daySelected ? 'true' : 'false'}
      className={clsx(
        styles['date-picker-time-selector'],
        'j13b-date-picker-time-selector',
      )}
    >
      <VStack
        ref={listRef as React.Ref<HTMLElement>}
        width="auto"
        height="fill"
        overflowY="auto"
        gap="2px"
        padding="4px"
        role="listbox"
        aria-label="Time"
        onKeyDown={handleKeyDown}
        className={clsx(
          styles['date-picker-time-list'],
          'j13b-date-picker-time-list',
        )}
      >
        {slots.map((slot, i) => (
          <button
            key={slot.key}
            type="button"
            role="option"
            tabIndex={i === focusedIndex ? 0 : -1}
            aria-selected={slot.isSelected || undefined}
            aria-label={slot.tooltip ? `${slot.label} — ${slot.tooltip}` : undefined}
            title={slot.tooltip || undefined}
            disabled={!daySelected || disabled || slot.isOutOfRange || slot.isNonexistent}
            onClick={() => slot.instant && onSelect(slot.instant)}
            data-is-selected={String(slot.isSelected)}
            data-is-nonexistent={String(slot.isNonexistent)}
            data-is-second-occurrence={String(slot.isSecondOccurrence)}
            className={clsx(
              styles['date-picker-time-option'],
              'j13b-date-picker-time-option',
            )}
          >
            {slot.label}
          </button>
        ))}
      </VStack>
    </VStack>
  );
}
