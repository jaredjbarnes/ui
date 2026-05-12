import React from 'react';
import { clsx } from 'clsx';
import { TabsBar, type TabsBarProps } from './tabs_bar.js';
import { TabsList } from './tabs_list.js';
import { useTabs } from './context.js';
import { convertRectangleToCssVariables } from '../../utils/css_utils.js';

export interface TabsNavbarProps extends TabsBarProps {}

/**
 * TabsNavbar — `TabsBar` + `TabsList` combo, with the active-trigger
 * rectangle published as `--tabs-active-rectangle-*` CSS variables. Themes
 * read those to drive an animated indicator (underline, pill) that
 * follows the selected tab.
 */
export const TabsNavbar = React.forwardRef<HTMLElement, TabsNavbarProps>(
  function TabsNavbar(
    { children, className, variant = 'default', style, ...props },
    ref,
  ) {
    const state = useTabs();
    const cssVariables = convertRectangleToCssVariables(
      'tabs',
      'active',
      state.activeTrigger,
    );

    return (
      <TabsBar
        ref={ref}
        variant={variant}
        style={{ ...cssVariables, ...style }}
        className={clsx('j13b-tabs-navbar', className)}
        {...props}
      >
        <TabsList>{children}</TabsList>
      </TabsBar>
    );
  },
);
