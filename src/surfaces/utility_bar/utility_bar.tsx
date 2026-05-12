import React from 'react';
import { clsx } from 'clsx';
import type { Hierarchy, Size } from '../../utils/index.js';
import { Bar, type BarProps } from '../bar/bar.js';

export interface UtilityBarOwnProps {
  hierarchy?: Hierarchy;
  size?: Size;
}

export interface UtilityBarProps extends Omit<BarProps, 'as'>, UtilityBarOwnProps {}

/**
 * UtilityBar — secondary action strip, typically placed below a Header for
 * tools, filters, or breadcrumbs. Same shape as Header but a distinct class
 * hook so themes can paint it differently (less prominent than the Header).
 */
export const UtilityBar = React.forwardRef<HTMLElement, UtilityBarProps>(
  function UtilityBar(
    { hierarchy = 'secondary', size = 'md', children, className, ...props },
    ref,
  ) {
    return (
      <Bar
        ref={ref}
        as="div"
        className={clsx('j13b-utility-bar', className)}
        data-hierarchy={hierarchy}
        data-size={size}
        {...props}
      >
        {children}
      </Bar>
    );
  },
);
