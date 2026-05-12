import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import styles from './aside.module.css';

export interface AsideOwnProps {}

export interface AsideProps extends Omit<VStackProps, 'as'>, AsideOwnProps {}

/**
 * Aside — side-anchored persistent surface. Renders as a semantic `<aside>`
 * by default. Use for tangentially related content (sidebars, helper panels)
 * that should sit next to the main content rather than inside it.
 */
export const Aside = React.forwardRef<HTMLElement, AsideProps>(function Aside(
  { children, className, hAlign = 'start', vAlign = 'start', ...props },
  ref,
) {
  return (
    <VStack
      ref={ref}
      as="aside"
      hAlign={hAlign}
      vAlign={vAlign}
      className={clsx('j13b-surface', 'j13b-aside', styles.aside, className)}
      {...props}
    >
      {children}
    </VStack>
  );
});
