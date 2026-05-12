import React, { useCallback } from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';
import styles from './tabs.module.css';

export interface TabsListProps extends HStackProps {}

function navigateTabs(event: React.KeyboardEvent<HTMLElement>) {
  const list = event.currentTarget;
  const tabs = Array.from(
    list.querySelectorAll<HTMLElement>(':scope > [role="tab"]'),
  );
  const currentTab = list.querySelector(':focus') as HTMLElement | null;
  const currentIndex = currentTab ? tabs.indexOf(currentTab) : -1;
  if (currentIndex === -1) return;

  let newIndex = 0;
  switch (event.key) {
    case 'ArrowRight':
      newIndex = (currentIndex + 1) % tabs.length;
      break;
    case 'ArrowLeft':
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      break;
    case 'Home':
      newIndex = 0;
      break;
    case 'End':
      newIndex = tabs.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  event.stopPropagation();
  tabs[newIndex]?.focus();
}

/**
 * TabsList — the `role="tablist"` container that holds `TabItem`s.
 * Handles arrow-left/right + Home/End keyboard navigation between tab
 * triggers, matching the WAI-ARIA tabs pattern.
 */
export const TabsList = React.forwardRef<HTMLElement, TabsListProps>(function TabsList(
  { children, className, role = 'tablist', onKeyDown, ...props },
  ref,
) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      navigateTabs(event);
      onKeyDown?.(event);
    },
    [onKeyDown],
  );

  return (
    <HStack
      ref={ref}
      as="div"
      role={role}
      onKeyDown={handleKeyDown}
      className={clsx('j13b-tabs-list', styles['tabs-list'], className)}
      {...props}
    >
      {children}
    </HStack>
  );
});
