/**
 * Returns 12 month names in the requested locale and format. Capitalizes the
 * first grapheme so locales that lower-case month names (e.g. fr-FR) still
 * render as titles in our header.
 */
export function getMonthsOfYear(
  locale: string | undefined,
  format: 'long' | 'short' | 'narrow' | 'numeric' | '2-digit' = 'long',
): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: format });
  // Local time intentional: UTC dates can shift the displayed month by one
  // in time zones west of UTC.
  const reference = new Date(2024, 0, 1);
  const months: string[] = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date(reference);
    date.setMonth(i);
    months.push(capitalizeFirst(formatter.format(date), locale));
  }
  return months;
}

function capitalizeFirst(input: string, locale: string | undefined): string {
  if (!input) return input;
  // Intl.Segmenter handles multi-codepoint graphemes correctly (some locales
  // start month names with combining marks).
  if (typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' });
    const first = segmenter.segment(input)[Symbol.iterator]().next().value?.segment ?? '';
    return first.toLocaleUpperCase(locale ?? []) + input.slice(first.length);
  }
  return input[0]!.toLocaleUpperCase(locale ?? []) + input.slice(1);
}
