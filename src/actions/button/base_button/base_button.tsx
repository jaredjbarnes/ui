import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../../stacks/h_stack.js';
import type { Size } from '../../../utils/index.js';
import '../../../themes/primitives/interactive.css';
import styles from './base_button.module.css';

export interface BaseButtonOwnProps {
  size?: Size;
  /** Per-instance accent override; sets --j13b-button-color. */
  color?: string;
  /** Compact, icon-friendly mode. */
  utility?: boolean;
  disabled?: boolean;
}

export type BaseButtonProps = BaseButtonOwnProps &
  Omit<HStackProps, keyof BaseButtonOwnProps | 'as'> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonOwnProps | 'color'>;

export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  function BaseButton(
    {
      size = 'md',
      color,
      utility = false,
      disabled = false,
      className,
      style,
      children,
      onTouchStart,
      onContextMenu,
      ...rest
    },
    ref,
  ) {
    const composedStyle: React.CSSProperties = { ...style };
    if (color) {
      composedStyle['--j13b-button-color'] = color;
    }

    const handleTouchStart = (event: React.TouchEvent<HTMLButtonElement>) => {
      if (!onTouchStart) {
        event.preventDefault();
        return;
      }
      onTouchStart(event);
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!onContextMenu) {
        event.preventDefault();
        return;
      }
      onContextMenu(event);
    };

    return (
      <HStack
        ref={ref as React.Ref<HTMLElement>}
        as="button"
        inline
        vAlign="center"
        hAlign="center"
        width="auto"
        data-size={size}
        data-is-utility={utility ? 'true' : 'false'}
        data-is-disabled={disabled ? 'true' : 'false'}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        className={clsx(
          styles['base-button'],
          'j13b-interactive',
          'j13b-base-button',
          className,
        )}
        style={composedStyle}
        onTouchStart={handleTouchStart}
        onContextMenu={handleContextMenu}
        {...(rest as React.HTMLAttributes<HTMLElement>)}
      >
        {children}
      </HStack>
    );
  },
);
