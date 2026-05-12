import React, { useMemo, type CSSProperties } from 'react';
import { clsx } from 'clsx';
import { DragContainerContext } from './context.js';
import { useMakeDragContainer } from './use_drag_container.js';
import { cloneWithDecorator } from '../clone_with_decorator.js';
import styles from './draggable.module.css';

export interface DraggableProps {
  children: React.ReactElement;
  /** Disable drag without unmounting. Default `true`. */
  draggable?: boolean;
}

/**
 * Wraps a single child element and makes it draggable via any nested
 * `<DragHandle>`. Drag position is published as `--position-x` / `--position-y`
 * CSS variables on the child — the system-layer rule applies them as `top`/
 * `left`, but themes are free to ignore them and use `transform` instead.
 */
export const Draggable: React.FC<DraggableProps> = ({
  children,
  draggable = true,
}) => {
  const context = useMakeDragContainer({});

  const cssVariables = useMemo<CSSProperties>(
    () =>
      ({
        '--position-x': `${context.position.x}px`,
        '--position-y': `${context.position.y}px`,
      }) as CSSProperties,
    [context.position],
  );

  const cloned = cloneWithDecorator(children, {
    className: clsx('j13b-draggable', styles.draggable),
    style: cssVariables,
    'data-is-dragging': context.isDragging,
    'data-is-draggable': draggable,
  });

  return (
    <DragContainerContext.Provider value={context}>
      {cloned}
    </DragContainerContext.Provider>
  );
};
