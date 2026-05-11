/**
 * Returns the locale's first day of the week as a JS getDay() value
 * (0 = Sunday … 6 = Saturday). Falls back to Sunday when Intl.Locale.weekInfo
 * isn't available (older browsers or non-DOM runtimes).
 *
 * Note on the conversion: Intl uses ISO 8601 numbering (1 = Monday,
 * 7 = Sunday); we convert 7 → 0 to match JS conventions.
 */
export function getFirstDayOfWeek(locale: string | undefined): number {
  // weekInfo is a stage-3 proposal; not in TS lib types yet — narrow safely.
  const LocaleCtor = (Intl as unknown as { Locale?: new (tag: string) => unknown }).Locale;
  if (!LocaleCtor) return 0;
  try {
    const instance = new LocaleCtor(locale ?? new Intl.DateTimeFormat().resolvedOptions().locale) as {
      weekInfo?: { firstDay?: number };
      getWeekInfo?: () => { firstDay?: number };
    };
    const info = instance.weekInfo ?? instance.getWeekInfo?.();
    const firstDay = info?.firstDay;
    if (typeof firstDay !== 'number') return 0;
    return firstDay === 7 ? 0 : firstDay;
  } catch {
    return 0;
  }
}
