import type { CalendarDate } from './calendar_date.js';
import type { MonthValue } from './month.js';

/**
 * Returns the 6×7 grid of dates that fills a month view. The first cell is
 * the configured `firstDayOfWeek` (0 = Sunday … 6 = Saturday) on or before
 * the 1st of `month`; the grid then walks 42 days forward. This keeps the
 * layout stable across short and long months and respects locales that
 * begin the week on a day other than Sunday.
 */
export function getCalendarGrid(
  year: number,
  month: number,
  firstDayOfWeek: number = 0,
): CalendarDate[] {
  const cursor = new Date(year, month, 1);
  while (cursor.getDay() !== firstDayOfWeek) {
    cursor.setDate(cursor.getDate() - 1);
  }

  const dates: CalendarDate[] = [];
  for (let i = 0; i < 42; i++) {
    dates.push({
      year: cursor.getFullYear(),
      month: cursor.getMonth() as MonthValue,
      date: cursor.getDate(),
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}
