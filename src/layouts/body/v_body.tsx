import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import styles from './body.module.css';

export interface VBodyOwnProps {}

export interface VBodyProps extends Omit<VStackProps, 'as'>, VBodyOwnProps {
  as?: VStackProps['as'];
}

/**
 * VBody — vertical content slot inside a surface. The "body" of a Card,
 * Modal, Page, etc. Stacks children top-to-bottom and orchestrates nested
 * body sizing via the shared `j13b-body` cascade rules.
 *
 * VBody is a layout, not a surface — it does not redeclare `--material`. It
 * inherits the surrounding surface's vocabulary and just arranges content.
 */
export const VBody = React.forwardRef<HTMLElement, VBodyProps>(function VBody(
  { as = 'section', children, className, hAlign = 'start', vAlign = 'start', ...props },
  ref,
) {
  return (
    <VStack
      ref={ref}
      as={as}
      hAlign={hAlign}
      vAlign={vAlign}
      className={clsx('j13b-body', 'j13b-v-body', styles['v-body'], className)}
      {...props}
    >
      {children}
    </VStack>
  );
});
