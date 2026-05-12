import type { Position } from '../../types/dimensions.js';

export interface DragContainer {
  registerHandle: (handle: React.RefObject<HTMLElement | null>) => void;
  unregisterHandle: (handle: React.RefObject<HTMLElement | null>) => void;
  isDragging: boolean;
  position: Position;
  setPosition: (value: Position | ((prev: Position) => Position)) => void;
}
