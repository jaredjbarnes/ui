import React from 'react';
import { clsx } from 'clsx';
import styles from './divider.module.css';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      data-orientation={orientation}
      className={clsx(styles.divider, 'j13b-divider', className)}
      {...rest}
    />
  );
});
