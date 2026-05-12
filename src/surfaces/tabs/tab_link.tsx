import React, { useCallback, useLayoutEffect } from 'react';
import { TabItem, type TabItemProps } from './tab_item.js';
import { useTabs } from './context.js';
import { useTrackActiveItemRectangle } from '../../utils/css_utils.js';
import { useForkRef } from '../../utils/hooks/use_fork_ref.js';

export interface TabLinkOwnProps {
  value: string;
}

export interface TabLinkProps
  extends Omit<TabItemProps, 'selected' | 'value'>,
    TabLinkOwnProps {}

/**
 * TabLink — TabItem wired to the surrounding `<Tabs>` context. Reads its
 * selected state from the context, dispatches the context's `onChange` on
 * click, and publishes its trigger rectangle so `TabsNavbar` can animate
 * an underline / pill indicator over the active item.
 */
export const TabLink = React.forwardRef<HTMLButtonElement, TabLinkProps>(
  function TabLink(
    { children, value, onClick, minWidth, maxWidth, id, ...props },
    forwardedRef,
  ) {
    const state = useTabs();
    const isMatch = state.value === value;
    const { ref: trackingRef, rectangle } = useTrackActiveItemRectangle(isMatch);
    const mergedRef = useForkRef<HTMLButtonElement>(
      trackingRef as React.Ref<HTMLButtonElement>,
      forwardedRef,
    );

    useLayoutEffect(() => {
      if (isMatch && rectangle) {
        state.setActiveTrigger(rectangle);
      }
    }, [isMatch, rectangle, state]);

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        state.onChange?.(value);
        onClick?.(event);
      },
      [state, value, onClick],
    );

    return (
      <TabItem
        ref={mergedRef}
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
