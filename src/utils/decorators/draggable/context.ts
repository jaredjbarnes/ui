import { createContext, useContext } from 'react';
import type { DragContainer } from './types.js';

const defaultValue: DragContainer = {
  registerHandle: () => {},
  unregisterHandle: () => {},
  isDragging: false,
  position: { x: 0, y: 0 },
  setPosition: () => {},
};

export const DragContainerContext = createContext<DragContainer>(defaultValue);

/**
 * Access the surrounding `<Draggable>`'s container. Returns a no-op default
 * (not a throw) so `<DragHandle>` can render anywhere — a warning fires once
 * if used without a container so devs notice the mistake.
 */
export function useDragContainer(): DragContainer {
  const context = useContext(DragContainerContext);
  if (context === defaultValue) {
    // biome-ignore lint/suspicious/noConsole: Surface a setup mistake.
    console.warn(
      'useDragContainer: no DragContainerContext found — DragHandle will not bind.',
    );
  }
  return context;
}
