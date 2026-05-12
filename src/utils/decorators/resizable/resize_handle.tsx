import React, { forwardRef, useMemo } from 'react';
import { clsx } from 'clsx';
import { useResizable } from './context.js';
import { getHandleConfig } from './handle_config.js';
import { ResizeHandleStrategy } from './resize_strategy.js';
import { detectResizeBounds } from './detect_resize_bounds.js';
import type { ResizeHandlePosition } from './types.js';
import styles from './resize_handle.module.css';

export interface ResizeHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  position: ResizeHandlePosition;
}

/**
 * Pointer-driven resize handle. Lives under a `<Resizable>` and operates on
 * its target ref. On pointerdown, captures the pointer so the drag survives
 * the cursor leaving the window; on each pointermove, runs the pure resize
 * strategy and writes the new inline size — clamping to min/max constraints
 * detected from computed style.
 */
export const ResizeHandle = forwardRef<HTMLDivElement, ResizeHandleProps>(
  function ResizeHandle({ position, className, ...rest }, ref) {
    const {
      targetRef,
      onWidthResize,
      onWidthResizeEnd,
      onHeightResize,
      onHeightResizeEnd,
    } = useResizable();

    const config = getHandleConfig(position);
    const axis =
      config.horizontal && config.vertical
        ? 'corner'
        : config.horizontal
          ? 'horizontal'
          : 'vertical';

    const strategy = useMemo(() => new ResizeHandleStrategy(position), [position]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      const target = targetRef.current;
      if (target == null) return;

      const handle = event.currentTarget;
      const pointerId = event.pointerId;
      const startRect = target.getBoundingClientRect();

      strategy.startResize({
        rectangle: {
          dimensions: { width: startRect.width, height: startRect.height },
          position: { x: event.clientX, y: event.clientY },
        },
        languageDirection: window.getComputedStyle(target).direction,
      });

      try {
        handle.setPointerCapture(pointerId);
      } catch {
        /* capture may fail in some test envs */
      }

      let frameId = 0;
      let appliedWidth = startRect.width;
      let appliedHeight = startRect.height;

      const onMove = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return;
        e.stopPropagation();
        e.preventDefault();

        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => {
          const result = strategy.resize({ x: e.clientX, y: e.clientY });

          if (result.horizontal) {
            const bounds = detectResizeBounds({
              element: target,
              axis: 'width',
              nextSize: result.horizontal.newSize,
            });
            if (!bounds.clamped) {
              appliedWidth = result.horizontal.newSize;
              target.style.width = `${result.horizontal.newSize}px`;
              onWidthResize?.({
                width: result.horizontal.newSize,
                origin: result.horizontal.origin,
                totalDelta: result.horizontal.totalDelta,
                currentDelta: result.horizontal.currentDelta,
              });
            } else if (
              bounds.clampedSize !== null &&
              bounds.clampedSize !== appliedWidth
            ) {
              appliedWidth = bounds.clampedSize;
              target.style.width = `${bounds.clampedSize}px`;
              onWidthResize?.({
                width: bounds.clampedSize,
                origin: result.horizontal.origin,
                totalDelta: result.horizontal.totalDelta,
                currentDelta: result.horizontal.currentDelta,
              });
            }
          }

          if (result.vertical) {
            const bounds = detectResizeBounds({
              element: target,
              axis: 'height',
              nextSize: result.vertical.newSize,
            });
            if (!bounds.clamped) {
              appliedHeight = result.vertical.newSize;
              target.style.height = `${result.vertical.newSize}px`;
              onHeightResize?.({
                height: result.vertical.newSize,
                origin: result.vertical.origin,
                totalDelta: result.vertical.totalDelta,
                currentDelta: result.vertical.currentDelta,
              });
            } else if (
              bounds.clampedSize !== null &&
              bounds.clampedSize !== appliedHeight
            ) {
              appliedHeight = bounds.clampedSize;
              target.style.height = `${bounds.clampedSize}px`;
              onHeightResize?.({
                height: bounds.clampedSize,
                origin: result.vertical.origin,
                totalDelta: result.vertical.totalDelta,
                currentDelta: result.vertical.currentDelta,
              });
            }
          }

          strategy.commitResize({ width: appliedWidth, height: appliedHeight });
        });
      };

      const onEnd = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return;
        cancelAnimationFrame(frameId);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onEnd);
        window.removeEventListener('pointercancel', onEnd);

        try {
          handle.releasePointerCapture(pointerId);
        } catch {
          /* ignore */
        }

        const result = strategy.endResize();
        if (result.horizontal) {
          onWidthResizeEnd?.(result.horizontal.width, result.horizontal.origin);
        }
        if (result.vertical) {
          onHeightResizeEnd?.(result.vertical.height, result.vertical.origin);
        }
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onEnd);
      window.addEventListener('pointercancel', onEnd);

      event.stopPropagation();
      event.preventDefault();
    };

    return (
      <div
        ref={ref}
        className={clsx(styles['resize-handle'], 'j13b-resize-handle', className)}
        data-position={position}
        data-axis={axis}
        onPointerDown={handlePointerDown}
        {...rest}
      />
    );
  },
);

ResizeHandle.displayName = 'ResizeHandle';
