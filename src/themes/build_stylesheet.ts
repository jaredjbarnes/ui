export function buildStyleSheet(parts: string[]): CSSStyleSheet {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(parts.join('\n'));
  return sheet;
}
