import React, { useLayoutEffect, useState } from 'react';
import type { Dimensions } from '../../../utils/types/dimensions.js';
import { useResizeObserver } from '../../../utils/hooks/use_resize_observer.js';

/**
 * Tracks a ref'd element's dimensions live via the shared ResizeObserver
 * registry. Returns { width: 0, height: 0 } until the element mounts.
 */
export function useRefDimensions(ref: React.RefObject<HTMLElement | null>): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  const resizeRef = useResizeObserver<HTMLElement>((width, height) => {
    setDimensions({ width, height });
  });

  useLayoutEffect(() => {
    resizeRef(ref.current);
  }, [ref, resizeRef]);

  return dimensions;
}
