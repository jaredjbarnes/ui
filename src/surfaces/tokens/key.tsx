import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';
import type { ActionSeverity } from '../../actions/types.js';
import styles from './tokens.module.css';

export interface KeyOwnProps {
  severity?: ActionSeverity;
}

export interface KeyProps extends HStackProps, KeyOwnProps {}

/**
 * Key — the label half of a key/value pair (think `<dt>`). Pairs with `Value`
 * inside a `Term`. Themes paint `.j13b-key` to give labels their visual
 * weight (typically muted).
 */
export const Key = React.forwardRef<HTMLElement, KeyProps>(function Key(
  {
    children,
    className,
    hAlign = 'start',
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
      className={clsx('j13b-datum', 'j13b-key', styles.key, className)}
      {...props}
    >
      {children}
    </HStack>
  );
});
