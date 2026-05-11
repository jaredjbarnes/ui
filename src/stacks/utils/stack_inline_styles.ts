import type React from 'react';
import { isCustomSizeProp } from './isCustomSizeProp.js';
import { removeUndefinedProperties } from './remove_undefined_properties.js';
import type { StackStyleProps } from '../types/styles.js';

/**
 * For sizing props: pass through literal values, omit CSS-driven keywords.
 * Keywords like `'default'` are resolved by the parent's CSS rules in
 * `stack.module.css`; setting them as inline styles would defeat that.
 */
function dimValue(v?: string | number): string | number | undefined {
  if (v === undefined) return undefined;
  if (typeof v === 'string' && isCustomSizeProp(v)) return undefined;
  return v;
}

/**
 * Maps shared StackStyleProps onto a single inline-style object.
 * Used by HStack, VStack, and ZStack so the mapping lives in one place.
 *
 * Per-stack overflow handling is NOT included — each stack adds its own
 * overflow inline styles alongside this result.
 */
export function stackInlineStyles(props: StackStyleProps): React.CSSProperties {
  return removeUndefinedProperties({
    minWidth: props.minWidth,
    width: dimValue(props.width),
    maxWidth: props.maxWidth,
    minHeight: props.minHeight,
    height: dimValue(props.height),
    maxHeight: props.maxHeight,
    flexGrow: props.growWeight,
    flexShrink: props.shrinkWeight,
    zIndex: props.zIndex,
    padding: props.padding,
    paddingBlock: props.paddingBlock,
    paddingInline: props.paddingInline,
    margin: props.margin,
    marginBlock: props.marginBlock,
    marginInline: props.marginInline,
    gap: props.gap,
    rowGap: props.rowGap,
    columnGap: props.columnGap,
  });
}
