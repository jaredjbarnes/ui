import type { HorizontalTether, VerticalTether } from '../../types.js';
import type { Rectangle, Dimensions } from '../../../../utils/types/dimensions.js';

export interface CalculateTetheredPositionParams {
  anchor: Rectangle;
  tether: Rectangle;
  direction: 'ltr' | 'rtl';
  verticalAnchor: VerticalTether;
  verticalOrigin: VerticalTether;
  horizontalAnchor: HorizontalTether;
  horizontalOrigin: HorizontalTether;
  verticalOffset: number;
  horizontalOffset: number;
  viewport: Dimensions;
  /** When true, try the opposite anchor/origin if the requested placement
   *  overflows the viewport. Defaults to true. */
  flip?: boolean;
}

interface PlacementResult {
  top: number;
  left: number;
  verticalAnchor: VerticalTether;
  verticalOrigin: VerticalTether;
  horizontalAnchor: HorizontalTether;
  horizontalOrigin: HorizontalTether;
}

/**
 * Pure positioning math. Computes the top/left where the tether element
 * should be placed so its origin point lands on the anchor's anchor point,
 * with offsets applied. When `flip` is enabled and the requested placement
 * overflows the viewport, alternates are tried (vertical flip → horizontal
 * flip → both); the first that fits wins. If none fit, the result is
 * clamped to the viewport.
 *
 * Direction-aware: horizontal anchor/origin "start" / "end" flip in RTL.
 */
export function calculateTetheredPosition(
  params: CalculateTetheredPositionParams,
): PlacementResult {
  const {
    anchor,
    tether,
    viewport,
    verticalAnchor,
    verticalOrigin,
    horizontalAnchor,
    horizontalOrigin,
    flip = true,
  } = params;

  const primary = computePlacement(
    params,
    verticalAnchor,
    verticalOrigin,
    horizontalAnchor,
    horizontalOrigin,
  );

  if (!flip || fitsInViewport(primary, tether.dimensions, viewport)) {
    return clampToViewport(primary, tether.dimensions, viewport);
  }

  // Try alternates only along the axes that overflow. Center placements
  // can't be flipped, so they're skipped.
  const overflowsV = !fitsVertically(primary, tether.dimensions, viewport);
  const overflowsH = !fitsHorizontally(primary, tether.dimensions, viewport, anchor);

  const candidates: PlacementResult[] = [primary];

  if (overflowsV && verticalAnchor !== 'center' && verticalOrigin !== 'center') {
    candidates.push(
      computePlacement(
        params,
        flipVertical(verticalAnchor),
        flipVertical(verticalOrigin),
        horizontalAnchor,
        horizontalOrigin,
      ),
    );
  }
  if (overflowsH && horizontalAnchor !== 'center' && horizontalOrigin !== 'center') {
    candidates.push(
      computePlacement(
        params,
        verticalAnchor,
        verticalOrigin,
        flipHorizontal(horizontalAnchor),
        flipHorizontal(horizontalOrigin),
      ),
    );
  }
  if (overflowsV && overflowsH) {
    candidates.push(
      computePlacement(
        params,
        flipVertical(verticalAnchor),
        flipVertical(verticalOrigin),
        flipHorizontal(horizontalAnchor),
        flipHorizontal(horizontalOrigin),
      ),
    );
  }

  // Pick the first candidate that fully fits; fall back to whichever has
  // the smallest combined overflow.
  const fits = candidates.find((c) => fitsInViewport(c, tether.dimensions, viewport));
  if (fits) return fits;

  let best = candidates[0]!;
  let bestOverflow = totalOverflow(best, tether.dimensions, viewport);
  for (let i = 1; i < candidates.length; i++) {
    const o = totalOverflow(candidates[i]!, tether.dimensions, viewport);
    if (o < bestOverflow) {
      best = candidates[i]!;
      bestOverflow = o;
    }
  }
  return clampToViewport(best, tether.dimensions, viewport);
}

function computePlacement(
  params: CalculateTetheredPositionParams,
  verticalAnchor: VerticalTether,
  verticalOrigin: VerticalTether,
  horizontalAnchor: HorizontalTether,
  horizontalOrigin: HorizontalTether,
): PlacementResult {
  const { anchor, tether, direction, verticalOffset, horizontalOffset } = params;
  const isRtl = direction === 'rtl';

  let top = anchor.position.y;
  let left = anchor.position.x;

  switch (verticalAnchor) {
    case 'top':
      top += verticalOffset;
      break;
    case 'center':
      top += anchor.dimensions.height / 2;
      break;
    case 'bottom':
      top += anchor.dimensions.height - verticalOffset;
      break;
  }

  switch (verticalOrigin) {
    case 'top':
      break;
    case 'center':
      top -= tether.dimensions.height / 2;
      break;
    case 'bottom':
      top -= tether.dimensions.height;
      break;
  }

  if (horizontalAnchor === 'start') {
    left += isRtl ? anchor.dimensions.width + horizontalOffset : horizontalOffset;
  } else if (horizontalAnchor === 'center') {
    left += anchor.dimensions.width / 2;
  } else if (horizontalAnchor === 'end') {
    left += isRtl ? -horizontalOffset : anchor.dimensions.width + horizontalOffset;
  }

  let adjustedHorizontalOrigin = horizontalOrigin;
  if (isRtl) {
    if (horizontalOrigin === 'start') adjustedHorizontalOrigin = 'end';
    else if (horizontalOrigin === 'end') adjustedHorizontalOrigin = 'start';
  }

  if (adjustedHorizontalOrigin === 'center') {
    left -= tether.dimensions.width / 2;
  } else if (adjustedHorizontalOrigin === 'end') {
    left -= tether.dimensions.width;
  }

  return { top, left, verticalAnchor, verticalOrigin, horizontalAnchor, horizontalOrigin };
}

function flipVertical(t: VerticalTether): VerticalTether {
  if (t === 'top') return 'bottom';
  if (t === 'bottom') return 'top';
  return t;
}

function flipHorizontal(t: HorizontalTether): HorizontalTether {
  if (t === 'start') return 'end';
  if (t === 'end') return 'start';
  return t;
}

function fitsVertically(p: PlacementResult, dims: Dimensions, vp: Dimensions): boolean {
  return p.top >= 0 && p.top + dims.height <= vp.height;
}

function fitsHorizontally(
  p: PlacementResult,
  dims: Dimensions,
  vp: Dimensions,
  _anchor: Rectangle,
): boolean {
  return p.left >= 0 && p.left + dims.width <= vp.width;
}

function fitsInViewport(p: PlacementResult, dims: Dimensions, vp: Dimensions): boolean {
  return p.top >= 0 && p.left >= 0 && p.top + dims.height <= vp.height && p.left + dims.width <= vp.width;
}

function totalOverflow(p: PlacementResult, dims: Dimensions, vp: Dimensions): number {
  return (
    Math.max(0, -p.top) +
    Math.max(0, -p.left) +
    Math.max(0, p.top + dims.height - vp.height) +
    Math.max(0, p.left + dims.width - vp.width)
  );
}

function clampToViewport(
  p: PlacementResult,
  dims: Dimensions,
  vp: Dimensions,
): PlacementResult {
  let { top, left } = p;
  if (left + dims.width > vp.width) left = vp.width - dims.width;
  if (left < 0) left = 0;
  if (top + dims.height > vp.height) top = vp.height - dims.height;
  if (top < 0) top = 0;
  return { ...p, top, left };
}
