import React from 'react';
import { clsx } from 'clsx';
import type { Size } from '../../utils/index.js';
import { Bar, type BarProps } from '../bar/bar.js';

export interface NavBarOwnProps {
  size?: Size;
}

export interface NavBarProps extends Omit<BarProps, 'as'>, NavBarOwnProps {}

/**
 * NavBar — the app-level horizontal navigation surface. Semantically a
 * `<nav>` element; visually mirrors `Header`'s chrome (themes share the
 * paint via grouped selectors).
 *
 * Distinct from `Header`, which is a generic chrome strip. Reach for
 * `NavBar` when the strip carries route navigation; use `Header` for
 * a card's title bar, a modal's chrome row, or any non-nav top strip.
 *
 * Compose with `NavItem` children for nav targets; `Spacer`, `Button`,
 * `Title`, etc. for brand and actions.
 */
export const NavBar = React.forwardRef<HTMLElement, NavBarProps>(function NavBar(
  { size = 'md', children, className, ...props },
  ref,
) {
  return (
    <Bar
      ref={ref}
      as="nav"
      className={clsx('j13b-nav-bar', className)}
      data-size={size}
      {...props}
    >
      {children}
    </Bar>
  );
});
