import { useLayoutEffect, useRef, useState } from 'react';
import type { Rectangle } from './types/dimensions.js';
import { useResizeObserver } from './hooks/use_resize_observer.js';
import { useForkRef } from './hooks/use_fork_ref.js';

/**
 * Convert a rectangle into a set of `--<component>-<state>-rectangle-*`
 * CSS variables — useful for theme rules that need to animate to or from
 * the position/size of an element (e.g. the active-tab underline).
 */
export function convertRectangleToCssVariables(
  componentName: string,
  stateName: string,
  rectangle?: Rectangle | null,
): Record<string, string> {
  if (!rectangle) return {};
  const prefix = `--${componentName}-${stateName}-rectangle-`;
  return {
    [`${prefix}position-x`]: `${rectangle.position.x}px`,
    [`${prefix}position-y`]: `${rectangle.position.y}px`,
    [`${prefix}width`]: `${rectangle.dimensions.width}px`,
    [`${prefix}height`]: `${rectangle.dimensions.height}px`,
  };
}

function getElementRect(element: HTMLElement | null): Rectangle | null {
  if (!element) return null;
  return {
    dimensions: { width: element.offsetWidth, height: element.offsetHeight },
    position: { x: element.offsetLeft, y: element.offsetTop },
  };
}

/**
 * Track the offset rectangle of a ref'd element when `isActive` is true.
 * Routes through the shared `useResizeObserver` registry. Returns a
 * callback ref that the consumer attaches to the element they want to
 * track, plus the most recent rectangle (or null until first measurement).
 */
export function useTrackActiveItemRectangle(isActive: boolean) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [rectangle, setRectangle] = useState<Rectangle | null>(null);

  const measure = () => {
    if (!isActive) return;
    const rect = getElementRect(elementRef.current);
    if (rect) setRectangle(rect);
  };

  const resizeRef = useResizeObserver<HTMLElement>(() => {
    measure();
  });

  const callbackRef = (el: HTMLElement | null) => {
    elementRef.current = el;
    resizeRef(el);
  };

  // Window resizes can change offsetLeft/offsetTop even when the element
  // itself didn't resize, so listen for that separately.
  useLayoutEffect(() => {
    if (!isActive) return;
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    measure();
    return () => window.removeEventListener('resize', onResize);
    // measure reads isActive; effect is tied to its identity.
  }, [isActive]);

  const ref = useForkRef<HTMLElement>(callbackRef);
  return { ref, rectangle };
}
