import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import styles from './section.module.css';

export interface SectionOwnProps {}

export interface SectionProps extends Omit<VStackProps, 'as'>, SectionOwnProps {}

/**
 * Section — collapsible / hierarchical content region. Sections redeclare
 * `--material` *per nesting depth* via the theme's `.j13b-section >
 * .j13b-section` rules — a sub-section visually steps to a different palette
 * accent without any per-section prop.
 *
 * Pair with `Heading` and `Detail` for the canonical structure, or pass any
 * children directly.
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(function Section(
  { children, className, hAlign = 'start', vAlign = 'start', ...props },
  ref,
) {
  return (
    <VStack
      ref={ref}
      as="section"
      hAlign={hAlign}
      vAlign={vAlign}
      className={clsx('j13b-surface', 'j13b-section', styles.section, className)}
      {...props}
    >
      {children}
    </VStack>
  );
});
