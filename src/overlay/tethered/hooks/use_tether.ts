import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { Rectangle } from '../../../utils/types/dimensions.js';
import type { HorizontalTether, VerticalTether } from '../types.js';
import { calculateTetheredPosition } from './utils/calculate_position.js';
import { useRefDimensions } from './use_ref_dimensions.js';

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
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [resolved, setResolved] = useState<ResolvedPlacement>({
    verticalAnchor,
    verticalOrigin,
    horizontalAnchor,
    horizontalOrigin,
  });
  const tetherRef = useRef<HTMLDivElement>(null);
  const dimensions = useRefDimensions(tetherRef);

  const getPosition = useCallback(() => {
    if (!anchor || !tetherRef.current) return;

    const tether = tetherRef.current.getBoundingClientRect();
    const computedStyle = getComputedStyle(tetherRef.current);

    return calculateTetheredPosition({
      anchor,
      tether: {
        dimensions: { width: tether.width, height: tether.height },
        position: { x: tether.left, y: tether.top },
      },
      direction: computedStyle.direction as 'ltr' | 'rtl',
      verticalAnchor,
      verticalOrigin,
      horizontalAnchor,
      horizontalOrigin,
      verticalOffset,
      horizontalOffset,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      flip,
    });
  }, [
    anchor,
    verticalAnchor,
    verticalOrigin,
    horizontalAnchor,
    horizontalOrigin,
    verticalOffset,
    horizontalOffset,
    flip,
  ]);

  useLayoutEffect(() => {
    const update = () => {
      const next = getPosition();
      if (!next) return;
      setPosition((prev) =>
        prev.top === next.top && prev.left === next.left ? prev : { top: next.top, left: next.left },
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
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  });

  return {
    rectangle: { dimensions, position: { x: position.left, y: position.top } },
    resolved,
    tetherRef,
  };
}
