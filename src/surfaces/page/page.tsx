import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import styles from './page.module.css';

export interface PageOwnProps {}

export interface PageProps extends Omit<VStackProps, 'as'>, PageOwnProps {
  as?: VStackProps['as'];
}

/**
 * Page — root surface. Fills its container (typically the viewport) and is
 * the outermost place that establishes the four-variable vocabulary for the
 * tree underneath it. Themes redeclare on `.j13b-page` to set the page's
 * material; everything else cascades from there.
 */
export const Page = React.forwardRef<HTMLElement, PageProps>(function Page(
  { as = 'main', children, className, hAlign = 'start', vAlign = 'start', ...props },
  ref,
) {
  return (
    <VStack
      ref={ref}
      as={as}
      hAlign={hAlign}
      vAlign={vAlign}
      className={clsx('j13b-surface', 'j13b-page', styles.page, className)}
      {...props}
    >
      {children}
    </VStack>
  );
});
