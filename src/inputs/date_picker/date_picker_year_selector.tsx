import React from 'react';
import { clsx } from 'clsx';
import { HStack } from '../../stacks/h_stack.js';
import { VStack } from '../../stacks/v_stack.js';
import { Spacer } from '../../stacks/spacer.js';
import styles from './date_picker_year_selector.module.css';

export interface DatePickerYearSelectorProps {
  visibleYear: number;
  min: Date | null;
  max: Date | null;
  onSelect: (year: number) => void;
}

const PAGE_SIZE = 20;

/**
 * 4×5 grid of years, centered on `visibleYear` with prev/next paging in
 * 20-year jumps. Out-of-range years (per min/max) render disabled.
 */
export function DatePickerYearSelector({
  visibleYear,
  min,
  max,
  onSelect,
}: DatePickerYearSelectorProps) {
  const [offset, setOffset] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // preventScroll matters: a scroll on document would propagate to the
    // outer date-picker popover's ScrollAwayListener and close it.
    containerRef.current?.focus({ preventScroll: true });
  }, []);

  const minYear = min?.getFullYear() ?? -Infinity;
  const maxYear = max?.getFullYear() ?? Infinity;

  // Anchor the page boundary on multiples of PAGE_SIZE so paging always
  // produces stable, aligned ranges (e.g. 2020-2039, 2040-2059).
  const remainder = ((visibleYear % PAGE_SIZE) + PAGE_SIZE) % PAGE_SIZE;
  const firstYear = visibleYear - remainder + offset;
  const lastYear = firstYear + PAGE_SIZE - 1;

  const years = Array.from({ length: PAGE_SIZE }, (_, x) => firstYear + x);
  const rows: number[][] = [];
  for (let i = 0; i < years.length; i += 4) {
    rows.push(years.slice(i, i + 4));
  }

  return (
    <VStack
      ref={containerRef as React.Ref<HTMLElement>}
      tabIndex={-1}
      gap="4px"
      padding="8px"
      className={clsx(
        styles['date-picker-year-selector'],
        'j13b-date-picker-year-selector',
      )}
    >
      <HStack vAlign="center" gap="4px">
        <button
          type="button"
          className={clsx(styles['date-picker-year-nav'], 'j13b-date-picker-year-nav')}
          onClick={() => setOffset(offset - PAGE_SIZE)}
          aria-label="Previous years"
        >
          <Chevron direction="left" />
        </button>
        <Spacer />
        <span
          className={clsx(
            styles['date-picker-year-range'],
            'j13b-date-picker-year-range',
          )}
        >
          {firstYear}–{lastYear}
        </span>
        <Spacer />
        <button
          type="button"
          className={clsx(styles['date-picker-year-nav'], 'j13b-date-picker-year-nav')}
          onClick={() => setOffset(offset + PAGE_SIZE)}
          aria-label="Next years"
        >
          <Chevron direction="right" />
        </button>
      </HStack>
      {rows.map((row, ri) => (
        <HStack key={ri} gap="4px">
          {row.map((y) => {
            const disabled = y < minYear || y > maxYear;
            const selected = y === visibleYear;
            return (
              <button
                key={y}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(y)}
                data-is-selected={String(selected)}
                data-is-disabled={String(disabled)}
                className={clsx(
                  styles['date-picker-year-button'],
                  'j13b-date-picker-year-button',
                )}
              >
                {y}
              </button>
            );
          })}
        </HStack>
      ))}
    </VStack>
  );
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  const points = direction === 'left' ? '7,3 3,6 7,9' : '3,3 7,6 3,9';
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points={points} />
    </svg>
  );
}
