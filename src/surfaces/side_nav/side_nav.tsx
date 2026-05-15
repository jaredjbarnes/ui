import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import styles from './side_nav.module.css';

export interface SideNavOwnProps {}

export interface SideNavProps extends Omit<VStackProps, 'as'>, SideNavOwnProps {}

/**
 * SideNav — the app-level vertical navigation rail. Semantically a
 * `<nav>` element; visually mirrors `Sidebar`'s chrome (themes share
 * the paint via grouped selectors).
 *
 * Distinct from `Sidebar`, which is the generic side-anchored rail used
 * for filters, inspectors, or any non-nav chrome. Reach for `SideNav`
 * specifically when the rail carries route navigation.
 *
 * Compose with `NavItem` children for the nav targets; the cascade
 * handles the active-state visual emphasis based on whether the SideNav
 * sits at the page level (loud) or inside a Panel (quieter). Card is for
 * inline content, not nav — don't reach for SideNav-in-Card.
 */
export const SideNav = React.forwardRef<HTMLElement, SideNavProps>(function SideNav(
  {
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
      as="nav"
      hAlign={hAlign}
      vAlign={vAlign}
      width={width}
      className={clsx('j13b-surface', 'j13b-side-nav', styles['side-nav'], className)}
      {...props}
    >
      {children}
    </VStack>
  );
});
