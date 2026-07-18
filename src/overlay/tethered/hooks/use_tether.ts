import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Dimensions, Rectangle } from '../../../utils/types/dimensions.js';
import type { HorizontalTether, VerticalTether } from '../types.js';
import { calculateTetheredPosition } from './utils/calculate_position.js';

export interface UseTetherParams {
  anchor: Rectangle | null;
  verticalAnchor?: VerticalTether;
  verticalOrigin?: VerticalTether;
  horizontalOrigin?: HorizontalTether;
  horizontalAnchor?: HorizontalTether;
  verticalOffset?: number;
  horizontalOffset?: number;
  /** Auto-flip placement when the requested side overflows the viewport. */
  flip?: boolean;
}

export interface ResolvedPlacement {
  verticalAnchor: VerticalTether;
  verticalOrigin: VerticalTether;
  horizontalAnchor: HorizontalTether;
  horizontalOrigin: HorizontalTether;
}

/** A callback ref that also exposes `.current`, for backward compatibility. */
export type TetherRef = ((el: HTMLDivElement | null) => void) & {
  current: HTMLDivElement | null;
};

export function useTether({
  anchor,
  verticalAnchor = 'bottom',
  verticalOrigin = 'top',
  horizontalAnchor = 'start',
  horizontalOrigin = 'start',
  verticalOffset = 0,
  horizontalOffset = 0,
  flip = true,
}: UseTetherParams) {
  const [resolved, setResolved] = useState<ResolvedPlacement>({
    verticalAnchor,
    verticalOrigin,
    horizontalAnchor,
    horizontalOrigin,
  });
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  // Read-only mirror of the imperative position, kept only so consumers reading
  // `rectangle.position` still get a value. The DOM is driven imperatively (see
  // `update`); this state never drives layout, so its render lag can't flicker.
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Latest inputs kept in a ref so the imperative `update()` always reads fresh
  // values without the observer/listeners needing to be re-subscribed per render.
  const paramsRef = useRef({
    anchor,
    verticalAnchor,
    verticalOrigin,
    horizontalAnchor,
    horizontalOrigin,
    verticalOffset,
    horizontalOffset,
    flip,
  });
  paramsRef.current = {
    anchor,
    verticalAnchor,
    verticalOrigin,
    horizontalAnchor,
    horizontalOrigin,
    verticalOffset,
    horizontalOffset,
    flip,
  };

  const elRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  /**
   * Measure the tether, run the pure positioning math, and write the result
   * straight to the DOM node. Position never round-trips through React state,
   * so no frame is ever painted at a stale position.
   *
   * Stable identity (reads everything from refs) so it can be subscribed once.
   */
  const update = useCallback(() => {
    const el = elRef.current;
    const p = paramsRef.current;
    if (!el || !p.anchor) return;

    const rect = el.getBoundingClientRect();
    const computedStyle = getComputedStyle(el);

    const next = calculateTetheredPosition({
      anchor: p.anchor,
      tether: {
        dimensions: { width: rect.width, height: rect.height },
        position: { x: rect.left, y: rect.top },
      },
      direction: computedStyle.direction as 'ltr' | 'rtl',
      verticalAnchor: p.verticalAnchor,
      verticalOrigin: p.verticalOrigin,
      horizontalAnchor: p.horizontalAnchor,
      horizontalOrigin: p.horizontalOrigin,
      verticalOffset: p.verticalOffset,
      horizontalOffset: p.horizontalOffset,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      flip: p.flip,
    });

    el.style.setProperty('--tethered-top', `${next.top}px`);
    el.style.setProperty('--tethered-left', `${next.left}px`);

    setPosition((prev) =>
      prev.top === next.top && prev.left === next.left
        ? prev
        : { top: next.top, left: next.left },
    );
    setResolved((prev) =>
      prev.verticalAnchor === next.verticalAnchor &&
      prev.verticalOrigin === next.verticalOrigin &&
      prev.horizontalAnchor === next.horizontalAnchor &&
      prev.horizontalOrigin === next.horizontalOrigin
        ? prev
        : {
            verticalAnchor: next.verticalAnchor,
            verticalOrigin: next.verticalOrigin,
            horizontalAnchor: next.horizontalAnchor,
            horizontalOrigin: next.horizontalOrigin,
          },
    );
    setDimensions((prev) =>
      prev.width === rect.width && prev.height === rect.height
        ? prev
        : { width: rect.width, height: rect.height },
    );
  }, []);

  /**
   * Callback ref. Fires synchronously, in the commit phase before paint,
   * whenever the node attaches or detaches — crucially including when the
   * deferred Portal finally mounts the node. Positioning here means the node's
   * very first paint is already placed; there is no flash at the CSS-default
   * 0,0 origin (which was the flicker).
   */
  const tetherRef = useMemo<TetherRef>(() => {
    const ref = ((el: HTMLDivElement | null) => {
      // Detach whatever was previously attached.
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (elRef.current) {
        window.removeEventListener('resize', update);
        window.removeEventListener('scroll', update, true);
      }

      elRef.current = el;
      ref.current = el;
      if (!el) return;

      // Place before paint.
      update();

      // Reposition synchronously (before paint) on the tether's own size
      // changes — a dedicated observer, NOT the rAF-batched shared registry.
      const observer = new ResizeObserver(() => update());
      observer.observe(el);
      observerRef.current = observer;

      window.addEventListener('resize', update);
      window.addEventListener('scroll', update, true);
    }) as TetherRef;
    ref.current = null;
    return ref;
  }, [update]);

  // Reposition whenever the anchor rectangle or any placement input changes
  // (e.g. ElementTethered feeding a fresh anchor rect on scroll).
  useLayoutEffect(() => {
    update();
  }, [
    anchor,
    verticalAnchor,
    verticalOrigin,
    horizontalAnchor,
    horizontalOrigin,
    verticalOffset,
    horizontalOffset,
    flip,
    update,
  ]);

  return {
    rectangle: { dimensions, position: { x: position.left, y: position.top } },
    resolved,
    tetherRef,
  };
}
