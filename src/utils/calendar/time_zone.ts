/**
 * Timezone helpers built on `Intl.DateTimeFormat` — no external date library.
 *
 * A JavaScript `Date` is an absolute instant (epoch ms). The date picker, by
 * contrast, reasons about a *wall-clock* calendar day/time. These helpers are
 * the bridge between the two: they decompose an instant into the wall-clock
 * parts seen in a given IANA time zone, and recompose wall-clock parts back
 * into the correct instant — accounting for DST transitions.
 */

/** Wall-clock fields in some time zone. `month` is 0-based to match `Date`. */
export interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

/** The runtime's IANA time zone (e.g. 'America/New_York'). */
export function getLocalTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Formatters are comparatively expensive to construct; cache one per zone.
const formatterCache = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatterCache.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    formatterCache.set(timeZone, formatter);
  }
  return formatter;
}

/** Decompose an absolute instant into the wall-clock parts seen in `timeZone`. */
export function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = formatterFor(timeZone).formatToParts(date);
  const map: Partial<Record<Intl.DateTimeFormatPartTypes, number>> = {};
  for (const part of parts) {
    if (part.type !== 'literal') map[part.type] = Number(part.value);
  }
  return {
    year: map.year!,
    month: map.month! - 1,
    day: map.day!,
    // Some engines report midnight as hour 24 under h23; normalize to 0.
    hour: map.hour! % 24,
    minute: map.minute!,
    second: map.second!,
  };
}

/**
 * How far `timeZone`'s wall clock is ahead of UTC at the given instant, in ms
 * (negative for zones west of UTC). Derived by reading the zone's wall-clock
 * parts at that instant and treating them as if they were UTC.
 */
function offsetMsAt(utcMs: number, timeZone: string): number {
  const p = getZonedParts(new Date(utcMs), timeZone);
  const wallAsUtc = Date.UTC(p.year, p.month, p.day, p.hour, p.minute, p.second);
  return wallAsUtc - utcMs;
}

/**
 * Recompose wall-clock parts (interpreted in `timeZone`) into the absolute
 * instant they denote. Milliseconds are dropped (the picker works to second
 * resolution).
 *
 * DST handling: the wall-clock parts are first treated as if they were UTC,
 * then shifted by the zone's offset. Because the offset itself can change
 * across the very transition we're landing on, a second pass re-reads the
 * offset at the candidate instant and corrects it. For wall-clock times that
 * don't exist (spring-forward gap) or are ambiguous (fall-back overlap) this
 * yields a deterministic, sensible instant.
 */
export function partsToInstant(parts: ZonedParts, timeZone: string): Date {
  const asUtc = Date.UTC(
    parts.year,
    parts.month,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  const offset1 = offsetMsAt(asUtc, timeZone);
  let ts = asUtc - offset1;
  const offset2 = offsetMsAt(ts, timeZone);
  if (offset2 !== offset1) ts = asUtc - offset2;
  return new Date(ts);
}

const HOUR_MS = 60 * 60 * 1000;

/**
 * Every absolute instant the given wall-clock time maps to in `timeZone`,
 * sorted earliest first:
 *   - 1 instant on a normal day,
 *   - 0 instants for a time skipped by a spring-forward transition (it never
 *     occurs — a "gap"),
 *   - 2 instants for a time repeated by a fall-back transition (the hour runs
 *     twice — an "overlap"); the two differ by the offsets on either side.
 *
 * This is the strict counterpart to `partsToInstant`, which always returns a
 * single (possibly snapped) instant.
 */
export function getInstantsForWallTime(parts: ZonedParts, timeZone: string): Date[] {
  const asUtc = Date.UTC(
    parts.year,
    parts.month,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  // DST shifts are at most a couple of hours, so a ±12h window safely brackets
  // any transition adjacent to this wall time and gives the offsets in force on
  // either side of it.
  const offsetBefore = offsetMsAt(asUtc - 12 * HOUR_MS, timeZone);
  const offsetAfter = offsetMsAt(asUtc + 12 * HOUR_MS, timeZone);
  const candidates =
    offsetBefore === offsetAfter
      ? [asUtc - offsetBefore]
      : [asUtc - offsetBefore, asUtc - offsetAfter];

  const valid: number[] = [];
  for (const ts of candidates) {
    // A candidate is real only if it reads back as the exact wall time asked
    // for — this rejects the gap and dedupes the non-transition case.
    const back = getZonedParts(new Date(ts), timeZone);
    const roundTrips =
      back.year === parts.year &&
      back.month === parts.month &&
      back.day === parts.day &&
      back.hour === parts.hour &&
      back.minute === parts.minute &&
      back.second === parts.second;
    if (roundTrips && !valid.includes(ts)) valid.push(ts);
  }
  valid.sort((a, b) => a - b);
  return valid.map((ts) => new Date(ts));
}

/** Short zone name for an instant (e.g. 'MDT', 'MST', or a 'GMT-7' fallback). */
export function getZoneAbbreviation(
  date: Date,
  timeZone: string,
  locale?: string,
): string {
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    timeZoneName: 'short',
  }).formatToParts(date);
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
}

/**
 * A "day proxy": a Date whose *local* y/m/d equal the calendar day that
 * `date` falls on in `timeZone`. Anchored at noon so no DST transition (none
 * exceeds 12h) can shift its date — making it safe to compare with the
 * day-level helpers, which only read y/m/d. The time portion is meaningless.
 */
export function zonedDayProxy(date: Date, timeZone: string): Date {
  const p = getZonedParts(date, timeZone);
  return new Date(p.year, p.month, p.day, 12);
}
