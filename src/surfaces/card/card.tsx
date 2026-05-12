import { clsx } from 'clsx';
import React from 'react';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import styles from './card.module.css';

export interface CardOwnProps {}

export interface CardProps extends Omit<VStackProps, 'as'>, CardOwnProps {}

/**
 * Card — the canonical in-flow surface. Redeclares the four-variable
 * vocabulary at its boundary so every interactive child reads from a fresh
 * cascade context. Themes paint `.j13b-card` with material / radius /
 * border / elevation; the component itself ships only the class hook.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, hAlign = 'start', vAlign = 'start', ...props },
  ref,
) {
  return (
    <VStack
      as="section"
      ref={ref as React.Ref<HTMLElement>}
      hAlign={hAlign}
      vAlign={vAlign}
      className={clsx('j13b-surface', 'j13b-card', styles.card, className)}
      {...props}
    >
      {children}
    </VStack>
  );
});
