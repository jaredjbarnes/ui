type ConstraintAxis = 'width' | 'height';

export interface DetectResizeBoundsParams {
  element: HTMLElement;
  axis: ConstraintAxis;
  nextSize: number;
  /** Pixel tolerance for the "did the browser shorten us?" check. */
  epsilon?: number;
}

export interface DetectResizeBoundsResult {
  hitMin: boolean;
  hitMax: boolean;
  clamped: boolean;
  clampedSize: number | null;
}

const styleKeys = {
  width: { size: 'width', min: 'minWidth', max: 'maxWidth' },
  height: { size: 'height', min: 'minHeight', max: 'maxHeight' },
} as const;

function parsePx(value: string): number | null {
  const match = /^(-?\d+(?:\.\d+)?)px$/.exec(value.trim());
  return match ? Number(match[1]) : null;
}

function detectByPixelValue(nextSize: number, min: string, max: string) {
  const minPx = parsePx(min);
  const maxPx = parsePx(max);
  const hitMin = minPx !== null && nextSize < minPx;
  const hitMax = maxPx !== null && nextSize > maxPx;
  const clamped = hitMin || hitMax;
  return {
    hitMin,
    hitMax,
    clamped,
    clampedSize: clamped ? (hitMin ? minPx : maxPx) : null,
  };
}

/**
 * Pure DOM helper for resize handles: given a candidate new size, returns
 * whether the element would actually grow/shrink to it once min/max and
 * intrinsic constraints are applied.
 *
 * Fast path: if the computed `min-`/`max-`<axis> is a literal pixel value,
 * we can decide without touching layout. Slow path: write the candidate
 * size onto inline style, read it back, then restore — the browser does
 * the clamping for us.
 */
export function detectResizeBounds({
  element,
  axis,
  nextSize,
  epsilon = 0.5,
}: DetectResizeBoundsParams): DetectResizeBoundsResult {
  const keys = styleKeys[axis];

  const computed = getComputedStyle(element);
  const fastPath = detectByPixelValue(nextSize, computed[keys.min], computed[keys.max]);
  if (fastPath.clamped) return fastPath;

  const style = element.style;
  const prevInline = style[keys.size];

  try {
    style[keys.size] = `${nextSize}px`;
    const rect = element.getBoundingClientRect();
    const renderedSize = rect[keys.size];
    const delta = renderedSize - nextSize;

    const hitMin = delta > epsilon;
    const hitMax = delta < -epsilon;
    const clamped = hitMin || hitMax;

    return {
      hitMin,
      hitMax,
      clamped,
      clampedSize: clamped ? renderedSize : null,
    };
  } finally {
    style[keys.size] = prevInline;
  }
}
