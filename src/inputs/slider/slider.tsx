import React from 'react';
import { clsx } from 'clsx';
import type { Size } from '../../utils/index.js';
import styles from './slider.module.css';

export interface SliderOwnProps {
  size?: Size;
  invalid?: boolean;
  /** Default 'default' since sliders typically span the row. */
  width?: 'default' | 'auto' | 'fill' | string | number;
}

export type SliderProps = SliderOwnProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'width' | 'type'>;

const KEYWORD = new Set(['default', 'auto', 'fill']);

function progressFor(value: number, min: number, max: number): string {
  if (max <= min) return '0%';
  const pct = ((value - min) / (max - min)) * 100;
  return `${Math.max(0, Math.min(100, pct))}%`;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    size = 'md',
    invalid = false,
    width = 'default',
    disabled = false,
    min: minProp,
    max: maxProp,
    value,
    defaultValue,
    onChange,
    className,
    style,
    ...rest
  },
  ref,
) {
  const min = Number(minProp ?? 0);
  const max = Number(maxProp ?? 100);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<number>(
    Number(defaultValue ?? min),
  );
  const currentValue = isControlled ? Number(value) : internalValue;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(Number(event.target.value));
    onChange?.(event);
  };

  // CSS-variable assignments below (e.g. `--progress`) compile against the
  // `*` index signature augmented onto CSSProperties in types/css_variables.d.ts,
  // so a plain CSSProperties is enough — no extra Record intersection needed.
  const composedStyle: React.CSSProperties = { ...style };
  if (typeof width === 'number' || (typeof width === 'string' && !KEYWORD.has(width))) {
    composedStyle.width = width;
  }
  composedStyle['--progress'] = progressFor(currentValue, min, max);

  return (
    <input
      ref={ref}
      type="range"
      min={minProp}
      max={maxProp}
      value={isControlled ? value : undefined}
      defaultValue={!isControlled ? defaultValue : undefined}
      onChange={handleChange}
      data-size={size}
      data-width={typeof width === 'string' && KEYWORD.has(width) ? width : undefined}
      data-is-disabled={disabled ? 'true' : 'false'}
      data-is-invalid={invalid ? 'true' : 'false'}
      disabled={disabled}
      className={clsx(styles.slider, 'j13b-slider', 'j13b-atom', className)}
      style={composedStyle}
      {...rest}
    />
  );
});
