import React, { forwardRef, useLayoutEffect, useState, type PropsWithChildren } from 'react';
import type { Rectangle } from '../../utils/types/dimensions.js';
import { Tethered, type TetheredProps } from './tethered.js';

export interface ElementTetheredProps extends Omit<TetheredProps, 'anchor'> {
  /** Ref to the trigger element to anchor against. */
  anchorElement: React.RefObject<HTMLElement | null>;
}

function getElementRect(element: HTMLElement | null): Rectangle | null {
  if (!element) return null;
  const r = element.getBoundingClientRect();
  return {
    position: { x: r.left, y: r.top },
    dimensions: { width: r.width, height: r.height },
  };
}

/**
 * Tethered overlay anchored to a React-ref'd element. Tracks the trigger's
 * size (ResizeObserver) and viewport scroll/resize so the overlay stays
 * positioned correctly as the trigger moves.
 */
export const ElementTethered = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ElementTetheredProps>
>(function ElementTethered({ anchorElement, children, ...rest }, ref) {
  const [rectangle, setRectangle] = useState<Rectangle | null>(null);

  useLayoutEffect(() => {
    const element = anchorElement.current;
    if (!element) return;

    const update = () => {
      setRectangle(getElementRect(element));
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(element);
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [anchorElement]);

  return (
    <Tethered ref={ref} anchor={rectangle} {...rest}>
      {children}
    </Tethered>
  );
});
