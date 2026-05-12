import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import styles from './section.module.css';

export interface DetailOwnProps {}

export interface DetailProps extends VStackProps, DetailOwnProps {}

/**
 * Detail — the body region of a `Section`. Holds the content under a
 * `Heading`. Doesn't paint a different material from its Section; just
 * gives themes a stable selector for spacing/padding.
 */
export const Detail = React.forwardRef<HTMLElement, DetailProps>(function Detail(
  { children, className, hAlign = 'start', vAlign = 'start', ...props },
  ref,
) {
  return (
    <VStack
      ref={ref}
      hAlign={hAlign}
      vAlign={vAlign}
      className={clsx('j13b-detail', styles.detail, className)}
      {...props}
    >
      {children}
    </VStack>
  );
});
