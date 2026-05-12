import React, { useRef, useState } from 'react';
import { clsx } from 'clsx';
import { ElementTethered } from '../../overlay/tethered/element_tethered.js';
import type { BaseTetheredOwnProps } from '../../overlay/tethered/tethered.js';
import { useForkRef } from '../../utils/hooks/use_fork_ref.js';
import styles from './tooltip.module.css';

export interface TooltipOwnProps extends BaseTetheredOwnProps {
  /** The trigger element. Cloned to capture its ref. */
  children: React.ReactElement<{ ref?: React.Ref<HTMLElement> }>;
  /** Content rendered inside the tooltip. Strings are auto-wrapped in
   *  `.j13b-tooltip-label` so the theme can paint the bubble around them. */
  label: React.ReactNode;
  /** Delay (ms) before the tooltip appears. Default 200. */
  openDelay?: number;
  /** Delay (ms) before the tooltip disappears. Default 0. */
  closeDelay?: number;
}

export type TooltipProps = TooltipOwnProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof TooltipOwnProps>;

/**
 * Tooltip — tethered hint surface. Wraps a trigger child, captures its ref,
 * shows the `label` content on hover (with delay) and focus. Closes on
 * blur, mouse-leave, or Escape.
 *
 * Defaults: vertical anchor `top`, vertical origin `bottom` — tooltip
 * appears *above* the trigger. Override via the tether props.
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  {
    children,
    label,
    className,
    verticalAnchor = 'top',
    verticalOrigin = 'bottom',
    horizontalAnchor = 'center',
    horizontalOrigin = 'center',
    verticalOffset = 4,
    horizontalOffset = 0,
    openDelay = 200,
    closeDelay = 0,
    ...rest
  },
  ref,
) {
  const anchorRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);

  const open = () => {
    window.clearTimeout(closeTimer.current);
    openTimer.current = window.setTimeout(() => setIsOpen(true), openDelay);
  };
  const close = () => {
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setIsOpen(false), closeDelay);
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Clone the trigger to attach our ref and the hover/focus handlers
  // without forcing consumers to forward a ref themselves.
  const childRef = (children.props as { ref?: React.Ref<HTMLElement> }).ref;
  const mergedRef = useForkRef<HTMLElement>(anchorRef, childRef);
  const trigger = React.cloneElement(children, {
    ref: mergedRef,
    onMouseEnter: open,
    onMouseLeave: close,
    onFocus: open,
    onBlur: close,
  } as React.HTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLElement> });

  return (
    <>
      {trigger}
      {isOpen && (
        <ElementTethered
          ref={ref}
          anchorElement={anchorRef}
          role="tooltip"
          verticalAnchor={verticalAnchor}
          verticalOrigin={verticalOrigin}
          horizontalAnchor={horizontalAnchor}
          horizontalOrigin={horizontalOrigin}
          verticalOffset={verticalOffset}
          horizontalOffset={horizontalOffset}
          className={clsx('j13b-surface', 'j13b-tooltip', styles.tooltip, className)}
          {...rest}
        >
          {typeof label === 'string' ? (
            <span className="j13b-tooltip-label">{label}</span>
          ) : (
            label
          )}
        </ElementTethered>
      )}
    </>
  );
});
