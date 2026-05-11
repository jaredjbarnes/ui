import React from 'react';
import { clsx } from 'clsx';
import { Button, type ButtonProps } from '../button/button/button.js';
import styles from './toggle.module.css';

export interface ToggleOwnProps {
  /** Controlled selected state. */
  selected?: boolean;
  /** Initial selected state for uncontrolled use. Default false. */
  defaultSelected?: boolean;
  /** Fires whenever the user toggles the button. */
  onSelectedChange?: (selected: boolean) => void;
}

/**
 * A two-state button. Visually flips between the secondary outline (off) and
 * the primary filled (on) using Button's existing hierarchy grammar — the
 * theme provides one fewer thing to maintain.
 *
 * `hierarchy` is intentionally excluded from props: the toggle owns it and
 * a consumer override would just look like an off/on inconsistency.
 */
export type ToggleProps = ToggleOwnProps &
  Omit<ButtonProps, keyof ToggleOwnProps | 'hierarchy'>;

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    selected,
    defaultSelected = false,
    onSelectedChange,
    className,
    onClick,
    ...rest
  },
  ref,
) {
  const isControlled = selected !== undefined;
  const [internalSelected, setInternalSelected] = React.useState<boolean>(defaultSelected);
  const isSelected = isControlled ? !!selected : internalSelected;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const next = !isSelected;
    if (!isControlled) setInternalSelected(next);
    onSelectedChange?.(next);
  };

  // Spread `rest` first so toggle-controlled props (hierarchy, aria-pressed,
  // data-is-selected, className, onClick, ref) win over anything an outer
  // wrapper (e.g. ButtonGroup's cloneElement) might inject.
  return (
    <Button
      {...rest}
      ref={ref}
      hierarchy={isSelected ? 'primary' : 'secondary'}
      data-is-selected={isSelected ? 'true' : 'false'}
      aria-pressed={isSelected}
      className={clsx(styles.toggle, 'j13b-toggle', className)}
      onClick={handleClick}
    />
  );
});
