import React, { useEffect, useRef } from 'react';
import { useDragContainer } from './context.js';
import { useForkRef } from '../../hooks/use_fork_ref.js';
import { cloneWithDecorator } from '../clone_with_decorator.js';

export interface DragHandleProps {
  children: React.ReactElement<{ ref?: React.Ref<HTMLElement> }>;
}

/**
 * Marks its single child as a drag handle within the surrounding `<Draggable>`.
 * The child must be a single React element that accepts a ref; on mount, the
 * handle registers itself with the Draggable context.
 */
export const DragHandle: React.FC<DragHandleProps> = ({ children }) => {
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

  return cloneWithDecorator(children, {
    className: 'j13b-drag-handle',
    ref: mergedRef as React.Ref<unknown>,
  });
};

DragHandle.displayName = 'DragHandle';
