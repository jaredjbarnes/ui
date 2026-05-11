import React from 'react';
import { clsx } from 'clsx';
import { VStack } from '../../stacks/v_stack.js';
import styles from './date_picker_time_selector.module.css';

export interface DatePickerTimeSelectorProps {
  /** Anchor for time slots — slots inherit this date's day. Null disables selection. */
  origin: Date | null;
  /** Step between slots, in minutes. */
  intervalInMinutes: number;
  min: Date | null;
  max: Date | null;
  /** Restricts which times-of-day are visible (in ms since midnight). */
  minVisibleTimeInMilliseconds?: number;
  maxVisibleTimeInMilliseconds?: number;
  disabled?: boolean;
  height?: string;
  onSelect: (hours: number, minutes: number, seconds: number) => void;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface Slot {
  index: number;
  date: Date;
  label: string;
  isOutOfRange: boolean;
  isSelected: boolean;
}

export function DatePickerTimeSelector({
  origin,
  intervalInMinutes,
  min,
  max,
  minVisibleTimeInMilliseconds = 0,
  maxVisibleTimeInMilliseconds = MS_PER_DAY,
  disabled = false,
  height,
  onSelect,
}: DatePickerTimeSelectorProps) {
  const stepMs = intervalInMinutes * 60 * 1000;
  const totalSteps = Math.floor(MS_PER_DAY / stepMs);
  const minTime = min?.getTime() ?? -Infinity;
  const maxTime = max?.getTime() ?? Infinity;

  const slots = React.useMemo<Slot[]>(() => {
    const base = new Date(origin ?? new Date());
    base.setHours(0, 0, 0, 0);
    const out: Slot[] = [];

    for (let i = 0; i < totalSteps; i++) {
      const offsetFromMidnight = i * stepMs;
      if (
        offsetFromMidnight < minVisibleTimeInMilliseconds ||
        offsetFromMidnight > maxVisibleTimeInMilliseconds
      ) {
        continue;
      }
      const slotTime = base.getTime() + offsetFromMidnight;
      const slot = new Date(slotTime);
      let h12 = slot.getHours() % 12;
      if (h12 === 0) h12 = 12;
      const meridiem = slot.getHours() >= 12 ? 'PM' : 'AM';
      const label = `${String(h12).padStart(2, '0')}:${String(slot.getMinutes()).padStart(2, '0')} ${meridiem}`;
      const isSelected =
        origin != null &&
        slot.getHours() === origin.getHours() &&
        slot.getMinutes() === origin.getMinutes() &&
        slot.getSeconds() === origin.getSeconds();
      out.push({
        index: i,
        date: slot,
        label,
        isOutOfRange: slotTime < minTime || slotTime > maxTime,
        isSelected,
      });
    }
    return out;
  }, [
    origin?.getTime(),
    stepMs,
    totalSteps,
    minTime,
    maxTime,
    minVisibleTimeInMilliseconds,
    maxVisibleTimeInMilliseconds,
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
      data-is-disabled={disabled || origin == null ? 'true' : 'false'}
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
            key={slot.index}
            type="button"
            role="option"
            tabIndex={i === focusedIndex ? 0 : -1}
            aria-selected={slot.isSelected || undefined}
            disabled={origin == null || disabled || slot.isOutOfRange}
            onClick={() => onSelect(slot.date.getHours(), slot.date.getMinutes(), slot.date.getSeconds())}
            data-is-selected={String(slot.isSelected)}
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
