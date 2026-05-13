import React, { createContext, useContext, useMemo } from 'react';

export interface TabsState {
  value: string;
  onChange?: (value: string) => void;
  minItemWidth?: number;
  maxItemWidth?: number;
}

export type TabsContextValue = TabsState;

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
 * Tabs — context provider for stateful tabs. Holds the selected value
 * and the onChange callback. Pair with `OverflowTabsNavbar` for the
 * pre-composed responsive bar, or compose `TabsBar` / `TabsList` /
 * `TabLink` directly to build a custom layout.
 */
export const Tabs: React.FC<TabsProps> = ({
  value,
  onChange,
  children,
  minItemWidth,
  maxItemWidth,
}) => {
  const contextValue = useMemo<TabsContextValue>(
    () => ({ value, onChange, minItemWidth, maxItemWidth }),
    [value, onChange, minItemWidth, maxItemWidth],
  );
  return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>;
};
