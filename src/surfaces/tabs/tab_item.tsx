import React from 'react';
import { clsx } from 'clsx';
import { Toggle, type ToggleProps } from '../../actions/toggle/toggle.js';
import styles from './tabs.module.css';

export interface TabItemOwnProps {
  selected?: boolean;
}

export interface TabItemProps extends Omit<ToggleProps, 'selected'>, TabItemOwnProps {}

/**
 * TabItem — single clickable tab trigger. Built on `Toggle` so the
 * selected/unselected state flips through the existing interactive
 * grammar (Toggle handles `data-is-selected`, `aria-pressed`).
 *
 * The `role="tab"` default lets `TabsList`'s keyboard nav find this item.
 */
export const TabItem = React.forwardRef<HTMLButtonElement, TabItemProps>(
  function TabItem({ children, className, role = 'tab', selected = false, ...props }, ref) {
    return (
      <Toggle
        ref={ref}
        role={role}
        selected={selected}
        className={clsx('j13b-tab-item', styles['tab-item'], className)}
        {...props}
      >
        {children}
      </Toggle>
    );
  },
);
