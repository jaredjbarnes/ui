import React from 'react';
import { clsx } from 'clsx';
import styles from './group.module.css';

export interface GroupOwnProps {
  /** Element tag. Default `span`. */
  as?: keyof React.JSX.IntrinsicElements;
}

export interface GroupProps
  extends GroupOwnProps,
    Omit<React.HTMLAttributes<HTMLElement>, keyof GroupOwnProps> {}

/**
 * Group — semantic wrapper that groups children without affecting layout.
 * Uses `display: contents` so the Group element is invisible to flex /
 * grid / block layout — only its children participate. Useful for
 * keyboard navigation scopes, ARIA grouping, or conditional rendering of
 * a set of siblings.
 */
export const Group = React.forwardRef<HTMLElement, GroupProps>(function Group(
  { as = 'span', children, className, ...rest },
  ref,
) {
  const As = as as React.ElementType;
  return (
    <As
      ref={ref}
      className={clsx('j13b-group', styles.group, className)}
      {...rest}
    >
      {children}
    </As>
  );
});
