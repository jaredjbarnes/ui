import React, { forwardRef, useCallback, useRef, type PropsWithChildren } from 'react';
import { clsx } from 'clsx';
import type { Rectangle } from '../../utils/types/dimensions.js';
import { Portal } from '../portal/portal.js';
import { useTether } from './hooks/use_tether.js';
import type { HorizontalTether, VerticalTether } from './types.js';
import styles from './tethered.module.css';

export interface BaseTetheredOwnProps {
  verticalAnchor?: VerticalTether;
  verticalOrigin?: VerticalTether;
  horizontalAnchor?: HorizontalTether;
  horizontalOrigin?: HorizontalTether;
  verticalOffset?: number;
  horizontalOffset?: number;
  /** When the requested placement would clip the tether off-screen, try the
   *  opposite side(s). Defaults to true. */
  flip?: boolean;
}

export interface TetheredOwnProps extends BaseTetheredOwnProps {
  /** The trigger's bounding rectangle. Pass null when there's no trigger yet
   *  and the tether should not render. */
  anchor: Rectangle | null;
}

export interface TetheredProps
  extends TetheredOwnProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, keyof TetheredOwnProps> {}

/**
 * Positioned floating overlay. Renders into a Portal (document.body), then
 * computes its position relative to the supplied anchor rectangle.
 *
 * `verticalAnchor`/`horizontalAnchor`: which point on the trigger.
 * `verticalOrigin`/`horizontalOrigin`: which point on the tether attaches there.
 *   Defaults: verticalAnchor=bottom, verticalOrigin=top → tether sits below the trigger.
 *   horizontalAnchor=start, horizontalOrigin=start → left-edge-aligned (RTL-aware).
 */
export const Tethered = forwardRef<HTMLDivElement, PropsWithChildren<TetheredProps>>(
  function Tethered(
    {
      anchor,
      verticalAnchor = 'bottom',
      verticalOrigin = 'top',
      horizontalAnchor = 'start',
      horizontalOrigin = 'start',
      verticalOffset = 0,
      horizontalOffset = 0,
      flip = true,
      children,
      style,
      className,
      ...rest
    },
    ref,
  ) {
    const { resolved, tetherRef } = useTether({
      anchor,
      verticalAnchor,
      verticalOrigin,
      horizontalAnchor,
      horizontalOrigin,
      verticalOffset,
      horizontalOffset,
      flip,
    });

    // Keep the forwarded ref reachable without folding it into the merged
    // callback's dependencies — a caller passing a fresh inline ref each render
    // must not force a re-attach.
    const forwardedRef = useRef(ref);
    forwardedRef.current = ref;

    // Stable merged ref. `tetherRef` is stable across renders, so this callback's
    // identity never changes; React therefore won't detach/re-attach the tethered
    // node on every render. That reattachment is what re-ran update() and spun up a
    // fresh ResizeObserver each time — and, when open content resized mid-render
    // (e.g. a list mutating under an open Popover), fed an infinite
    // measure → reposition → re-render → re-attach → measure loop.
    const setRefs = useCallback(
      (el: HTMLDivElement | null) => {
        tetherRef(el);
        const forwarded = forwardedRef.current;
        if (typeof forwarded === 'function') forwarded(el);
        else if (forwarded)
          (forwarded as React.MutableRefObject<HTMLDivElement | null>).current = el;
      },
      [tetherRef],
    );

    if (!anchor) return null;

    return (
      <Portal>
        <div
          ref={setRefs}
          className={clsx(styles.tethered, 'j13b-tethered', className)}
          style={style}
          data-v-anchor={resolved.verticalAnchor}
          data-h-anchor={resolved.horizontalAnchor}
          data-v-origin={resolved.verticalOrigin}
          data-h-origin={resolved.horizontalOrigin}
          {...rest}
        >
          {children}
        </div>
      </Portal>
    );
  },
);
