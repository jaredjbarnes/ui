import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';
import type { ActionSeverity } from '../../actions/types.js';
import styles from './tokens.module.css';

export interface ValueOwnProps {
  severity?: ActionSeverity;
}

export interface ValueProps extends HStackProps, ValueOwnProps {}

/**
 * Value — the value half of a key/value pair (think `<dd>`). Default
 * end-aligned so terms read as left-label / right-value. Severity drives
 * the value's tone (a "dangerous" value reads in error color).
 */
export const Value = React.forwardRef<HTMLElement, ValueProps>(function Value(
  {
    children,
    className,
    hAlign = 'end',
    severity = 'neutral',
    ...props
  },
  ref,
) {
  return (
    <HStack
      ref={ref}
      hAlign={hAlign}
      data-severity={severity}
      className={clsx('j13b-datum', 'j13b-value', styles.value, className)}
      {...props}
    >
      {children}
    </HStack>
  );
});
