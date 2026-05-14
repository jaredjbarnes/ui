import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import styles from './aside.module.css';

export interface AsideOwnProps {}

export interface AsideProps extends Omit<VStackProps, 'as'>, AsideOwnProps {}

/**
 * Aside — inline tangential content. Renders as a semantic `<aside>`.
 *
 * Use for content that's *related but secondary* to the surrounding flow:
 * pull quotes, callouts, related-link blocks, helper notes that sit
 * between or beside paragraphs in an article-style layout.
 *
 * For the app-shell side rail (persistent navigation chrome anchored to an
 * edge of an HBody), use `Sidebar` instead — that's a distinct surface
 * with positional variants (`SidebarStart` / `SidebarEnd`).
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
