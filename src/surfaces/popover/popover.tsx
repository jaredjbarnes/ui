import React, { useRef } from 'react';
import { clsx } from 'clsx';
import { ElementTethered } from '../../overlay/tethered/element_tethered.js';
import type { BaseTetheredOwnProps } from '../../overlay/tethered/tethered.js';
import { ClickAwayListener } from '../../utils/listeners/click_away_listener.js';
import styles from './popover.module.css';

export interface PopoverOwnProps extends BaseTetheredOwnProps {
  /** Whether the popover is visible. */
  isOpen: boolean;
  /** Ref to the trigger element to anchor against. */
  anchorElement: React.RefObject<HTMLElement | null>;
  /** Called when a click happens outside the popover and trigger. */
  onDismiss?: () => void;
  /** If true, skip the click-away listener (caller manages dismissal). */
  disableClickAway?: boolean;
}

export type PopoverProps = PopoverOwnProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof PopoverOwnProps>;

/**
 * Popover — tethered interactive surface. Controlled `isOpen`. Renders into
 * a portal anchored to `anchorElement`, dismisses on click outside the
 * popover and trigger (Escape works at the consumer level).
 *
 * For specialized variants: a hover trigger lives in `Tooltip`, a
 * confirm-prompt variant lives in `PopConfirm`. Both compose on Popover.
 */
export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    isOpen,
    anchorElement,
    onDismiss,
    disableClickAway = false,
    children,
    className,
    verticalAnchor = 'bottom',
    verticalOrigin = 'top',
    horizontalAnchor = 'start',
    horizontalOrigin = 'start',
    verticalOffset = 4,
    horizontalOffset = 0,
    ...rest
  },
  ref,
) {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const mergedRef = (el: HTMLDivElement | null) => {
    popoverRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  if (!isOpen) return null;

  const content = (
    <ElementTethered
      ref={mergedRef}
      anchorElement={anchorElement}
      role="dialog"
      verticalAnchor={verticalAnchor}
      verticalOrigin={verticalOrigin}
      horizontalAnchor={horizontalAnchor}
      horizontalOrigin={horizontalOrigin}
      verticalOffset={verticalOffset}
      horizontalOffset={horizontalOffset}
      className={clsx('j13b-surface', 'j13b-popover', styles.popover, className)}
      {...rest}
    >
      {children}
    </ElementTethered>
  );

  if (disableClickAway || !onDismiss) {
    return content;
  }

  return (
    <ClickAwayListener
      onClickAway={() => onDismiss()}
      refs={anchorElement ? [anchorElement] : []}
    >
      {content}
    </ClickAwayListener>
  );
});
