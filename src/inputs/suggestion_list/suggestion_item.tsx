import React from 'react';
import { clsx } from 'clsx';
import '../../themes/primitives/interactive.css';
import styles from './suggestion_list.module.css';

export interface SuggestionItemOwnProps {
  value: string;
  isSelected?: boolean;
  /** Pseudo-focus from arrow-key navigation (real focus stays on the trigger). */
  isFocused?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export type SuggestionItemProps = SuggestionItemOwnProps &
  Omit<React.LiHTMLAttributes<HTMLLIElement>, keyof SuggestionItemOwnProps>;

export const SuggestionItem = React.forwardRef<HTMLLIElement, SuggestionItemProps>(
  function SuggestionItem(
    { value, isSelected, isFocused, disabled, className, children, ...rest },
    ref,
  ) {
    return (
      <li
        ref={ref}
        role="option"
        aria-selected={isSelected || undefined}
        aria-disabled={disabled || undefined}
        data-value={value}
        data-is-selected={isSelected ? 'true' : 'false'}
        data-is-focused={isFocused ? 'true' : 'false'}
        data-is-disabled={disabled ? 'true' : 'false'}
        className={clsx(
          styles['suggestion-item'],
          'j13b-suggestion-item',
          'j13b-interactive',
          className,
        )}
        {...rest}
      >
        {children}
      </li>
    );
  },
);
