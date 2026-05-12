import React, { useCallback, useRef, useState } from 'react';
import type { Position } from '../../types/dimensions.js';
import type { DragContainer } from './types.js';
import { useDraggable } from './use_draggable.js';

export interface UseDragContainerOptions {
  initialPosition?: Position;
}

/**
 * Builds the state + handlers for a single Draggable boundary. Tracks a
 * position offset, exposes `register/unregisterHandle` for children, and
 * proxies the low-level `useDraggable` deltas onto the position state.
 */
export function useMakeDragContainer(options: UseDragContainerOptions): DragContainer {
  const [handles, setHandles] = useState<React.RefObject<HTMLElement | null>[]>([]);
  const positionRef = useRef<Position>(options.initialPosition ?? { x: 0, y: 0 });
  const [position, setPosition] = useState(positionRef.current);
  const [isDragging, setIsDragging] = useState(false);

  useDraggable({
    handles,
    startDragCallback: () => {
      setIsDragging(true);
    },
    dragCallback: (dx, dy) => {
      setPosition({
        x: positionRef.current.x + dx,
        y: positionRef.current.y + dy,
      });
    },
    endDragCallback: (dx, dy) => {
      positionRef.current = {
        x: positionRef.current.x + dx,
        y: positionRef.current.y + dy,
      };
      setIsDragging(false);
    },
  });

  const setPositionState = useCallback(
    (value: Position | ((prev: Position) => Position)) => {
      setPosition((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        positionRef.current = next;
        return next;
      });
    },
    [],
  );

  const registerHandle = useCallback(
    (handle: React.RefObject<HTMLElement | null>) => {
      setHandles((prev) => [...prev, handle]);
    },
    [],
  );

  const unregisterHandle = useCallback(
    (handle: React.RefObject<HTMLElement | null>) => {
      setHandles((prev) => prev.filter((h) => h !== handle));
    },
    [],
  );

  return {
    registerHandle,
    unregisterHandle,
    position,
    isDragging,
    setPosition: setPositionState,
  };
}
