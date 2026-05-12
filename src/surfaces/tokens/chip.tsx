import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';
import type { ActionSeverity } from '../../actions/types.js';
import type { Size } from '../../utils/index.js';
import styles from './tokens.module.css';

export interface ChipOwnProps {
  severity?: ActionSeverity;
  size?: Size;
}

export interface ChipProps extends Omit<HStackProps, 'inline'>, ChipOwnProps {}

/**
 * Chip — small inline pill-shaped surface. Use for tags, filters, and short
 * categorical labels. Redeclares `--material` based on `data-severity` so a
 * "danger" chip reads in error tone without per-instance color props.
 */
export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(function Chip(
  {
    severity = 'neutral',
    size = 'md',
    children,
    className,
    vAlign = 'center',
    ...props
  },
  ref,
) {
  return (
    <HStack
      ref={ref as React.Ref<HTMLElement>}
      inline
      width="auto"
      height="auto"
      vAlign={vAlign}
      data-severity={severity}
      data-size={size}
      className={clsx('j13b-surface', 'j13b-chip', styles.chip, className)}
      {...props}
    >
      {children}
    </HStack>
  );
});
