import React from 'react';
import { clsx } from 'clsx';
import type { CalendarDate } from '../../utils/calendar/calendar_date.js';
import { isSameDay, isDayWithinRange } from '../../utils/calendar/date_helpers.js';
import styles from './date_picker_date.module.css';

export interface DatePickerDateProps {
  date: CalendarDate;
  visibleMonth: number;
  selectedDate: Date | null;
  focusedDate: Date;
  min: Date | null;
  max: Date | null;
  disabledDates: Date[];
  /** The current day in the active time zone (a day proxy). */
  today: Date;
  onSelect: (date: Date) => void;
  /** Called when this cell receives focus from arrow-key or click navigation. */
  onFocus?: (date: Date) => void;
}

/**
 * One day cell. Real focus lives on the underlying button (so screen readers
 * announce navigation correctly), but only the cell whose day matches
 * `focusedDate` is in the tab order at a given time — that gives the grid a
 * single tab stop, matching the WAI-ARIA grid pattern.
 */
export const DatePickerDate = React.forwardRef<HTMLButtonElement, DatePickerDateProps>(
  function DatePickerDate(
    { date: cd, visibleMonth, selectedDate, focusedDate, min, max, disabledDates, today, onSelect, onFocus },
    ref,
  ) {
    // Anchored at noon so the cell's calendar day is stable regardless of the
    // runtime zone's DST transitions (which never exceed 12h).
    const dateObj = React.useMemo(
      () => new Date(cd.year, cd.month, cd.date, 12),
      [cd.year, cd.month, cd.date],
    );

    const isWithinMonth = cd.month === visibleMonth;
    const isSelected = isSameDay(selectedDate, dateObj);
    const isToday = isSameDay(today, dateObj);
    const isFocused = isSameDay(focusedDate, dateObj);
    const isWithinRange = isDayWithinRange(dateObj, min, max);
    const isExplicitlyDisabled = disabledDates.some((d) => isSameDay(d, dateObj));
    const isDisabled = isExplicitlyDisabled || !isWithinRange;

    return (
      <button
        ref={ref}
        type="button"
        role="gridcell"
        tabIndex={isFocused ? 0 : -1}
        aria-selected={isSelected || undefined}
        aria-disabled={isDisabled || undefined}
        aria-current={isToday ? 'date' : undefined}
        disabled={isDisabled}
        data-date={`${cd.year}-${cd.month + 1}-${cd.date}`}
        data-is-within-month={String(isWithinMonth)}
        data-is-selected={String(isSelected)}
        data-is-disabled={String(isDisabled)}
        data-is-within-range={String(isWithinRange)}
        data-is-today={String(isToday)}
        className={clsx(styles['date-picker-date'], 'j13b-date-picker-date')}
        onClick={() => !isDisabled && onSelect(dateObj)}
        onFocus={() => onFocus?.(dateObj)}
      >
        <span className={clsx(styles['date-picker-date-label'], 'j13b-date-picker-date-label')}>
          {cd.date}
        </span>
        {isToday && (
          <span
            aria-hidden="true"
            className={clsx(styles['date-picker-today'], 'j13b-date-picker-today')}
            data-is-selected={String(isSelected)}
          />
        )}
      </button>
    );
  },
);
