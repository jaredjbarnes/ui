import React from 'react';
import { clsx } from 'clsx';
import { BaseButton, type BaseButtonProps } from '../base_button/base_button.js';
import type { Hierarchy } from '../../../utils/index.js';
import type { ActionSeverity } from '../../types.js';
import styles from './button.module.css';

export interface ButtonOwnProps {
  hierarchy?: Hierarchy;
  severity?: ActionSeverity;
}

export interface ButtonProps extends BaseButtonProps, ButtonOwnProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    hierarchy = 'secondary',
    severity = 'neutral',
    children,
    className,
    ...rest
  },
  ref,
) {
  return (
    <BaseButton
      ref={ref}
      data-hierarchy={hierarchy}
      data-severity={severity}
      className={clsx(styles.button, 'j13b-button', className)}
      {...rest}
    >
      {typeof children === 'string' ? (
        <span className={clsx('j13b-button-text')}>{children}</span>
      ) : (
        children
      )}
    </BaseButton>
  );
});
