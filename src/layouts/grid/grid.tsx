import React from 'react';
import { clsx } from 'clsx';
import styles from './grid.module.css';

export interface GridOwnProps {
  /** Width of each grid item in pixels. Drives the `auto-fill` track size. */
  itemWidth: number;
  /** Height of each grid item in pixels. Drives `grid-auto-rows`. */
  itemHeight: number;
  /** Optional cap on the maximum number of columns. Without it, the grid
   *  uses every column that fits at the container's width. */
  columnAmount?: number;
  gap?: string | number;
  rowGap?: string | number;
  columnGap?: string | number;
  padding?: string | number;
  paddingInline?: string | number;
  paddingBlock?: string | number;
  /** Element tag. Default `div`. */
  as?: keyof React.JSX.IntrinsicElements;
}

export interface GridProps
  extends GridOwnProps,
    Omit<React.HTMLAttributes<HTMLElement>, keyof GridOwnProps> {}

/**
 * Grid — CSS-Grid container that tiles fixed-size items. Items fill the
 * available width via `auto-fill`; pass `columnAmount` to cap the column
 * count. Items take exactly `itemWidth` × `itemHeight` regardless of their
 * content (the layout is intentionally uniform).
 *
 * For grids of variable-sized children, write a plain `<div>` with custom
 * `grid-template-columns` instead — Grid trades flexibility for
 * predictability.
 */
export const Grid = React.forwardRef<HTMLElement, GridProps>(function Grid(
  {
    as = 'div',
    children,
    style,
    className,
    itemWidth,
    itemHeight,
    columnAmount,
    gap,
    rowGap,
    columnGap,
    padding,
    paddingInline,
    paddingBlock,
    ...rest
  },
  ref,
) {
  const childrenCount = React.Children.count(children);
  const template = `repeat(auto-fill, ${itemWidth}px)`;

  // Compute the max-width that caps the grid at `columnAmount` columns,
  // accounting for the gap between columns. Without a cap, the grid fills
  // its parent.
  let maxWidth = '100%';
  if (columnAmount) {
    const amount = Math.min(columnAmount, childrenCount);
    const columnWidth = `${amount * itemWidth}px`;
    maxWidth = gap ? `calc(${columnWidth} + ${gap} * ${amount - 1})` : columnWidth;
  }

  const As = as as React.ElementType;
  const composedStyle: React.CSSProperties = {
    gap,
    rowGap,
    columnGap,
    padding,
    paddingInline,
    paddingBlock,
    '--item-height': `${itemHeight}px`,
    '--max-width': maxWidth,
    '--template': template,
    ...style,
  } as React.CSSProperties;

  return (
    <As
      ref={ref}
      className={clsx('j13b-grid', styles.grid, className)}
      style={composedStyle}
      {...rest}
    >
      {children}
    </As>
  );
});
