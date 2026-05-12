import React from 'react';
import { useTabs } from './context.js';

export interface TabProps {
  value: string;
  children?: React.ReactNode;
}

/**
 * Tab — renders its children as a tabpanel when the active Tabs `value`
 * matches `value`. Wraps the panel content in a `<div role="tabpanel">`
 * with linked id + aria-labelledby so the WAI-ARIA tabs pattern is wired
 * end to end.
 */
export const Tab: React.FC<TabProps> = ({ value, children }) => {
  const state = useTabs();
  if (state.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
    >
      {children}
    </div>
  );
};
