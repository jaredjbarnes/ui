import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import type { Hierarchy } from '../../utils/index.js';
import styles from './sidebar.module.css';

export interface SidebarStartOwnProps {
  hierarchy?: Hierarchy;
}

export interface SidebarStartProps
  extends Omit<VStackProps, 'as'>,
    SidebarStartOwnProps {}

/**
 * SidebarStart — persistent side-anchored surface at the inline-start edge.
 * Holds primary navigation, filters, or other secondary chrome. The
 * `hierarchy` prop maps to `data-hierarchy` so themes can paint nested
 * sidebars at progressively quieter weights.
 */
export const SidebarStart = React.forwardRef<HTMLElement, SidebarStartProps>(
  function SidebarStart(
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
          'j13b-sidebar-start',
          styles.sidebar,
          styles['sidebar-start'],
          className,
        )}
        {...props}
      >
        {children}
      </VStack>
    );
  },
);
