import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import styles from './table.module.css';

export interface TTableProps extends Omit<VStackProps, 'as'> {
  /** Sticky header, footer, and the first/last column. */
  sticky?: boolean;
}

/**
 * TTable — `<table>` surface root. The outer element is a VStack-shaped
 * scroll container (the `<table>` element itself doesn't honor
 * `overflow: auto` because of table layout rules); the semantic `<table>`
 * is rendered inside.
 *
 * Themes paint `.j13b-table` for base chrome; rows redeclare per-row
 * material via `.j13b-tr` rules and the `data-is-selected` attribute.
 */
export const TTable = React.forwardRef<HTMLElement, TTableProps>(function TTable(
  { children, className, sticky = false, style, ...props },
  ref,
) {
  // Tables need to scroll on both axes. VStack's typed `overflowX` only
  // accepts `hidden | visible`, so the dual-axis scroll is set via inline
  // style instead (the stack applies its typed overflow first, then
  // `style` last, so our values win).
  return (
    <VStack
      ref={ref}
      as="div"
      data-is-sticky={sticky}
      style={style}
      className={clsx('j13b-surface', 'j13b-table', styles.table, className)}
      {...props}
    >
      <table className={clsx('j13b-table-inner', styles['table-inner'])}>
        {children}
      </table>
    </VStack>
  );
});

export interface THeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const THead = React.forwardRef<HTMLTableSectionElement, THeadProps>(
  function THead({ children, className, ...props }, ref) {
    return (
      <thead ref={ref} className={clsx('j13b-thead', className)} {...props}>
        {children}
      </thead>
    );
  },
);

export interface TBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TBody = React.forwardRef<HTMLTableSectionElement, TBodyProps>(
  function TBody({ children, className, ...props }, ref) {
    return (
      <tbody ref={ref} className={clsx('j13b-tbody', className)} {...props}>
        {children}
      </tbody>
    );
  },
);

export interface TFootProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TFoot = React.forwardRef<HTMLTableSectionElement, TFootProps>(
  function TFoot({ children, className, ...props }, ref) {
    return (
      <tfoot ref={ref} className={clsx('j13b-tfoot', className)} {...props}>
        {children}
      </tfoot>
    );
  },
);

export interface TRProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isSelected?: boolean;
}

export const TR = React.forwardRef<HTMLTableRowElement, TRProps>(function TR(
  { children, className, isSelected = false, ...props },
  ref,
) {
  return (
    <tr
      ref={ref}
      aria-selected={isSelected}
      data-is-selected={isSelected}
      className={clsx('j13b-tr', className)}
      {...props}
    >
      {children}
    </tr>
  );
});

export interface THProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Whether this cell should grow to fill remaining horizontal space. */
  fill?: boolean;
}

export const TH = React.forwardRef<HTMLTableCellElement, THProps>(function TH(
  { children, className, fill = false, ...props },
  ref,
) {
  return (
    <th
      ref={ref}
      data-is-fill={fill}
      className={clsx('j13b-th', className)}
      {...props}
    >
      {children}
    </th>
  );
});

export interface TDProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  fill?: boolean;
}

export const TD = React.forwardRef<HTMLTableCellElement, TDProps>(function TD(
  { children, className, fill = false, ...props },
  ref,
) {
  return (
    <td
      ref={ref}
      data-is-fill={fill}
      className={clsx('j13b-td', className)}
      {...props}
    >
      {children}
    </td>
  );
});
