import {
  getHandleConfig,
  resolveDirection,
  computeResizeState,
} from './handle_config.js';
import type {
  AxisConfig,
  ResizeHandlePosition,
  WidthResizeOrigin,
  HeightResizeOrigin,
} from './types.js';
import type { Dimensions, Position, Rectangle } from '../../types/dimensions.js';

export interface StartResizeParams {
  rectangle: Rectangle;
  languageDirection: string;
}

export interface AxisResizeResult {
  newSize: number;
  totalDelta: number;
  currentDelta: number;
}

export interface HorizontalResizeResult extends AxisResizeResult {
  origin: WidthResizeOrigin;
}

export interface VerticalResizeResult extends AxisResizeResult {
  origin: HeightResizeOrigin;
}

export interface ResizeResult {
  horizontal?: HorizontalResizeResult;
  vertical?: VerticalResizeResult;
}

export interface EndResizeResult {
  horizontal?: { width: number; origin: WidthResizeOrigin };
  vertical?: { height: number; origin: HeightResizeOrigin };
}

/**
 * Single-axis resize handler. Pure — no DOM, no React. Subclasses extract
 * the correct axis from uniform args.
 */
abstract class AxisResizeHandler {
  protected direction = 1;
  protected startSize = 0;
  protected startCoord = 0;
  protected currentSize = 0;

  constructor(protected axisConfig: AxisConfig) {}

  get origin() {
    return this.axisConfig.origin;
  }

  get size() {
    return this.currentSize;
  }

  protected abstract extractSize(dimensions: Dimensions): number;
  protected abstract extractCoord(coord: Position): number;
  abstract applyResize(coord: Position): Partial<ResizeResult>;
  abstract applyEnd(): Partial<EndResizeResult>;

  start(rect: Rectangle, languageDirection: string) {
    this.direction = resolveDirection(
      languageDirection,
      this.axisConfig.invert,
      this.axisConfig.disableDirection,
    );
    this.startSize = this.extractSize(rect.dimensions);
    this.startCoord = this.extractCoord(rect.position);
    this.currentSize = this.startSize;
  }

  resize(coord: Position): AxisResizeResult {
    return computeResizeState(
      this.startSize,
      this.startCoord,
      this.extractCoord(coord),
      this.direction,
      this.currentSize,
    );
  }

  commit(dimensions: Dimensions) {
    this.currentSize = this.extractSize(dimensions);
  }
}

class HorizontalAxisResizeHandler extends AxisResizeHandler {
  protected extractSize(d: Dimensions) {
    return d.width;
  }
  protected extractCoord(p: Position) {
    return p.x;
  }
  applyResize(coord: Position): Partial<ResizeResult> {
    return {
      horizontal: {
        ...this.resize(coord),
        origin: this.origin as WidthResizeOrigin,
      },
    };
  }
  applyEnd(): Partial<EndResizeResult> {
    return {
      horizontal: { width: this.size, origin: this.origin as WidthResizeOrigin },
    };
  }
}

class VerticalAxisResizeHandler extends AxisResizeHandler {
  protected extractSize(d: Dimensions) {
    return d.height;
  }
  protected extractCoord(p: Position) {
    return p.y;
  }
  applyResize(coord: Position): Partial<ResizeResult> {
    return {
      vertical: {
        ...this.resize(coord),
        origin: this.origin as HeightResizeOrigin,
      },
    };
  }
  applyEnd(): Partial<EndResizeResult> {
    return {
      vertical: { height: this.size, origin: this.origin as HeightResizeOrigin },
    };
  }
}

/**
 * Adapter loop:
 *   1. startResize() — capture initial rect + language direction
 *   2. resize(coord) — on every pointermove, returns axis deltas
 *   3. (caller writes inline style + checks bounds) commitResize(actual)
 *   4. endResize() — final state for `*ResizeEnd` callbacks
 */
export class ResizeHandleStrategy {
  private handlers: AxisResizeHandler[];

  constructor(position: ResizeHandlePosition) {
    const config = getHandleConfig(position);
    this.handlers = [];
    if (config.horizontal) {
      this.handlers.push(new HorizontalAxisResizeHandler(config.horizontal));
    }
    if (config.vertical) {
      this.handlers.push(new VerticalAxisResizeHandler(config.vertical));
    }
  }

  startResize(params: StartResizeParams): void {
    for (const handler of this.handlers) {
      handler.start(params.rectangle, params.languageDirection);
    }
  }

  resize(position: Position): ResizeResult {
    return Object.assign({}, ...this.handlers.map((h) => h.applyResize(position)));
  }

  commitResize(dimensions: Dimensions): void {
    for (const handler of this.handlers) {
      handler.commit(dimensions);
    }
  }

  endResize(): EndResizeResult {
    return Object.assign({}, ...this.handlers.map((h) => h.applyEnd()));
  }
}
