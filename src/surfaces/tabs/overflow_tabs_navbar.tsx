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
import { convertRectangleToCssVariables } from '../../utils/css_utils.js';
import { useForkRef } from '../../utils/hooks/use_fork_ref.js';
import type { Rectangle } from '../../utils/types/dimensions.js';
import styles from './tabs.module.css';

/**
 * Measure an element's offset rectangle (relative to its offsetParent).
 * Inlined here rather than imported because `useTrackActiveItemRectangle`
 * only re-measures on element-resize events — and in the overflow case the
 * active item's position can shift while its size stays the same (siblings
 * going in/out of overflow, font load, etc), so the parent re-measures
 * centrally instead.
 */
function getElementRect(element: HTMLElement | null): Rectangle | null {
  if (!element) return null;
  return {
    dimensions: { width: element.offsetWidth, height: element.offsetHeight },
    position: { x: element.offsetLeft, y: element.offsetTop },
  };
}

function rectanglesEqual(a: Rectangle | null, b: Rectangle | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.position.x === b.position.x &&
    a.position.y === b.position.y &&
    a.dimensions.width === b.dimensions.width &&
    a.dimensions.height === b.dimensions.height
  );
}

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
  elementRef: React.Ref<HTMLButtonElement>;
}

/**
 * A single tab inside the overflow navbar. Stays in the DOM even when it
 * overflows (CSS handles the hiding via `data-is-overflow`), so its natural
 * width remains measurable for the cutoff algorithm.
 *
 * The active-rectangle measurement is owned by the parent — it re-measures
 * centrally on every render so layout shifts that don't trigger a per-
 * element resize observer (sibling overflow changes, font load) still
 * keep the indicator in sync.
 */
function OverflowItem({
  item,
  isOverflow,
  onMeasureWidth,
  elementRef,
}: OverflowItemProps) {
  const state = useTabs();
  const isMatch = state.value === item.value;

  const measureRef = useResizeObserver<HTMLButtonElement>(
    (w) => onMeasureWidth(w),
    'width',
  );

  const mergedRef = useForkRef<HTMLButtonElement>(elementRef, measureRef);

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
  const itemElementsRef = useRef<(HTMLButtonElement | null)[]>([]);
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

  const setItemElement = useCallback(
    (i: number) => (el: HTMLButtonElement | null) => {
      itemElementsRef.current[i] = el;
    },
    [],
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

  // Centralized active-rectangle sync. Runs after every render so any
  // layout shift — cutoff change moving the More trigger, sibling going
  // in/out of flow, font load — is picked up. `useTrackActiveItemRectangle`
  // alone wasn't enough because it only re-measures on the active
  // element's own resize, and in the overflow case the element's position
  // can move while its size stays the same. The equality guard avoids the
  // infinite loop that "set state on every render" would otherwise create.
  useLayoutEffect(() => {
    const activeEl = activeIsHidden
      ? moreRef.current
      : activeIndex >= 0
        ? itemElementsRef.current[activeIndex] ?? null
        : null;
    if (!activeEl) return;
    const rect = getElementRect(activeEl);
    if (!rect) return;
    if (rectanglesEqual(rect, state.activeTrigger)) return;
    state.setActiveTrigger(rect);
  });

  const moreMergedRef = useForkRef<HTMLButtonElement>(
    moreResizeRef,
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
              elementRef={setItemElement(i)}
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
