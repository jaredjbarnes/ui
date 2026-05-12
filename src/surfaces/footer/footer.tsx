import React from 'react';
import { clsx } from 'clsx';
import type { Hierarchy, Size } from '../../utils/index.js';
import { Bar, type BarProps } from '../bar/bar.js';

export interface FooterOwnProps {
  hierarchy?: Hierarchy;
  size?: Size;
}

export interface FooterProps extends Omit<BarProps, 'as'>, FooterOwnProps {}

/**
 * Footer — bottom region of a surface. Like Header, themes redeclare the
 * vocabulary per surrounding surface; the component just emits the class.
 */
export const Footer = React.forwardRef<HTMLElement, FooterProps>(function Footer(
  { hierarchy = 'secondary', size = 'md', children, className, ...props },
  ref,
) {
  return (
    <Bar
      ref={ref}
      as="footer"
      className={clsx('j13b-footer', className)}
      data-hierarchy={hierarchy}
      data-size={size}
      {...props}
    >
      {children}
    </Bar>
  );
});
