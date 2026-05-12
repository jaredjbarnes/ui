import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';
import styles from './tabs.module.css';

export type TabsBarVariant = 'default' | 'inline';

export interface TabsBarOwnProps {
  variant?: TabsBarVariant;
}

export interface TabsBarProps extends HStackProps, TabsBarOwnProps {}

/**
 * TabsBar — surface that hosts a `TabsList`. The `variant` prop emits
 * `data-variant`; themes paint the chrome (underline, separator, etc.)
 * per variant.
 */
export const TabsBar = React.forwardRef<HTMLElement, TabsBarProps>(function TabsBar(
  { children, className, variant = 'default', vAlign = 'center', ...props },
  ref,
) {
  return (
    <HStack
      ref={ref}
      vAlign={vAlign}
      data-variant={variant}
      className={clsx('j13b-surface', 'j13b-tabs-bar', styles['tabs-bar'], className)}
      {...props}
    >
      {children}
    </HStack>
  );
});
