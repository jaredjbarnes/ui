import React from 'react';
import { clsx } from 'clsx';
import type { Hierarchy, Size } from '../../utils/index.js';
import { Bar, type BarProps } from '../bar/bar.js';

export interface HeaderOwnProps {
  hierarchy?: Hierarchy;
  size?: Size;
}

export interface HeaderProps extends Omit<BarProps, 'as'>, HeaderOwnProps {}

/**
 * Header — top region of a surface. Themes redeclare the four-variable
 * vocabulary on `<surface> > .j13b-header` so a Header inside a Card looks
 * different from a Header inside a Modal.
 */
export const Header = React.forwardRef<HTMLElement, HeaderProps>(function Header(
  { hierarchy = 'secondary', size = 'md', children, className, ...props },
  ref,
) {
  return (
    <Bar
      ref={ref}
      as="header"
      className={clsx('j13b-header', className)}
      data-hierarchy={hierarchy}
      data-size={size}
      {...props}
    >
      {children}
    </Bar>
  );
});
