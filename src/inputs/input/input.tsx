import React from 'react';
import { clsx } from 'clsx';
import type { Size } from '../../utils/index.js';
import styles from './input.module.css';

export interface InputOwnProps {
  size?: Size;
  /** Visual error state. */
  invalid?: boolean;
  /**
   * Same semantics as on a stack child:
   *   `'default'` — fit context (grow inside an HStack, fill cross-axis in a
   *   VStack, browser default outside any stack).
   *   `'auto'` — content-sized.
   *   `'fill'` — explicit grow.
   *   Or a literal CSS width.
   */
  width?: 'default' | 'auto' | 'fill' | string | number;
}

export type InputProps = InputOwnProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'width'>;

const KEYWORD = new Set(['default', 'auto', 'fill']);

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    invalid = false,
    width = 'default',
    disabled = false,
    className,
    style,
    ...rest
  },
  ref,
) {
  const composedStyle: React.CSSProperties = { ...style };
  // Literal widths (number or non-keyword string) become inline styles.
  // Keyword widths flow through the data attribute and are resolved by
  // the parent stack's CSS rules.
  if (typeof width === 'number' || (typeof width === 'string' && !KEYWORD.has(width))) {
    composedStyle.width = width;
  }

  return (
    <input
      ref={ref}
      data-size={size}
      data-width={typeof width === 'string' && KEYWORD.has(width) ? width : undefined}
      data-is-disabled={disabled ? 'true' : 'false'}
      data-is-invalid={invalid ? 'true' : 'false'}
      disabled={disabled}
      className={clsx(styles.input, 'j13b-input', 'j13b-atom', className)}
      style={composedStyle}
      {...rest}
    />
  );
});
