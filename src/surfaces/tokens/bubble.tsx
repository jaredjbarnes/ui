import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';
import type { ActionSeverity } from '../../actions/types.js';
import type { Size } from '../../utils/index.js';
import styles from './tokens.module.css';

export interface BubbleOwnProps {
  severity?: ActionSeverity;
  size?: Size;
  /** Lifts the bubble with a soft shadow — useful for badge-on-icon. */
  elevated?: boolean;
}

export interface BubbleProps extends Omit<HStackProps, 'inline'>, BubbleOwnProps {}

/**
 * Bubble — small filled circle/pill surface. Counters, status dots, score
 * pills. Like Chip but filled (paints --material as the background) rather
 * than outlined.
 */
export const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(function Bubble(
  {
    severity = 'neutral',
    size = 'md',
    elevated = false,
    children,
    className,
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
      hAlign="center"
      vAlign="center"
      data-severity={severity}
      data-size={size}
      data-is-elevated={elevated}
      className={clsx('j13b-surface', 'j13b-bubble', styles.bubble, className)}
      {...props}
    >
      {children}
    </HStack>
  );
});
