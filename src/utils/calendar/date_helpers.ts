/** Comparable key for a Date's calendar day, using its own local fields. */
function dayKey(d: Date): number {
  // year*10000 + month*100 + date is strictly monotonic in calendar order
  // (month ≤ 11, date ≤ 31, so the bands never overlap).
  return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
}

/** Comparable key for a Date's calendar month. */
function monthKey(d: Date): number {
  return d.getFullYear() * 12 + d.getMonth();
}

/** True if `a` and `b` fall on the same calendar day (by their own fields). */
export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * True when `date`'s calendar day falls within the inclusive [min, max] range.
 * Comparison is by calendar day only — the time-of-day of `date`, `min`, and
 * `max` is ignored — so a min of "today 14:30" still allows selecting today.
 *
 * Callers working in a specific time zone pass day proxies (see
 * `zonedDayProxy`) whose fields already reflect that zone's calendar day.
 */
export function isDayWithinRange(
  date: Date,
  min: Date | null | undefined,
  max: Date | null | undefined,
): boolean {
  const key = dayKey(date);
  if (min && key < dayKey(min)) return false;
  if (max && key > dayKey(max)) return false;
  return true;
}

/** True when [year, month] has any selectable day after applying min/max. */
export function canNavigateToMonth(
  year: number,
  month: number,
  min: Date | null | undefined,
  max: Date | null | undefined,
): boolean {
  // year*12 + month stays correct for out-of-range month indices (-1, 12),
  // which the header passes when probing the previous/next month.
  const key = year * 12 + month;
  if (min && key < monthKey(min)) return false;
  if (max && key > monthKey(max)) return false;
  return true;
}
