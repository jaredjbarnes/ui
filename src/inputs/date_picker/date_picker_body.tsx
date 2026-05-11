import React from 'react';
import { clsx } from 'clsx';
import { HStack } from '../../stacks/h_stack.js';
import { VStack } from '../../stacks/v_stack.js';
import type { CalendarDate } from '../../utils/calendar/calendar_date.js';
import { DatePickerDate } from './date_picker_date.js';
import { DatePickerDay } from './date_picker_day.js';
import styles from './date_picker_body.module.css';

export interface DatePickerBodyProps {
  visibleYear: number;
  visibleMonth: number;
  grid: CalendarDate[];
  selectedDate: Date | null;
  focusedDate: Date;
  min: Date | null;
  max: Date | null;
  disabledDates: Date[];
  locale?: string;
  firstDayOfWeek: number;
  onSelect: (date: Date) => void;
  onFocus: (date: Date) => void;
  /** Receives the button for `focusedDate` so the parent can call .focus() on it. */
  onFocusedRef: (el: HTMLButtonElement | null) => void;
}

export function DatePickerBody({
  visibleMonth,
  grid,
  selectedDate,
  focusedDate,
  min,
  max,
  disabledDates,
  locale,
  firstDayOfWeek,
  onSelect,
  onFocus,
  onFocusedRef,
}: DatePickerBodyProps) {
  const rows: CalendarDate[][] = [];
  for (let i = 0; i < grid.length; i += 7) {
    rows.push(grid.slice(i, i + 7));
  }

  return (
    <VStack
      width="auto"
      height="auto"
      role="grid"
      aria-readonly="true"
      className={clsx(styles['date-picker-body'], 'j13b-date-picker-body')}
    >
      <HStack width="auto" height="auto" role="row">
        {Array.from({ length: 7 }, (_, i) => (
          <DatePickerDay
            key={i}
            columnIndex={i}
            firstDayOfWeek={firstDayOfWeek}
            locale={locale}
          />
        ))}
      </HStack>
      {rows.map((row, ri) => (
        <HStack key={ri} width="auto" height="auto" role="row">
          {row.map((cd) => {
            const isFocused =
              focusedDate.getFullYear() === cd.year &&
              focusedDate.getMonth() === cd.month &&
              focusedDate.getDate() === cd.date;
            return (
              <DatePickerDate
                key={`${cd.year}-${cd.month}-${cd.date}`}
                ref={isFocused ? onFocusedRef : undefined}
                date={cd}
                visibleMonth={visibleMonth}
                selectedDate={selectedDate}
                focusedDate={focusedDate}
                min={min}
                max={max}
                disabledDates={disabledDates}
                onSelect={onSelect}
                onFocus={onFocus}
              />
            );
          })}
        </HStack>
      ))}
    </VStack>
  );
}
