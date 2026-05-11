import React from 'react';
import { clsx } from 'clsx';
import type { Size } from '../../utils/index.js';
import styles from './switch.module.css';

export interface SwitchOwnProps {
  size?: Size;
  invalid?: boolean;
  width?: 'default' | 'auto' | 'fill' | string | number;
}

export type SwitchProps = SwitchOwnProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'width' | 'type'>;

const KEYWORD = new Set(['default', 'auto', 'fill']);

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    size = 'md',
    invalid = false,
    width = 'auto',
    disabled = false,
    checked,
    defaultChecked,
    onChange,
    role = 'switch',
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
      role={role}
      checked={isControlled ? checked : undefined}
      defaultChecked={!isControlled ? defaultChecked : undefined}
      onChange={handleChange}
      data-size={size}
      data-width={typeof width === 'string' && KEYWORD.has(width) ? width : undefined}
      data-is-checked={isChecked ? 'true' : 'false'}
      data-is-disabled={disabled ? 'true' : 'false'}
      data-is-invalid={invalid ? 'true' : 'false'}
      aria-checked={isChecked}
      disabled={disabled}
      className={clsx(styles.switch, 'j13b-switch', 'j13b-atom', className)}
      style={composedStyle}
      {...rest}
    />
  );
});
