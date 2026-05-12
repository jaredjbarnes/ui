import type { HorizontalSide, VerticalSide } from '../../types/sides.js';

export type WidthResizeOrigin = HorizontalSide;
export type HeightResizeOrigin = VerticalSide;

export interface BaseOnResizePayload<
  Origin extends WidthResizeOrigin | HeightResizeOrigin,
> {
  origin: Origin;
  /** Cumulative delta from drag start. */
  totalDelta: number;
  /** Delta of just this event. */
  currentDelta: number;
}

export interface OnWidthResizePayload extends BaseOnResizePayload<WidthResizeOrigin> {
  width: number;
}

export interface OnHeightResizePayload extends BaseOnResizePayload<HeightResizeOrigin> {
  height: number;
}

export type OnWidthResize = (payload: OnWidthResizePayload) => void;
export type OnHeightResize = (payload: OnHeightResizePayload) => void;
export type OnWidthResizeEnd = (width: number, origin: WidthResizeOrigin) => void;
export type OnHeightResizeEnd = (height: number, origin: HeightResizeOrigin) => void;

export type ResizeHandlePosition =
  // Edges
  | 'top'
  | 'bottom'
  | 'start'
  | 'end'
  // Corners
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

export interface AxisConfig {
  origin: WidthResizeOrigin | HeightResizeOrigin;
  invert: boolean;
  /** Skip RTL mirroring (used for vertical axes — top/bottom are physical). */
  disableDirection: boolean;
}

export interface HandleConfig {
  horizontal?: AxisConfig;
  vertical?: AxisConfig;
}

export interface ResolvedAxisConfig {
  origin: WidthResizeOrigin | HeightResizeOrigin;
  direction: number;
}

export interface ResolvedHandleConfig {
  horizontal?: ResolvedAxisConfig;
  vertical?: ResolvedAxisConfig;
}

export interface ResizableContextValue {
  targetRef: React.RefObject<HTMLElement | null>;
  onWidthResize?: OnWidthResize;
  onWidthResizeEnd?: OnWidthResizeEnd;
  onHeightResize?: OnHeightResize;
  onHeightResizeEnd?: OnHeightResizeEnd;
}
