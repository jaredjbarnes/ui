import type {
  AxisConfig,
  HandleConfig,
  ResolvedHandleConfig,
  ResizeHandlePosition,
} from './types.js';

/*
 * Pure position → config lookup. No DOM, no React.
 *
 * Edges populate one axis, corners populate both. The React adapter reads
 * the DOM (getBoundingClientRect, computed direction) and feeds resolved
 * values into resolveDirection / computeResizeState.
 */
const configs: Record<ResizeHandlePosition, HandleConfig> = {
  start: {
    horizontal: { origin: 'start', invert: true, disableDirection: false },
  },
  end: {
    horizontal: { origin: 'end', invert: false, disableDirection: false },
  },
  top: {
    vertical: { origin: 'top', invert: true, disableDirection: true },
  },
  bottom: {
    vertical: { origin: 'bottom', invert: false, disableDirection: true },
  },

  'top-start': {
    horizontal: { origin: 'start', invert: true, disableDirection: false },
    vertical: { origin: 'top', invert: true, disableDirection: true },
  },
  'top-end': {
    horizontal: { origin: 'end', invert: false, disableDirection: false },
    vertical: { origin: 'top', invert: true, disableDirection: true },
  },
  'bottom-start': {
    horizontal: { origin: 'start', invert: true, disableDirection: false },
    vertical: { origin: 'bottom', invert: false, disableDirection: true },
  },
  'bottom-end': {
    horizontal: { origin: 'end', invert: false, disableDirection: false },
    vertical: { origin: 'bottom', invert: false, disableDirection: true },
  },
};

export function getHandleConfig(position: ResizeHandlePosition): HandleConfig {
  return configs[position];
}

/**
 * +1 or −1 multiplier for an axis's resize delta. `invert` flips because the
 * handle drags toward the opposite side (a `start` handle: dragging right
 * shrinks the element). `disableDirection` skips RTL mirroring — used by
 * vertical axes where top/bottom are physical, not writing-mode-relative.
 */
export function resolveDirection(
  languageDirection: string,
  invert: boolean,
  disableDirection: boolean,
): number {
  const finalInvert =
    languageDirection === 'rtl' && !disableDirection ? !invert : invert;
  return finalInvert ? -1 : 1;
}

function resolveAxis(axis: AxisConfig, languageDirection: string) {
  return {
    origin: axis.origin,
    direction: resolveDirection(
      languageDirection,
      axis.invert,
      axis.disableDirection,
    ),
  };
}

export function resolveHandleConfig(
  position: ResizeHandlePosition,
  languageDirection: string,
): ResolvedHandleConfig {
  const config = configs[position];
  return {
    horizontal: config.horizontal
      ? resolveAxis(config.horizontal, languageDirection)
      : undefined,
    vertical: config.vertical
      ? resolveAxis(config.vertical, languageDirection)
      : undefined,
  };
}

/**
 * Pure resize math; runs per-axis on each pointermove.
 */
export function computeResizeState(
  startSize: number,
  startCoord: number,
  currentCoord: number,
  direction: number,
  previousSize: number,
): { newSize: number; totalDelta: number; currentDelta: number } {
  const totalDelta = direction * (currentCoord - startCoord);
  const newSize = startSize + totalDelta;
  const currentDelta = newSize - previousSize;
  return { newSize, totalDelta, currentDelta };
}
