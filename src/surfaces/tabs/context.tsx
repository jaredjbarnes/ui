import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Rectangle } from '../../utils/types/dimensions.js';

export interface TabsState {
  value: string;
  onChange?: (value: string) => void;
  minItemWidth?: number;
  maxItemWidth?: number;
}

export interface TabsContextValue extends TabsState {
  /** Rectangle of the active TabLink trigger — updated as items mount and
   *  resize. `TabsNavbar` reads this to drive an underline-indicator CSS
   *  animation. */
  activeTrigger: Rectangle | null;
  setActiveTrigger: (rect: Rectangle) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabs(): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be called inside a <Tabs> provider.');
  }
  return context;
}

export interface TabsProps {
  value: string;
  onChange?: (value: string) => void;
  /** Apply a minimum width to every TabItem in this group. */
  minItemWidth?: number;
  /** Apply a maximum width to every TabItem in this group. */
  maxItemWidth?: number;
  children?: React.ReactNode;
}

/**
 * Tabs — context provider for stateful tabs. Holds the selected value,
 * the onChange callback, and the rectangle of the currently-active
 * trigger (used by themes to animate an underline / pill indicator).
 *
 * Pair with `TabsNavbar` + `TabLink` for the wired-up version, or read
 * `useTabs()` directly to build a custom layout.
 */
export const Tabs: React.FC<TabsProps> = ({
  value,
  onChange,
  children,
  minItemWidth,
  maxItemWidth,
}) => {
  const [activeTrigger, setActiveTrigger] = useState<Rectangle | null>(null);
  const contextValue = useMemo<TabsContextValue>(
    () => ({
      value,
      onChange,
      activeTrigger,
      setActiveTrigger,
      minItemWidth,
      maxItemWidth,
    }),
    [value, onChange, activeTrigger, minItemWidth, maxItemWidth],
  );
  return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>;
};
