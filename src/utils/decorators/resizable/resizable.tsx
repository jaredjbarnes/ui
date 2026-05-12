import React, { useMemo, useRef } from 'react';
import { clsx } from 'clsx';
import { useForkRef } from '../../hooks/use_fork_ref.js';
import { ResizableContext } from './context.js';
import { cloneWithDecorator } from '../clone_with_decorator.js';
import type {
  OnWidthResize,
  OnWidthResizeEnd,
  OnHeightResize,
  OnHeightResizeEnd,
  ResizableContextValue,
} from './types.js';
import styles from './resizable.module.css';

export interface ResizableProps {
  children: React.ReactNode;
  onWidthResize?: OnWidthResize;
  onWidthResizeEnd?: OnWidthResizeEnd;
  onHeightResize?: OnHeightResize;
  onHeightResizeEnd?: OnHeightResizeEnd;
}

interface ResizableTargetProps {
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

type ResizableTarget = React.ReactElement<ResizableTargetProps>;

function isResizableTarget(child: React.ReactNode): child is ResizableTarget {
  if (!React.isValidElement(child)) return false;
  const type = child.type;
  if (typeof type === 'string') return true;
  if (typeof type === 'function' || typeof type === 'object') {
    return (type as { displayName?: string }).displayName !== 'ResizeHandle';
  }
  return false;
}

function isResizeHandle(child: React.ReactNode): boolean {
  return React.isValidElement(child) && !isResizableTarget(child);
}

/**
 * Wraps the first non-handle child as the resizable target, and appends any
 * `<ResizeHandle>` siblings inside it. Handle ↔ target wiring goes through
 * `ResizableContext` so handles can read `targetRef` and the resize callbacks.
 *
 * Sub-component identification uses `displayName === 'ResizeHandle'`. Wrap a
 * handle in a HOC and you'll break this match — keep ResizeHandle as a direct
 * export.
 */
export function Resizable({
  children,
  onWidthResize,
  onWidthResizeEnd,
  onHeightResize,
  onHeightResizeEnd,
}: ResizableProps) {
  const targetRef = useRef<HTMLElement | null>(null);

  const childArray = React.Children.toArray(children);
  const targetChild = childArray.find(isResizableTarget);
  const handleChildren = childArray.filter(isResizeHandle);

  const contextValue = useMemo<ResizableContextValue>(
    () => ({
      targetRef,
      onWidthResize,
      onWidthResizeEnd,
      onHeightResize,
      onHeightResizeEnd,
    }),
    [onWidthResize, onWidthResizeEnd, onHeightResize, onHeightResizeEnd],
  );

  const forkedRef = useForkRef<HTMLElement>(
    targetRef,
    targetChild?.props.ref ?? undefined,
  );

  if (!targetChild) {
    return (
      <ResizableContext.Provider value={contextValue}>
        {children}
      </ResizableContext.Provider>
    );
  }

  const cloned = cloneWithDecorator(
    targetChild,
    {
      className: clsx(styles['resizable-target'], 'j13b-resizable-target'),
      ref: forkedRef as React.Ref<unknown>,
    },
    handleChildren,
  );

  return (
    <ResizableContext.Provider value={contextValue}>
      {cloned}
    </ResizableContext.Provider>
  );
}
