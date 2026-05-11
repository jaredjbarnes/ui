import React from 'react';
import { clsx } from 'clsx';
import type { Size } from '../../utils/index.js';
import styles from './checkbox.module.css';

export interface CheckboxOwnProps {
  size?: Size;
  invalid?: boolean;
  /** Same semantics as Input. Default 'auto' since checkboxes are fixed-size. */
  width?: 'default' | 'auto' | 'fill' | string | number;
}

export type CheckboxProps = CheckboxOwnProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'width' | 'type'>;

const KEYWORD = new Set(['default', 'auto', 'fill']);

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    size = 'md',
    invalid = false,
    width = 'auto',
    disabled = false,
    checked,
    defaultChecked,
    onChange,
    className,
    style,
    ...rest
  },
  ref,
) {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState<boolean>(
    defaultChecked ?? false,
  );
  const isChecked = isControlled ? !!checked : internalChecked;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalChecked(event.target.checked);
    onChange?.(event);
  };

  const composedStyle: React.CSSProperties = { ...style };
  if (typeof width === 'number' || (typeof width === 'string' && !KEYWORD.has(width))) {
    composedStyle.width = width;
  }

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={isControlled ? checked : undefined}
      defaultChecked={!isControlled ? defaultChecked : undefined}
      onChange={handleChange}
      data-size={size}
      data-width={typeof width === 'string' && KEYWORD.has(width) ? width : undefined}
      data-is-checked={isChecked ? 'true' : 'false'}
      data-is-disabled={disabled ? 'true' : 'false'}
      data-is-invalid={invalid ? 'true' : 'false'}
      disabled={disabled}
      className={clsx(styles.checkbox, 'j13b-checkbox', 'j13b-atom', className)}
      style={composedStyle}
      {...rest}
    />
  );
});
