import React from 'react';
import { clsx } from 'clsx';
import type { Size } from '../../utils/index.js';
import styles from './textarea.module.css';

export interface TextareaOwnProps {
  size?: Size;
  invalid?: boolean;
  /**
   * Same semantics as Input — see input.tsx.
   */
  width?: 'default' | 'auto' | 'fill' | string | number;
}

export type TextareaProps = TextareaOwnProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'width'>;

const KEYWORD = new Set(['default', 'auto', 'fill']);

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      size = 'md',
      invalid = false,
      width = 'default',
      disabled = false,
      rows = 3,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const composedStyle: React.CSSProperties = { ...style };
    if (typeof width === 'number' || (typeof width === 'string' && !KEYWORD.has(width))) {
      composedStyle.width = width;
    }

    return (
      <textarea
        ref={ref}
        rows={rows}
        data-size={size}
        data-width={typeof width === 'string' && KEYWORD.has(width) ? width : undefined}
        data-is-disabled={disabled ? 'true' : 'false'}
        data-is-invalid={invalid ? 'true' : 'false'}
        disabled={disabled}
        className={clsx(styles.textarea, 'j13b-textarea', 'j13b-atom', className)}
        style={composedStyle}
        {...rest}
      />
    );
  },
);
