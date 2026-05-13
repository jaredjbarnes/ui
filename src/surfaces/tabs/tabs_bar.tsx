import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';
import styles from './tabs.module.css';

export type TabsBarOwnProps = Record<string, never>;

export interface TabsBarProps extends HStackProps {}

/**
 * TabsBar — surface that hosts a `TabsList`. Themes paint the chrome
 * (background, divider, padding) on `.j13b-tabs-bar`.
 */
export const TabsBar = React.forwardRef<HTMLElement, TabsBarProps>(function TabsBar(
  { children, className, vAlign = 'center', ...props },
  ref,
) {
  return (
    <HStack
      ref={ref}
      vAlign={vAlign}
      className={clsx('j13b-surface', 'j13b-tabs-bar', styles['tabs-bar'], className)}
      {...props}
    >
      {children}
    </HStack>
  );
});
