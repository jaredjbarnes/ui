import React, { useCallback, useReducer, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { HStack } from '../../stacks/h_stack.js';
import { TabsBar } from './tabs_bar.js';
import { TabsList } from './tabs_list.js';
import { TabItem } from './tab_item.js';
import { useTabs } from './context.js';
import { Popover } from '../popover/popover.js';
import { VStack } from '../../stacks/v_stack.js';
import { useResizeObserver } from '../../utils/hooks/use_resize_observer.js';
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
  /** Inline gap between tab items — must match the theme's
   *  `.j13b-tabs-list { gap }` so the cutoff math is accurate. Defaults
   *  to 4 to match both bundled themes. */
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

/**
 * Ghost row positioning. The row paints into the same flex/font/theme
 * context as the visible row (it's a sibling inside the same TabsBar) but
 * is removed from layout flow — items can lay out at their natural widths
 * without affecting the visible row. `visibility: hidden` keeps it from
 * painting; `pointerEvents: none` stops clicks; `aria-hidden` on the
 * element keeps it out of the a11y tree. Tab items inside are
 * `flex-shrink: 0` (HStack default) so their measured widths are intrinsic
 * regardless of how wide this absolute container ends up.
 */
const GHOST_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  visibility: 'hidden',
  pointerEvents: 'none',
};

/**
 * Greedy left-to-right packing. Charges each candidate item its width plus
 * a leading gap (after the first); reserves trailing space for the More
 * trigger whenever items still remain past the candidate. The first item
 * that pushes the running total past `containerWidth` is the cutoff.
 *
 * `containerWidth === 0` means the bar hasn't laid out yet — return
 * `itemCount` so the first paint renders everything; ResizeObserver fires
 * shortly after and the second pass settles the layout.
 *
 * Pure function — no DOM, no React. Easy to test in isolation if needed.
 */
function computeCutoff(
  itemCount: number,
  itemWidths: number[],
  moreWidth: number,
  containerWidth: number,
  gap: number,
): number {
  if (containerWidth === 0) return itemCount;
  let used = 0;
  for (let i = 0; i < itemCount; i++) {
    const itemW = itemWidths[i] ?? 0;
    const remaining = itemCount - i - 1;
    const moreReserve = remaining > 0 ? gap + moreWidth : 0;
    const itemCost = i === 0 ? itemW : gap + itemW;
    if (used + itemCost + moreReserve > containerWidth) return i;
    used += itemCost;
  }
  return itemCount;
}

interface GhostItemProps {
  label: React.ReactNode;
  isSelected: boolean;
  onMeasure: (width: number) => void;
}

/** Ghost tab — measurement-only. Mirrors the visible item's selected state
 *  so font-weight (and any other selected-only style) affects the measured
 *  width too. */
const GhostItem: React.FC<GhostItemProps> = ({ label, isSelected, onMeasure }) => {
  const ref = useResizeObserver<HTMLButtonElement>(onMeasure, 'width');
  return (
    <TabItem ref={ref} selected={isSelected} aria-hidden tabIndex={-1}>
      {label}
    </TabItem>
  );
};

interface GhostMoreProps {
  label: React.ReactNode;
  onMeasure: (width: number) => void;
}

/** Ghost More trigger — measurement-only. Always rendered in `selected`
 *  state so worst-case selected styling (font-weight: 500, any selected
 *  padding/border etc. the theme applies) is captured. The visible More
 *  may end up unselected, but its width will then be NARROWER than the
 *  ghost's — never wider. */
const GhostMore: React.FC<GhostMoreProps> = ({ label, onMeasure }) => {
  const ref = useResizeObserver<HTMLButtonElement>(onMeasure, 'width');
  return (
    <TabItem ref={ref} selected aria-hidden tabIndex={-1}>
      {label}
      <Chevron />
    </TabItem>
  );
};

interface VisibleItemProps {
  item: OverflowTabsNavbarItem;
}

/** Visible tab — wired to the Tabs context for click + selected state.
 *  Measurement lives on the ghost row; this component is purely render. */
const VisibleItem: React.FC<VisibleItemProps> = ({ item }) => {
  const state = useTabs();
  const isMatch = state.value === item.value;
  return (
    <TabItem
      selected={isMatch}
      onClick={() => state.onChange?.(item.value)}
      tabIndex={isMatch ? 0 : -1}
      id={`tab-${item.value}`}
      aria-controls={`tabpanel-${item.value}`}
    >
      {item.label}
    </TabItem>
  );
};

/**
 * OverflowTabsNavbar — responsive tab strip that auto-collapses items that
 * don't fit into a "More" popover.
 *
 * Architecture: a VISIBLE row renders the items that fit plus a More
 * trigger when there's overflow; a HIDDEN GHOST row renders all items at
 * their natural in-flow widths and is the SOLE source of truth for the
 * cutoff math.
 *
 * Why a ghost row instead of measuring the visible items directly?
 *   - Measuring items that toggle in/out of `position: absolute` is
 *     unreliable: a flex item's intrinsic width and an absolute element's
 *     shrink-to-fit width agree in theory but can diverge under different
 *     theme styling (padding tokens, font-weight on selected items, etc.).
 *   - The visible More trigger's width changes when it swaps labels
 *     ("More" vs. an overflowed-item label), which feeds back into the
 *     cutoff math and can oscillate.
 *   - Themes are free to style tabs however they like; the algorithm
 *     should be theme-agnostic.
 *
 * The ghost row sidesteps all of that. Items there are always rendered in
 * flow, in their natural state; their widths are stable. The ghost More
 * uses a fixed label, so its width is stable too. The visible row reads
 * the cutoff and renders accordingly — no measurements on the visible
 * side at all.
 */
export function OverflowTabsNavbar({
  items,
  moreLabel = 'More',
  gap = 4,
  className,
  ...props
}: OverflowTabsNavbarProps) {
  const state = useTabs();
  const [listWidth, setListWidth] = useState(0);
  // Two ghost Mores are measured so the reservation is the worst case of
  // both possible visible contents: the fixed `moreLabel` (used when no
  // overflow item is selected) and the longest item label (which the
  // visible More swaps to when an overflowed item IS selected).
  const [moreWidthForFallback, setMoreWidthForFallback] = useState(0);
  const [moreWidthForLongestItem, setMoreWidthForLongestItem] = useState(0);
  const moreWidth = Math.max(moreWidthForFallback, moreWidthForLongestItem);
  const itemWidthsRef = useRef<number[]>([]);
  const [, force] = useReducer((x: number) => x + 1, 0);
  const [open, setOpen] = useState(false);
  const moreRef = useRef<HTMLButtonElement | null>(null);

  // Measure the VISIBLE TabsList — that's the inline area items occupy
  // (its border-box is the bar's content area; bar padding is excluded
  // because the list lives inside it). Items don't shrink, so the ghost
  // row's own width doesn't need to match this — only the cutoff math
  // does.
  const visibleListResizeRef = useResizeObserver<HTMLElement>(
    (w) => setListWidth(w),
    'width',
  );

  const onItemMeasure = useCallback((i: number, w: number) => {
    if (itemWidthsRef.current[i] !== w) {
      itemWidthsRef.current[i] = w;
      force();
    }
  }, []);

  // Trim cached widths when items shrink so stale entries don't pollute
  // the math.
  if (itemWidthsRef.current.length > items.length) {
    itemWidthsRef.current = itemWidthsRef.current.slice(0, items.length);
  }

  const cutoff = computeCutoff(
    items.length,
    itemWidthsRef.current,
    moreWidth,
    listWidth,
    gap,
  );

  const activeIndex = items.findIndex((it) => it.value === state.value);
  const hasOverflow = cutoff < items.length;
  const activeIsHidden = activeIndex >= cutoff && activeIndex >= 0;
  const moreDisplayLabel =
    activeIsHidden && items[activeIndex] ? items[activeIndex].label : moreLabel;

  // Pick the item with the widest measured width — its label drives the
  // worst-case ghost More measurement, since the visible More can swap to
  // ANY overflowed item's label.
  let longestItemIndex = -1;
  let longestItemWidth = 0;
  for (let i = 0; i < items.length; i++) {
    const w = itemWidthsRef.current[i] ?? 0;
    if (w > longestItemWidth) {
      longestItemWidth = w;
      longestItemIndex = i;
    }
  }
  const longestItemLabel =
    longestItemIndex >= 0 ? items[longestItemIndex]?.label ?? null : null;

  return (
    <>
      <TabsBar className={clsx('j13b-tabs-overflow', className)} {...props}>
        <TabsList ref={visibleListResizeRef}>
          {items.slice(0, cutoff).map((item) => (
            <VisibleItem key={item.value} item={item} />
          ))}
          {hasOverflow && (
            <TabItem
              ref={moreRef}
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

        {/* Ghost row — same theme/font/flex context as the visible row,
            but positioned absolutely so it can't affect layout. Always
            renders every item plus the More trigger, in flow, at natural
            width. This is the measurement source for computeCutoff. */}
        <HStack
          aria-hidden
          inline
          style={{ ...GHOST_STYLE, gap: `${gap}px` }}
        >
          {items.map((item, i) => (
            <GhostItem
              key={item.value}
              label={item.label}
              isSelected={state.value === item.value}
              onMeasure={(w) => onItemMeasure(i, w)}
            />
          ))}
          {/* moreLabel ghost — covers the !activeIsHidden case where the
              visible More shows the fixed fallback label. */}
          <GhostMore label={moreLabel} onMeasure={setMoreWidthForFallback} />
          {/* Longest-item-label ghost — covers the activeIsHidden case
              where the visible More can swap to any overflowed-item label.
              Using the widest known label is the upper bound on that. */}
          {longestItemLabel != null && (
            <GhostMore
              label={longestItemLabel}
              onMeasure={setMoreWidthForLongestItem}
            />
          )}
        </HStack>
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
