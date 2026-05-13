import React, { useCallback } from 'react';
import { TabItem, type TabItemProps } from './tab_item.js';
import { useTabs } from './context.js';

export interface TabLinkOwnProps {
  value: string;
}

export interface TabLinkProps
  extends Omit<TabItemProps, 'selected' | 'value'>,
    TabLinkOwnProps {}

/**
 * TabLink — TabItem wired to the surrounding `<Tabs>` context. Reads its
 * selected state from the context and dispatches the context's `onChange`
 * on click.
 */
export const TabLink = React.forwardRef<HTMLButtonElement, TabLinkProps>(
  function TabLink(
    { children, value, onClick, minWidth, maxWidth, id, ...props },
    ref,
  ) {
    const state = useTabs();
    const isMatch = state.value === value;

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        state.onChange?.(value);
        onClick?.(event);
      },
      [state, value, onClick],
    );

    return (
      <TabItem
        ref={ref}
        selected={isMatch}
        onClick={handleClick}
        minWidth={state.minItemWidth ?? minWidth}
        maxWidth={state.maxItemWidth ?? maxWidth}
        id={id ?? `tab-${value}`}
        aria-controls={`tabpanel-${value}`}
        tabIndex={isMatch ? 0 : -1}
        {...props}
      >
        {children}
      </TabItem>
    );
  },
);
