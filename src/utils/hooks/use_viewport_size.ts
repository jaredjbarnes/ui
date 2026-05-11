import { useLayoutEffect, useState } from 'react';
import { useResizeObserver } from './use_resize_observer.js';

export interface ViewportSize {
  width: number;
  height: number;
}

/**
 * Track the viewport size by observing `document.body`. Returns
 * `{ width: 0, height: 0 }` before the first measurement.
 */
export function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>({ width: 0, height: 0 });
  const resizeRef = useResizeObserver<HTMLElement>((width, height) => {
    setSize({ width, height });
  });

  useLayoutEffect(() => {
    resizeRef(document.body);
  }, [resizeRef]);

  return size;
}
