import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export type ResizeTriggerAxis = 'both' | 'width' | 'height';

export type ResizeHandler = (
  newWidth: number,
  newHeight: number,
  entry: ResizeObserverEntry,
) => void;

interface Size {
  width: number;
  height: number;
}

class ResizeObserverRegistry {
  private _resizeObserver: ResizeObserver | null;
  private _elementHandlers: WeakMap<Element, ResizeHandler[]>;
  private _elementSizes: WeakMap<Element, Size>;
  private _elementTriggerAxes: WeakMap<Element, ResizeTriggerAxis>;

  constructor() {
    this._elementHandlers = new WeakMap();
    this._elementSizes = new WeakMap();
    this._elementTriggerAxes = new WeakMap();
    this._resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(this._handleEntries)
        : null;
  }

  private _handleEntries = (entries: ResizeObserverEntry[]) => {
    requestAnimationFrame(() => {
      for (const entry of entries) {
        const size = this._elementSizes.get(entry.target);
        if (size == null) continue;

        const box = entry.borderBoxSize[0];
        if (box == null) continue;
        const newHeight = box.blockSize;
        const newWidth = box.inlineSize;
        const axis = this._elementTriggerAxes.get(entry.target) ?? 'both';
        const widthChanged = newWidth !== size.width;
        const heightChanged = newHeight !== size.height;

        size.width = newWidth;
        size.height = newHeight;

        const shouldFire =
          (widthChanged && (axis === 'both' || axis === 'width')) ||
          (heightChanged && (axis === 'both' || axis === 'height'));
        if (!shouldFire) continue;

        const handlers = this._elementHandlers.get(entry.target);
        handlers?.forEach((handler) => handler(newWidth, newHeight, entry));
      }
    });
  };

  register(element: Element, handler: ResizeHandler, axis: ResizeTriggerAxis) {
    if (this._resizeObserver == null) {
      return () => {};
    }

    if (!this._elementSizes.has(element)) {
      this._elementSizes.set(element, { width: 0, height: 0 });
    }
    this._elementTriggerAxes.set(element, axis);
    this._resizeObserver.observe(element);

    const handlers = this._getElementHandlers(element);
    handlers.push(handler);

    return () => {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
      if (handlers.length <= 0) {
        this._elementHandlers.delete(element);
        this._elementSizes.delete(element);
        this._elementTriggerAxes.delete(element);
        this._resizeObserver!.unobserve(element);
      }
    };
  }

  setAxis(element: Element, axis: ResizeTriggerAxis) {
    if (this._elementHandlers.has(element)) {
      this._elementTriggerAxes.set(element, axis);
    }
  }

  private _getElementHandlers(element: Element): ResizeHandler[] {
    let handlers = this._elementHandlers.get(element);
    if (handlers == null) {
      handlers = [];
      this._elementHandlers.set(element, handlers);
    }
    return handlers;
  }
}

const registry = new ResizeObserverRegistry();

/**
 * Observe an element's size via a process-wide ResizeObserver.
 *
 * Returns a callback ref — attach it to the JSX element you want to observe.
 * The handler fires once synchronously on register (so the first paint has a
 * real measurement, not zero) and then on every size change that matches
 * `triggerAxis`.
 *
 * All callers share a single `ResizeObserver` instance and updates are
 * batched in `requestAnimationFrame`.
 */
export function useResizeObserver<T extends Element>(
  resizeHandler: ResizeHandler,
  triggerAxis: ResizeTriggerAxis = 'both',
) {
  const [element, setElement] = useState<T | null>(null);

  const callbackRef = useCallback((newElement: T | null) => {
    setElement(newElement);
  }, []);

  const handlerRef = useRef<ResizeHandler>(resizeHandler);
  handlerRef.current = resizeHandler;

  const axisRef = useRef<ResizeTriggerAxis>(triggerAxis);
  axisRef.current = triggerAxis;
  // Keep the registry's axis in sync without re-registering.
  if (element != null) {
    registry.setAxis(element, triggerAxis);
  }

  useLayoutEffect(() => {
    if (element == null) return;

    const proxyHandler: ResizeHandler = (w, h, entry) => {
      handlerRef.current(w, h, entry);
    };
    const unregister = registry.register(element, proxyHandler, axisRef.current);

    // Synchronous initial measurement so callers don't see a 0×0 flash.
    const rect = element.getBoundingClientRect();
    const simulatedEntry = {
      target: element,
      contentRect: rect,
      borderBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
      contentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
      devicePixelContentBoxSize: [
        {
          inlineSize: rect.width * window.devicePixelRatio,
          blockSize: rect.height * window.devicePixelRatio,
        },
      ],
    } as unknown as ResizeObserverEntry;
    handlerRef.current(rect.width, rect.height, simulatedEntry);

    return unregister;
  }, [element]);

  return callbackRef;
}
