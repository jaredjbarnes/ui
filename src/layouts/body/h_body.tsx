import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';
import styles from './body.module.css';

export interface HBodyOwnProps {}

export interface HBodyProps extends Omit<HStackProps, 'as'>, HBodyOwnProps {
  as?: HStackProps['as'];
}

/**
 * HBody — horizontal content slot inside a surface. Two-pane layouts, image-
 * and-text, or any side-by-side content. Orchestrates nested body sizing via
 * the shared `j13b-body` cascade rules.
 *
 * HBody is a layout, not a surface — it does not redeclare `--material`.
 */
export const HBody = React.forwardRef<HTMLElement, HBodyProps>(function HBody(
  { as = 'section', children, className, hAlign = 'start', vAlign = 'start', ...props },
  ref,
) {
  return (
    <HStack
      ref={ref}
      as={as}
      hAlign={hAlign}
      vAlign={vAlign}
      className={clsx('j13b-body', 'j13b-h-body', styles['h-body'], className)}
      {...props}
    >
      {children}
    </HStack>
  );
});
