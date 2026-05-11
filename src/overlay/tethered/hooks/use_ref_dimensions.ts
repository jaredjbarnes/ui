import React, { useLayoutEffect, useState } from 'react';
import type { Dimensions } from '../../../utils/types/dimensions.js';

function getDimensions(element: HTMLElement | null): Dimensions {
  if (!element) return { width: 0, height: 0 };
  const rect = element.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

/**
 * Tracks a ref'd element's dimensions live via ResizeObserver.
 * Returns { width: 0, height: 0 } until the element mounts.
 */
export function useRefDimensions(ref: React.RefObject<HTMLElement | null>): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>(() =>
    getDimensions(ref.current),
  );

  useLayoutEffect(() => {
    const update = () => {
      setDimensions(getDimensions(ref.current));
    };

    update();

    if (!ref.current) return;
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return dimensions;
}
