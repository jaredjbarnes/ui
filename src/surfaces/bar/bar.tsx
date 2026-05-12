import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';
import styles from './bar.module.css';

export interface BarOwnProps {}

export interface BarProps extends HStackProps, BarOwnProps {}

/**
 * Bar — generic horizontal strip surface. Header, Footer, and UtilityBar are
 * all Bars with semantic tags and distinct class hooks. Default outer element
 * is `<div>`; consumers override via `as` when they need a semantic tag.
 */
export const Bar = React.forwardRef<HTMLElement, BarProps>(function Bar(
  { children, className, as = 'div', vAlign = 'center', ...props },
  ref,
) {
  return (
    <HStack
      ref={ref}
      as={as}
      vAlign={vAlign}
      className={clsx('j13b-surface', 'j13b-bar', styles.bar, className)}
      {...props}
    >
      {children}
    </HStack>
  );
});
