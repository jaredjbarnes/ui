import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';
import styles from './tokens.module.css';

export interface TermOwnProps {}

export interface TermProps extends HStackProps, TermOwnProps {}

/**
 * Term — wraps a `Key` + `Value` pair on one line. Spreads them so the key
 * sits at the start and the value at the end, like a definition list row.
 */
export const Term = React.forwardRef<HTMLElement, TermProps>(function Term(
  { children, className, vAlign = 'start', ...props },
  ref,
) {
  return (
    <HStack
      ref={ref}
      vAlign={vAlign}
      className={clsx('j13b-term', styles.term, className)}
      {...props}
    >
      {children}
    </HStack>
  );
});
