import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import type { Hierarchy } from '../../utils/index.js';
import styles from './sidebar.module.css';

export interface SidebarEndOwnProps {
  hierarchy?: Hierarchy;
}

export interface SidebarEndProps
  extends Omit<VStackProps, 'as'>,
    SidebarEndOwnProps {}

/**
 * SidebarEnd — persistent side-anchored surface at the inline-end edge.
 * Used for inspector panels, secondary detail views, or anything that
 * complements the main content from the end side.
 */
export const SidebarEnd = React.forwardRef<HTMLElement, SidebarEndProps>(
  function SidebarEnd(
    {
      hierarchy = 'secondary',
      children,
      className,
      hAlign = 'start',
      vAlign = 'start',
      width = '250px',
      ...props
    },
    ref,
  ) {
    return (
      <VStack
        ref={ref}
        as="aside"
        hAlign={hAlign}
        vAlign={vAlign}
        width={width}
        data-hierarchy={hierarchy}
        className={clsx(
          'j13b-surface',
          'j13b-sidebar',
          'j13b-sidebar-end',
          styles.sidebar,
          styles['sidebar-end'],
          className,
        )}
        {...props}
      >
        {children}
      </VStack>
    );
  },
);
