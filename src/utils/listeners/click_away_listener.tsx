import React, { useCallback, useEffect, useRef } from 'react';
import { useForkRef } from '../hooks/use_fork_ref.js';

export interface ClickAwayListenerProps {
  children: React.ReactElement;
  onClickAway: (event: MouseEvent | TouchEvent) => void;
  mouseEvent?: 'onMouseUp' | 'onMouseDown' | 'onClick';
  touchEvent?: 'onTouchStart' | 'onTouchEnd';
  isException?: (target: HTMLElement) => boolean;
  /** Additional refs to treat as "inside" the listener — clicks within these
   *  refs do not trigger onClickAway. Useful when the popover and the
   *  trigger live in different DOM trees (portals). */
  refs?: React.RefObject<Element | null>[];
}

const eventMap = {
  onClick: 'click',
  onMouseDown: 'mousedown',
  onMouseUp: 'mouseup',
} as const;
const touchMap = {
  onTouchStart: 'touchstart',
  onTouchEnd: 'touchend',
} as const;

function isEventWithinElement(
  event: MouseEvent | TouchEvent,
  node: HTMLElement | null,
  activated: boolean,
  refs: (Element | null)[],
) {
  if (!activated) return true;

  let isWithinElement: boolean;
  const candidates: (Element | null)[] = [node, ...refs];

  if ((event as any).composedPath) {
    const path = (event as any).composedPath();
    isWithinElement = candidates.some((n) => n && path.indexOf(n) > -1);
  } else {
    const target = event.target as Node | null;
    isWithinElement =
      !document.documentElement.contains(target) ||
      candidates.some((n) => n?.contains(target));
  }

  return isWithinElement;
}

/**
 * Wraps a single child and calls `onClickAway` when a click happens outside
 * the wrapped element (and outside any extra refs). Tracks both pointer and
 * touch events. Mirrors Material UI's ClickAwayListener API.
 */
export const ClickAwayListener = React.forwardRef<HTMLElement, ClickAwayListenerProps>(
  function ClickAwayListener(
    { children, mouseEvent = 'onClick', touchEvent = 'onTouchEnd', onClickAway, refs = [], isException },
    ref,
  ) {
    const nodeRef = useRef<HTMLElement | null>(null);
    const startedActionWithinElementRef = useRef<boolean>(true);
    const DOMMouseEvent = eventMap[mouseEvent];
    const DOMTouchEvent = touchMap[touchEvent];
    const newRef = useForkRef(ref, nodeRef, (children as any).ref);
    const activatedRef = useRef(false);

    useEffect(() => {
      // Avoid synchronous activation — see facebook/react#20074.
      const id = window.setTimeout(() => {
        activatedRef.current = true;
      }, 0);
      return () => {
        window.clearTimeout(id);
        activatedRef.current = false;
      };
    }, []);

    const trackAction = useCallback(
      (event: MouseEvent | TouchEvent) => {
        startedActionWithinElementRef.current = isEventWithinElement(
          event,
          nodeRef.current,
          activatedRef.current,
          refs.map((r) => r.current),
        );
      },
      [refs],
    );

    const eventHandler = useCallback(
      (event: MouseEvent | TouchEvent) => {
        const startedFromWithinElement = startedActionWithinElementRef.current;
        const isWithinElement = isEventWithinElement(
          event,
          nodeRef.current,
          activatedRef.current,
          refs.map((r) => r.current),
        );

        if (
          !isWithinElement &&
          !startedFromWithinElement &&
          (!isException || !isException(event.target as HTMLElement))
        ) {
          onClickAway(event);
        }
      },
      [onClickAway, refs, isException],
    );

    useEffect(() => {
      document.addEventListener('mousedown', trackAction);
      document.addEventListener('touchstart', trackAction);
      document.addEventListener(DOMMouseEvent, eventHandler);
      document.addEventListener(DOMTouchEvent, eventHandler);
      return () => {
        document.removeEventListener('mousedown', trackAction);
        document.removeEventListener('touchstart', trackAction);
        document.removeEventListener(DOMMouseEvent, eventHandler);
        document.removeEventListener(DOMTouchEvent, eventHandler);
      };
    }, [DOMMouseEvent, DOMTouchEvent, eventHandler, trackAction]);

    return React.cloneElement(children, {
      ...(children.props as any),
      ref: newRef,
    });
  },
);
