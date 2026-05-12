import React from 'react';
import { clsx } from 'clsx';
import { ZStack } from '../../stacks/z_stack.js';
import { Bubble } from './bubble.js';
import type { ActionSeverity } from '../../actions/types.js';
import styles from './tokens.module.css';

export interface BadgeOwnProps {
  /** The bubble content (count, dot, "new" label). */
  value: React.ReactNode;
  severity?: ActionSeverity;
}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BadgeOwnProps {}

/**
 * Badge — overlays a `Bubble` on the top-end corner of its children. Use
 * for unread counts, "new" markers, status indicators on icons.
 */
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { value, severity = 'neutral', children, className, ...props },
  ref,
) {
  return (
    <ZStack
      ref={ref as React.Ref<HTMLElement>}
      inline
      width="auto"
      height="auto"
      hAlign="end"
      vAlign="start"
      className={clsx('j13b-badge', styles.badge, className)}
      {...props}
    >
      {children}
      <Bubble
        severity={severity}
        elevated
        className={clsx('j13b-badge-bubble', styles['badge-bubble'])}
      >
        {value}
      </Bubble>
    </ZStack>
  );
});
