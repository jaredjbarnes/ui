import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';
import styles from './section.module.css';

export interface HeadingOwnProps {}

export interface HeadingProps extends HStackProps, HeadingOwnProps {}

/**
 * Heading — the title row of a `Section`. HStack-shaped so titles and trailing
 * controls (toggle buttons, action buttons) sit on one line. Themes paint the
 * Heading's material based on its containing Section's depth.
 */
export const Heading = React.forwardRef<HTMLElement, HeadingProps>(function Heading(
  { children, className, vAlign = 'center', ...props },
  ref,
) {
  return (
    <HStack
      ref={ref}
      vAlign={vAlign}
      className={clsx('j13b-heading', styles.heading, className)}
      {...props}
    >
      {children}
    </HStack>
  );
});
