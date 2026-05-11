/**
 * Returns true for sizing keywords that the CSS module resolves contextually
 * (rather than via inline style). Inline-style width/height is omitted for
 * these so the CSS rules in `stack.module.css` win cleanly.
 */
export function isCustomSizeProp(prop: string | number) {
  return prop === 'default';
}
