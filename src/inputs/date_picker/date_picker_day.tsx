import React from 'react';
import { clsx } from 'clsx';
import styles from './date_picker_day.module.css';

export interface DatePickerDayProps {
  /** Column index, 0 … 6, relative to the locale's first day of week. */
  columnIndex: number;
  /** Locale's first day of week as a JS getDay value (0 = Sunday). */
  firstDayOfWeek: number;
  locale?: string;
}

/**
 * One column header in the weekday row. Renders the localized short weekday
 * name, abbreviated to a single grapheme to keep the column narrow. Column
 * 0 is the locale's first day of week (Sunday in en-US, Monday in fr-FR).
 *
 * Uses a plain <div> rather than a ZStack so the cell width comes from this
 * file's CSS module unambiguously — the ZStack base rule (width: 100%) and
 * a local cell rule both use :where() (specificity 0), and load order isn't
 * guaranteed, so mixing them caused the weekday row to collapse.
 */
export function DatePickerDay({ columnIndex, firstDayOfWeek, locale }: DatePickerDayProps) {
  const label = React.useMemo(() => {
    // Anchor on a known Sunday so adding (firstDayOfWeek + columnIndex) days
    // lands on the right weekday regardless of today.
    const anchor = new Date(2024, 0, 7); // 2024-01-07 is a Sunday.
    anchor.setDate(anchor.getDate() + ((firstDayOfWeek + columnIndex) % 7));
    const formatted = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(anchor);
    return formatted.toLocaleUpperCase(locale ?? []);
  }, [columnIndex, firstDayOfWeek, locale]);

  return (
    <div
      aria-hidden="true"
      className={clsx(styles['date-picker-day'], 'j13b-date-picker-day')}
    >
      <span
        className={clsx(styles['date-picker-day-text'], 'j13b-date-picker-day-text')}
      >
        {label[0] ?? ''}
      </span>
    </div>
  );
}
