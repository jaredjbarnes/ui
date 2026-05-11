import React from 'react';
import { clsx } from 'clsx';
import type { Size } from '../../utils/index.js';
import { RadioGroupContext } from './radio_context.js';
import styles from './radio.module.css';

export interface RadioOwnProps {
  size?: Size;
  invalid?: boolean;
  width?: 'default' | 'auto' | 'fill' | string | number;
  /** Value submitted up to the enclosing RadioGroup when selected. */
  value: string;
}

export type RadioProps = RadioOwnProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'width' | 'type' | 'value'>;

const KEYWORD = new Set(['default', 'auto', 'fill']);

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    size = 'md',
    invalid = false,
    width = 'auto',
    disabled: disabledProp,
    checked: checkedProp,
    name: nameProp,
    value,
    onChange,
    className,
    style,
    ...rest
  },
  ref,
) {
  const ctx = React.useContext(RadioGroupContext);

  const name = nameProp ?? ctx?.name;
  const disabled = disabledProp ?? ctx?.disabled ?? false;
  const isChecked =
    checkedProp !== undefined ? !!checkedProp : ctx ? ctx.value === value : undefined;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    if (event.target.checked) ctx?.onChange(value);
  };

  const composedStyle: React.CSSProperties = { ...style };
  if (typeof width === 'number' || (typeof width === 'string' && !KEYWORD.has(width))) {
    composedStyle.width = width;
  }

  return (
    <input
      ref={ref}
      type="radio"
      name={name}
      value={value}
      checked={isChecked}
      onChange={handleChange}
      data-size={size}
      data-width={typeof width === 'string' && KEYWORD.has(width) ? width : undefined}
      data-is-checked={isChecked ? 'true' : 'false'}
      data-is-disabled={disabled ? 'true' : 'false'}
      data-is-invalid={invalid ? 'true' : 'false'}
      disabled={disabled}
      className={clsx(styles.radio, 'j13b-radio', 'j13b-atom', className)}
      style={composedStyle}
      {...rest}
    />
  );
});
