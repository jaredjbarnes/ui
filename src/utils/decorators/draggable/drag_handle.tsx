import React, { useEffect, useRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { useDragContainer } from './context.js';
import { useForkRef } from '../../hooks/use_fork_ref.js';
import { cloneWithDecorator } from '../clone_with_decorator.js';

export interface DragHandleProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  children: React.ReactElement<{ ref?: React.Ref<HTMLElement> }>;
}

/**
 * Marks its single child as a drag handle within the surrounding `<Draggable>`.
 * The child must be a single React element that accepts a ref; on mount, the
 * handle registers itself with the Draggable context.
 *
 * Props that arrive on DragHandle itself (className, style, data-*, etc.) are
 * forwarded to the child. This matters when `<Draggable>` is given a
 * `<DragHandle>` directly as its child — Draggable's `cloneElement` injects
 * `j13b-draggable`, the `--position-x/y` style, and `data-is-draggable` onto
 * the DragHandle element. Without forwarding, those props would die at the
 * DragHandle component boundary and the system layer's `top`/`left` rule
 * would never have any CSS variables to apply.
 */
export const DragHandle: React.FC<DragHandleProps> = ({ children, ...rest }) => {
  const { registerHandle, unregisterHandle } = useDragContainer();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current == null) return;
    registerHandle(ref);
    return () => {
      unregisterHandle(ref);
    };
  }, [registerHandle, unregisterHandle]);

  const mergedRef = useForkRef<HTMLElement>(
    ref,
    (children.props as { ref?: React.Ref<HTMLElement> }).ref,
  );

  const { className: outerClassName, ...passThrough } = rest as {
    className?: ClassValue;
    [key: string]: unknown;
  };

  return cloneWithDecorator(children, {
    ...passThrough,
    className: clsx(outerClassName, 'j13b-drag-handle'),
    ref: mergedRef as React.Ref<unknown>,
  });
};

DragHandle.displayName = 'DragHandle';
