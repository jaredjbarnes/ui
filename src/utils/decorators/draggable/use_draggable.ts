import { useEffect, useRef } from 'react';

export interface UseDraggableOptions {
  startDragCallback: (startX: number, startY: number) => void;
  dragCallback: (deltaX: number, deltaY: number, startX: number, startY: number) => void;
  endDragCallback: (
    deltaX: number,
    deltaY: number,
    startX: number,
    startY: number,
  ) => void;
  /** One or many handle refs. Pointer down on any of them starts a drag. */
  handles?: React.RefObject<HTMLElement | null>[] | React.RefObject<HTMLElement | null>;
}

/**
 * Low-level pointer-drag hook. Binds `pointerdown` on each handle, captures
 * the pointer so we keep receiving moves even when it leaves the window, and
 * dispatches start/drag/end callbacks.
 *
 * Pointer Events (not mouse) so this works with mouse, touch, and pen out of
 * the box. `setPointerCapture` removes the need for the `mouseleave` bail-out
 * that mouse-only drag implementations have to ship.
 */
export function useDraggable(options: UseDraggableOptions) {
  const startRef = useRef(options.startDragCallback);
  startRef.current = options.startDragCallback;
  const dragRef = useRef(options.dragCallback);
  dragRef.current = options.dragCallback;
  const endRef = useRef(options.endDragCallback);
  endRef.current = options.endDragCallback;

  useEffect(() => {
    const handles = options.handles;
    if (handles === undefined) return;
    const list = Array.isArray(handles) ? handles : [handles];

    let startX = 0;
    let startY = 0;
    let activeHandle: HTMLElement | null = null;
    let activePointerId: number | null = null;

    function onPointerMove(event: PointerEvent) {
      if (event.pointerId !== activePointerId) return;
      dragRef.current(event.clientX - startX, event.clientY - startY, startX, startY);
    }

    function onPointerUp(event: PointerEvent) {
      if (event.pointerId !== activePointerId) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      endRef.current(deltaX, deltaY, startX, startY);
      cleanupActivePointer();
    }

    function onPointerCancel(event: PointerEvent) {
      if (event.pointerId !== activePointerId) return;
      endRef.current(
        event.clientX - startX,
        event.clientY - startY,
        startX,
        startY,
      );
      cleanupActivePointer();
    }

    function cleanupActivePointer() {
      if (activeHandle != null && activePointerId !== null) {
        try {
          activeHandle.releasePointerCapture(activePointerId);
        } catch {
          /* pointer may already be released */
        }
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      activeHandle = null;
      activePointerId = null;
    }

    function onPointerDown(event: PointerEvent) {
      // Only respond to primary button on mouse; touch/pen always pass.
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      const handle = event.currentTarget as HTMLElement;

      // Don't start a drag if the pointer landed on an interactive
      // descendant of the handle. Without this, `setPointerCapture` below
      // would redirect the subsequent pointerup to the handle and the
      // button (or input) would never receive its `click`.
      //
      // If the handle ITSELF is the interactive element (e.g. someone
      // wrapped a Button in a DragHandle), the closest match equals the
      // handle and we still allow drag.
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest(
        'button, input, select, textarea, a[href], [role="button"], [role="link"], [contenteditable="true"]',
      );
      if (interactive && interactive !== handle) return;

      activeHandle = handle;
      activePointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;

      try {
        handle.setPointerCapture(event.pointerId);
      } catch {
        /* capture may fail in some test environments */
      }

      startRef.current(startX, startY);

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerCancel);
    }

    const bound: HTMLElement[] = [];
    for (const ref of list) {
      const el = ref.current;
      if (el != null) {
        el.addEventListener('pointerdown', onPointerDown);
        bound.push(el);
      }
    }

    return () => {
      for (const el of bound) {
        el.removeEventListener('pointerdown', onPointerDown);
      }
      cleanupActivePointer();
    };
  }, [options.handles]);
}
