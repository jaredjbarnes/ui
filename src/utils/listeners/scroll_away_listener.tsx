import React, { useEffect, useRef } from 'react';
import { useForkRef } from '../hooks/use_fork_ref.js';

export interface ScrollAwayListenerProps {
  children: React.ReactElement;
  /** Return true to ignore a particular scroll target (e.g., scroll inside
   *  a sibling element you also want to keep "alive"). */
  isException?: (target: HTMLElement) => boolean;
  onScrollAway: () => void;
}

/**
 * Wraps a single child and calls `onScrollAway` when any scroll event in the
 * document originates outside the wrapped element. The listener removes
 * itself after firing once.
 *
 * Typical use: tooltips, popovers, dropdowns that should dismiss when the
 * user starts scrolling somewhere else. Render this only while the popover
 * is open so the document listener isn't always attached.
 */
export const ScrollAwayListener = React.forwardRef<HTMLElement, ScrollAwayListenerProps>(
  function ScrollAwayListener({ children, onScrollAway, isException }, ref) {
    const nodeRef = useRef<HTMLElement | null>(null);
    const newRef = useForkRef(ref, nodeRef, (children as any).ref);

    useEffect(() => {
      const onScroll = (event: Event) => {
        let insideDOM: boolean;
        const target = event.target as HTMLElement;

        if (isException && isException(target)) {
          insideDOM = true;
        } else if ((event as any).composedPath) {
          insideDOM = (event as any).composedPath().indexOf(nodeRef.current) > -1;
        } else {
          insideDOM =
            !document.documentElement.contains(target) ||
            !!nodeRef.current?.contains(target);
        }

        if (!insideDOM) {
          onScrollAway();
          document.removeEventListener('scroll', onScroll, true);
        }
      };
      document.addEventListener('scroll', onScroll, true);
      return () => {
        document.removeEventListener('scroll', onScroll, true);
      };
    }, [onScrollAway, isException]);

    return React.cloneElement(children, {
      ...(children.props as any),
      ref: newRef,
    });
  },
);
