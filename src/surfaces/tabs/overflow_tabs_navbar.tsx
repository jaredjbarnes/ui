import React, {
  useCallback,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { clsx } from 'clsx';
import { TabsBar } from './tabs_bar.js';
import { TabsList } from './tabs_list.js';
import { TabItem } from './tab_item.js';
import { useTabs } from './context.js';
import { Popover } from '../popover/popover.js';
import { VStack } from '../../stacks/v_stack.js';
import { useResizeObserver } from '../../utils/hooks/use_resize_observer.js';
import {
  convertRectangleToCssVariables,
  useTrackActiveItemRectangle,
} from '../../utils/css_utils.js';
import { useForkRef } from '../../utils/hooks/use_fork_ref.js';
import styles from './tabs.module.css';

export interface OverflowTabsNavbarItem {
  value: string;
  label: React.ReactNode;
}

export interface OverflowTabsNavbarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  items: OverflowTabsNavbarItem[];
  /** Fallback label for the More trigger when no overflow item is selected. */
  moreLabel?: React.ReactNode;
  /** Inline gap between tab items — must match the layout gap so the
   *  cutoff math accounts for it exactly. Defaults to 4 to match the
   *  midnight theme's `.j13b-tabs-list` gap. */
  gap?: number;
}

const Chevron = () => (
  <svg
    aria-hidden="true"
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles['more-chevron']}
  >
    <polyline points="2,4 5,7 8,4" />
  </svg>
);

interface OverflowItemProps {
  item: OverflowTabsNavbarItem;
  isOverflow: boolean;
  onMeasureWidth: (width: number) => void;
}

/**
 * A single tab inside the overflow navbar. Stays in the DOM even when it
 * overflows (CSS handles the hiding via `data-is-overflow`), so its natural
 * width remains measurable for the cutoff algorithm.
 */
function OverflowItem({ item, isOverflow, onMeasureWidth }: OverflowItemProps) {
  const state = useTabs();
  const isMatch = state.value === item.value;
  const shouldTrack = isMatch && !isOverflow;
  const { ref: trackRef, rectangle } = useTrackActiveItemRectangle(shouldTrack);

  useLayoutEffect(() => {
    if (shouldTrack && rectangle) state.setActiveTrigger(rectangle);
  }, [shouldTrack, rectangle, state]);

  const measureRef = useResizeObserver<HTMLButtonElement>(
    (w) => onMeasureWidth(w),
    'width',
  );

  const mergedRef = useForkRef<HTMLButtonElement>(
    trackRef as React.Ref<HTMLButtonElement>,
    measureRef,
  );

  return (
    <TabItem
      ref={mergedRef}
      selected={isMatch}
      onClick={() => state.onChange?.(item.value)}
      data-is-overflow={isOverflow ? 'true' : 'false'}
      tabIndex={isOverflow ? -1 : isMatch ? 0 : -1}
      aria-hidden={isOverflow ? 'true' : undefined}
      id={`tab-${item.value}`}
      aria-controls={`tabpanel-${item.value}`}
    >
      {item.label}
    </TabItem>
  );
}

/**
 * OverflowTabsNavbar — measurement-driven tab strip. Every tab is always
 * rendered (so the bar's ResizeObserver-driven cutoff math always has a
 * live width per item), but tabs that don't fit are pulled out of flow via
 * `position: absolute; visibility: hidden; pointer-events: none`. They keep
 * their natural width so when the bar widens again the cutoff recomputes
 * without ever going through a stuck-at-zero phase.
 *
 * A More trigger appears just before the cutoff. It takes the label of the
 * currently-selected hidden tab when one is selected (so the active item is
 * always visible), or falls back to `moreLabel` otherwise. A chevron is
 * always present so the dropdown affordance reads independent of the label.
 *
 * The popover lists the overflowing items with the selected one marked.
 */
export function OverflowTabsNavbar({
  items,
  moreLabel = 'More',
  gap = 4,
  className,
  style,
  ...props
}: OverflowTabsNavbarProps) {
  const state = useTabs();
  const [, force] = useReducer((x: number) => x + 1, 0);
  const itemWidths = useRef<number[]>([]);
  // Measured on the TabsList rather than the TabsBar — TabsList has no
  // padding, so its border-box width IS exactly the inline area items can
  // occupy. Using the bar's width would include its `padding-inline` and
  // overestimate available space, pushing More past the visible edge.
  const [listWidth, setListWidth] = useState(0);
  // Reserve a reasonable More slot upfront so the cutoff math doesn't
  // briefly think there's more space than there is between first paint
  // and the More trigger's first ResizeObserver fire.
  const [moreWidth, setMoreWidth] = useState(80);
  const [open, setOpen] = useState(false);
  const moreRef = useRef<HTMLButtonElement | null>(null);

  const listResizeRef = useResizeObserver<HTMLElement>(
    (w) => setListWidth(w),
    'width',
  );
  const moreResizeRef = useResizeObserver<HTMLButtonElement>(
    (w) => setMoreWidth(w),
    'width',
  );

  const onItemMeasure = useCallback((i: number, w: number) => {
    if (itemWidths.current[i] !== w) {
      itemWidths.current[i] = w;
      force();
    }
  }, []);

  // Greedy cutoff: include items left-to-right; if including the next item
  // (plus a reserved More slot when any items remain after it) exceeds the
  // bar width, that's where overflow starts. Items with width 0 haven't
  // measured yet — treat as zero-cost so the first paint shows everything,
  // then ResizeObserver fills in widths and a second pass settles the layout.
  const cutoff = (() => {
    if (listWidth === 0) return items.length;
    let used = 0;
    for (let i = 0; i < items.length; i++) {
      const itemW = itemWidths.current[i] ?? 0;
      const remaining = items.length - i - 1;
      const moreCost = remaining > 0 ? gap + moreWidth : 0;
      const itemCost = i === 0 ? itemW : gap + itemW;
      if (used + itemCost + moreCost > listWidth) return i;
      used += itemCost;
    }
    return items.length;
  })();

  const activeIndex = items.findIndex((it) => it.value === state.value);
  const hasOverflow = cutoff < items.length;
  const activeIsHidden = activeIndex >= cutoff && activeIndex >= 0;
  const moreDisplayLabel =
    activeIsHidden && items[activeIndex] ? items[activeIndex].label : moreLabel;

  // When an overflow item is selected, the More trigger reports its own
  // rectangle as the active rectangle so the animated underline lands on
  // More instead of the hidden tab's now-meaningless position.
  const { ref: moreTrackRef, rectangle: moreRect } =
    useTrackActiveItemRectangle(activeIsHidden);
  useLayoutEffect(() => {
    if (activeIsHidden && moreRect) state.setActiveTrigger(moreRect);
  }, [activeIsHidden, moreRect, state]);

  const moreMergedRef = useForkRef<HTMLButtonElement>(
    moreResizeRef,
    moreTrackRef as React.Ref<HTMLButtonElement>,
    (el) => {
      moreRef.current = el;
    },
  );

  const cssVariables = convertRectangleToCssVariables(
    'tabs',
    'active',
    state.activeTrigger,
  );

  return (
    <>
      <TabsBar
        style={{ ...cssVariables, ...style }}
        className={clsx('j13b-tabs-navbar', className)}
        {...props}
      >
        <TabsList ref={listResizeRef}>
          {items.map((item, i) => (
            <OverflowItem
              key={item.value}
              item={item}
              isOverflow={i >= cutoff}
              onMeasureWidth={(w) => onItemMeasure(i, w)}
            />
          ))}
          {hasOverflow && (
            <TabItem
              ref={moreMergedRef}
              selected={activeIsHidden}
              onClick={() => setOpen((o) => !o)}
              data-is-more="true"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              {moreDisplayLabel}
              <Chevron />
            </TabItem>
          )}
        </TabsList>
      </TabsBar>
      {hasOverflow && (
        <Popover
          isOpen={open}
          anchorElement={moreRef}
          onDismiss={() => setOpen(false)}
        >
          <VStack
            role="menu"
            className={clsx(styles['more-menu'], 'j13b-tabs-more-menu')}
          >
            {items.slice(cutoff).map((item) => (
              <button
                key={item.value}
                type="button"
                role="menuitem"
                onClick={() => {
                  state.onChange?.(item.value);
                  setOpen(false);
                }}
                data-is-selected={
                  state.value === item.value ? 'true' : 'false'
                }
                className={clsx(
                  styles['more-menu-item'],
                  'j13b-tabs-more-menu-item',
                )}
              >
                {item.label}
              </button>
            ))}
          </VStack>
        </Popover>
      )}
    </>
  );
}
