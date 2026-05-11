import React from 'react';
import { clsx } from 'clsx';
import { HStack } from '../../stacks/h_stack.js';
import { VStack } from '../../stacks/v_stack.js';
import { getCalendarGrid } from '../../utils/calendar/get_calendar_grid.js';
import { getFirstDayOfWeek } from '../../utils/calendar/get_first_day_of_week.js';
import { isDayWithinRange } from '../../utils/calendar/date_helpers.js';
import { DatePickerHeader } from './date_picker_header.js';
import { DatePickerBody } from './date_picker_body.js';
import { DatePickerTimeSelector } from './date_picker_time_selector.js';
import { useResizeObserver } from '../../utils/hooks/use_resize_observer.js';
import styles from './date_picker.module.css';

export interface DatePickerOwnProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
  disabled?: boolean;

  /** Adds a vertical time-slot list beside the calendar. */
  showTime?: boolean;
  timeIntervalInMinutes?: number;
  /** Restricts visible time-of-day slots (in ms since midnight). */
  minVisibleTimeInMilliseconds?: number;
  maxVisibleTimeInMilliseconds?: number;
  onTimeSelected?: (hour: number, minute: number, second: number) => void;

  min?: Date | null;
  max?: Date | null;
  disabledDates?: Date[];

  /** BCP-47 locale tag (e.g. 'en-US', 'fr-FR'); defaults to the browser's. */
  locale?: string;

  /** Auto-focus the active day cell on mount. Default true. */
  autoFocus?: boolean;

  /** Render arbitrary footer content (e.g. Today / Clear buttons). */
  renderActions?: (api: DatePickerActions) => React.ReactNode;
}

export interface DatePickerActions {
  selectDate: (date: Date | null) => void;
  goToToday: () => void;
  clear: () => void;
  value: Date | null;
}

export type DatePickerProps = DatePickerOwnProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof DatePickerOwnProps>;

function clampToBounds(
  date: Date,
  min: Date | null,
  max: Date | null,
): Date {
  if (min && date.getTime() < min.getTime()) return new Date(min);
  if (max && date.getTime() > max.getTime()) return new Date(max);
  return date;
}

/** Move a date to a new (year, month) keeping the day-of-month, clamped to
 *  the new month's last day so e.g. Jan 31 → Feb 28 instead of overflowing
 *  to March. */
function carryDayOfMonth(source: Date, year: number, month: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(source.getDate(), lastDay));
}

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  function DatePicker(
    {
      value: valueProp,
      defaultValue = null,
      onChange,
      disabled = false,
      showTime = false,
      timeIntervalInMinutes = 15,
      minVisibleTimeInMilliseconds,
      maxVisibleTimeInMilliseconds,
      onTimeSelected,
      min: minProp = null,
      max: maxProp = null,
      disabledDates,
      locale,
      autoFocus = true,
      renderActions,
      className,
      ...rest
    },
    ref,
  ) {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<Date | null>(defaultValue);
    const value = isControlled ? valueProp : internalValue;

    const min = minProp;
    const max = maxProp;
    const disabledDatesList = disabledDates ?? [];

    // Initial visible month: the value's month, or today if no value.
    const initialAnchor = value ?? new Date();
    const [visibleYear, setVisibleYear] = React.useState(initialAnchor.getFullYear());
    const [visibleMonth, setVisibleMonth] = React.useState(initialAnchor.getMonth());

    // The keyboard "cursor" — the cell currently in the tab order.
    const [focusedDate, setFocusedDate] = React.useState<Date>(() => {
      const seed = value ?? new Date();
      return new Date(seed.getFullYear(), seed.getMonth(), seed.getDate());
    });

    // When value moves to a different month externally, follow it. Tracking
    // the previous time via ref keeps the dep array empty (no exhaustive-deps
    // friction) and avoids re-firing on identity-only renders.
    const prevValueTimeRef = React.useRef<number | undefined>(value?.getTime());
    React.useEffect(() => {
      const time = value?.getTime();
      if (time === prevValueTimeRef.current) return;
      prevValueTimeRef.current = time;
      if (value && (value.getFullYear() !== visibleYear || value.getMonth() !== visibleMonth)) {
        setVisibleYear(value.getFullYear());
        setVisibleMonth(value.getMonth());
      }
    });

    const firstDayOfWeek = React.useMemo(() => getFirstDayOfWeek(locale), [locale]);

    const grid = React.useMemo(
      () => getCalendarGrid(visibleYear, visibleMonth, firstDayOfWeek),
      [visibleYear, visibleMonth, firstDayOfWeek],
    );

    const focusedCellRef = React.useRef<HTMLButtonElement | null>(null);
    const shouldFocusOnNextRender = React.useRef(autoFocus);

    // Calendar height drives the time-selector's height: without this the
    // time list (96 slots at default 15-min interval) grows unbounded and
    // forces the whole picker to be hundreds of pixels tall.
    const [calendarHeight, setCalendarHeight] = React.useState(0);
    const calendarResizeRef = useResizeObserver<HTMLElement>((_w, h) => {
      setCalendarHeight(h);
    }, 'height');

    // Move real focus onto the cell that currently owns the cursor — but only
    // when navigation explicitly requests it. Otherwise hover/click would
    // yank focus around the page on every state update.
    //
    // preventScroll matters: the cell lives inside a portaled popover, and
    // letting the browser auto-scroll would fire a scroll event on the
    // document, which the parent's ScrollAwayListener treats as scroll-away
    // and closes the popover the instant it opens.
    React.useLayoutEffect(() => {
      if (!shouldFocusOnNextRender.current) return;
      shouldFocusOnNextRender.current = false;
      focusedCellRef.current?.focus({ preventScroll: true });
    });

    function commit(next: Date | null) {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    }

    function selectDay(day: Date) {
      // Preserve any time-of-day from the existing value so toggling the day
      // doesn't reset hour/minute.
      const merged = new Date(day);
      if (value) {
        merged.setHours(value.getHours(), value.getMinutes(), value.getSeconds(), 0);
      }
      const clamped = clampToBounds(merged, min, max);
      commit(clamped);
    }

    function setTime(h: number, m: number, s: number) {
      if (!value) return;
      const next = new Date(value);
      next.setHours(h, m, s, 0);
      commit(clampToBounds(next, min, max));
      onTimeSelected?.(h, m, s);
    }

    function moveCursor(delta: number, unit: 'day' | 'month' | 'year') {
      const next = new Date(focusedDate);
      if (unit === 'day') next.setDate(next.getDate() + delta);
      if (unit === 'month') next.setMonth(next.getMonth() + delta);
      if (unit === 'year') next.setFullYear(next.getFullYear() + delta);
      setFocusedDate(next);
      if (next.getFullYear() !== visibleYear || next.getMonth() !== visibleMonth) {
        setVisibleYear(next.getFullYear());
        setVisibleMonth(next.getMonth());
      }
      shouldFocusOnNextRender.current = true;
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
      // Ignore keys originating from inside nested popovers (Select, year
      // grid) so their own handlers stay authoritative.
      const target = e.target as HTMLElement;
      if (target.closest('.j13b-select') || target.closest('.j13b-date-picker-year-selector')) {
        return;
      }
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); moveCursor(-1, 'day'); break;
        case 'ArrowRight': e.preventDefault(); moveCursor(1, 'day'); break;
        case 'ArrowUp': e.preventDefault(); moveCursor(-7, 'day'); break;
        case 'ArrowDown': e.preventDefault(); moveCursor(7, 'day'); break;
        case 'Home': {
          e.preventDefault();
          // Distance back to the locale's start-of-week, not always Sunday.
          const offset = (focusedDate.getDay() - firstDayOfWeek + 7) % 7;
          moveCursor(-offset, 'day');
          break;
        }
        case 'End': {
          e.preventDefault();
          const offset = (focusedDate.getDay() - firstDayOfWeek + 7) % 7;
          moveCursor(6 - offset, 'day');
          break;
        }
        case 'PageUp': {
          e.preventDefault();
          moveCursor(-1, e.shiftKey ? 'year' : 'month');
          break;
        }
        case 'PageDown': {
          e.preventDefault();
          moveCursor(1, e.shiftKey ? 'year' : 'month');
          break;
        }
        case 'Enter':
        case ' ': {
          if (isDayWithinRange(focusedDate, min, max)) {
            e.preventDefault();
            selectDay(focusedDate);
          }
          break;
        }
      }
    }

    const actions: DatePickerActions = {
      value,
      selectDate: (d) => commit(d),
      goToToday: () => {
        const t = new Date();
        setVisibleYear(t.getFullYear());
        setVisibleMonth(t.getMonth());
        setFocusedDate(new Date(t.getFullYear(), t.getMonth(), t.getDate()));
        shouldFocusOnNextRender.current = true;
      },
      clear: () => commit(null),
    };

    return (
      <HStack
        ref={ref as React.Ref<HTMLElement>}
        width="auto"
        height="auto"
        className={clsx(styles['date-picker'], 'j13b-date-picker', className)}
        data-is-disabled={disabled ? 'true' : 'false'}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        <VStack
          ref={calendarResizeRef as React.Ref<HTMLElement>}
          width="auto"
          height="auto"
          gap="4px"
          className={clsx(styles['date-picker-box'], 'j13b-date-picker-box')}
        >
          <DatePickerHeader
            visibleYear={visibleYear}
            visibleMonth={visibleMonth}
            min={min}
            max={max}
            locale={locale}
            onMonthChange={(m) => {
              const probe = new Date(visibleYear, m, 1);
              const newYear = probe.getFullYear();
              const newMonth = probe.getMonth();
              setVisibleYear(newYear);
              setVisibleMonth(newMonth);
              setFocusedDate(carryDayOfMonth(focusedDate, newYear, newMonth));
            }}
            onYearChange={(y) => {
              setVisibleYear(y);
              setFocusedDate(carryDayOfMonth(focusedDate, y, visibleMonth));
            }}
          />
          <DatePickerBody
            visibleYear={visibleYear}
            visibleMonth={visibleMonth}
            grid={grid}
            selectedDate={value}
            focusedDate={focusedDate}
            min={min}
            max={max}
            disabledDates={disabledDatesList}
            locale={locale}
            firstDayOfWeek={firstDayOfWeek}
            onSelect={selectDay}
            onFocus={(d) => setFocusedDate(d)}
            onFocusedRef={(el) => (focusedCellRef.current = el)}
          />
          {renderActions && (
            <HStack
              width="default"
              hAlign="end"
              gap="6px"
              padding="4px"
              className={clsx(styles['date-picker-actions'], 'j13b-date-picker-actions')}
            >
              {renderActions(actions)}
            </HStack>
          )}
        </VStack>
        {showTime && (
          <DatePickerTimeSelector
            origin={value}
            intervalInMinutes={timeIntervalInMinutes}
            min={min}
            max={max}
            minVisibleTimeInMilliseconds={minVisibleTimeInMilliseconds}
            maxVisibleTimeInMilliseconds={maxVisibleTimeInMilliseconds}
            disabled={disabled}
            height={calendarHeight ? `${calendarHeight}px` : undefined}
            onSelect={setTime}
          />
        )}
      </HStack>
    );
  },
);
