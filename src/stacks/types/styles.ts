import { Alignment } from './alignment.js';

export interface StackStyleProps {
  hAlign?: Alignment;
  vAlign?: Alignment;
  /**
   * `'default'` — fit context (grow as a child of an HStack, full width as a
   * child of a VStack). `'auto'` — content-driven, no growing.
   * `'fill'` — explicitly grow to fill available space along the main axis.
   * Or a literal CSS width.
   */
  width?: 'default' | 'auto' | 'fill' | string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  /** Same keywords as `width`, applied to height. */
  height?: 'default' | 'auto' | 'fill' | string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  growWeight?: number;
  shrinkWeight?: number;
  padding?: string | number;
  paddingInline?: string | number;
  paddingBlock?: string | number;
  margin?: string | number;
  marginInline?: string | number;
  marginBlock?: string | number;
  zIndex?: string | number;
  gap?: string | number;
  rowGap?: string | number;
  columnGap?: string | number;
  allowFlow?: boolean;
  inline?: boolean;
}

export interface VerticalProps {
  overflowX?: 'hidden' | 'visible';
  overflowY?: 'hidden' | 'scroll' | 'auto' | 'visible';
}

export interface HorizontalProps {
  overflowX?: 'hidden' | 'scroll' | 'auto' | 'visible';
  overflowY?: 'hidden' | 'visible';
}
