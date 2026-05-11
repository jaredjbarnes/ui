/** True if `a` and `b` fall on the same calendar day in local time. */
export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * True when `date` (a calendar day) overlaps the inclusive [min, max] range.
 * The range bounds are normalized to the start/end of their respective day so
 * passing a min of "today 14:30" still allows selecting today.
 */
export function isDayWithinRange(
  date: Date,
  min: Date | null | undefined,
  max: Date | null | undefined,
): boolean {
  const time = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  if (min) {
    const minStart = new Date(min);
    minStart.setHours(0, 0, 0, 0);
    if (time < minStart.getTime()) return false;
  }
  if (max) {
    const maxEnd = new Date(max);
    maxEnd.setHours(23, 59, 59, 999);
    if (time > maxEnd.getTime()) return false;
  }
  return true;
}

/** True when [year, month] has any selectable day after applying min/max. */
export function canNavigateToMonth(
  year: number,
  month: number,
  min: Date | null | undefined,
  max: Date | null | undefined,
): boolean {
  const start = new Date(year, month, 1).getTime();
  const end = new Date(year, month + 1, 1).getTime();
  const minTime = min?.getTime() ?? -Infinity;
  const maxTime = max?.getTime() ?? Infinity;
  return Math.max(minTime, start) < Math.min(maxTime, end);
}
