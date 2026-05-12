import React, { useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import { ZStack } from '../../stacks/z_stack.js';
import {
  Draggable,
  useDragContainer,
  Resizable,
  ResizeHandle,
  type OnWidthResizePayload,
  type OnHeightResizePayload,
} from '../../utils/decorators/index.js';
import { Portal } from '../portal/portal.js';
import styles from './frame.module.css';

export interface FrameOwnProps {
  /** Mount and show the frame. When false the frame is unmounted. */
  isOpen?: boolean;
  /** Allow the dialog to be dragged via a `<DragHandle>` inside it. */
  draggable?: boolean;
  /** Render a backdrop veil over the rest of the page. */
  veil?: boolean;
  /** Master switch — when false, no resize handles render even if their
   *  per-side flags are true. */
  resizable?: boolean;

  enableResizeOnTop?: boolean;
  enableResizeOnBottom?: boolean;
  enableResizeOnStart?: boolean;
  enableResizeOnEnd?: boolean;
}

// `draggable` collides with the native HTML attribute (Booleanish vs boolean).
// Our prop wins; the HTML attribute is dropped.
export interface FrameProps
  extends Omit<VStackProps, 'as' | 'draggable'>,
    FrameOwnProps {}

/**
 * Frame — shared floating-dialog primitive. Renders its children through a
 * `Portal`, optionally wraps in a backdrop veil, and composes the
 * `Draggable` + `Resizable` decorators so consumers (Modal, Window, Drawer,
 * Popover) get drag and edge-resize for free.
 *
 * The position-counter-translation logic on resize keeps a centered Frame
 * (Modal) visually centered as you resize from any edge: when the left
 * edge moves, the Frame translates by half the delta so the visual center
 * stays put. For a free-floating Frame (Window), the translation also
 * works correctly — `draggable=true` is what gates it.
 */
export const Frame = React.forwardRef<HTMLElement, FrameProps>(function Frame(
  {
    children,
    isOpen = false,
    draggable = true,
    veil = false,
    resizable = true,
    className,
    enableResizeOnTop = true,
    enableResizeOnBottom = true,
    enableResizeOnStart = true,
    enableResizeOnEnd = true,
    minWidth = 1,
    minHeight = 1,
    ...rest
  },
  ref,
) {
  if (!isOpen) return null;
  return (
    <Portal>
      <ZStack
        width="100%"
        height="100%"
        data-is-veil={veil}
        className={clsx('j13b-frame-veil', styles['frame-veil'])}
      >
        <Draggable draggable={draggable}>
          <FrameDialog
            ref={ref}
            className={className}
            draggable={draggable}
            enableResizeOnStart={resizable && enableResizeOnStart}
            enableResizeOnEnd={resizable && enableResizeOnEnd}
            enableResizeOnTop={resizable && enableResizeOnTop}
            enableResizeOnBottom={resizable && enableResizeOnBottom}
            minWidth={minWidth}
            minHeight={minHeight}
            {...rest}
          >
            {children}
          </FrameDialog>
        </Draggable>
      </ZStack>
    </Portal>
  );
});

interface FrameDialogProps extends Omit<VStackProps, 'as' | 'draggable'> {
  draggable?: boolean;
  enableResizeOnTop?: boolean;
  enableResizeOnBottom?: boolean;
  enableResizeOnStart?: boolean;
  enableResizeOnEnd?: boolean;
  onWidthResize?: (payload: OnWidthResizePayload) => void;
  onHeightResize?: (payload: OnHeightResizePayload) => void;
  onWidthResizeEnd?: (width: number, origin: 'start' | 'end') => void;
  onHeightResizeEnd?: (height: number, origin: 'top' | 'bottom') => void;
}

const FrameDialog = React.forwardRef<HTMLElement, FrameDialogProps>(
  function FrameDialog(
    {
      children,
      className,
      role = 'dialog',
      draggable,
      onWidthResize,
      onHeightResize,
      onWidthResizeEnd,
      onHeightResizeEnd,
      enableResizeOnTop,
      enableResizeOnBottom,
      enableResizeOnStart,
      enableResizeOnEnd,
      ...rest
    },
    ref,
  ) {
    const drag = useDragContainer();
    const prevWidthRef = useRef<number | null>(null);
    const prevHeightRef = useRef<number | null>(null);

    const handleWidthResize = useCallback(
      (payload: OnWidthResizePayload) => {
        const actualDelta =
          prevWidthRef.current !== null
            ? payload.width - prevWidthRef.current
            : payload.currentDelta;
        prevWidthRef.current = payload.width;

        if (!draggable || actualDelta === 0) {
          onWidthResize?.(payload);
          return;
        }
        // Counter-translate by half the delta so a centered Frame stays
        // visually centered. End handle (right): width grew right, so shift
        // right by half. Start handle (left): width grew left, shift left.
        const sign = payload.origin === 'end' ? 1 : -1;
        const dx = (actualDelta / 2) * sign;
        flushSync(() => {
          drag.setPosition((prev) => ({ x: prev.x + dx, y: prev.y }));
        });

        onWidthResize?.(payload);
      },
      [onWidthResize, drag, draggable],
    );

    const handleHeightResize = useCallback(
      (payload: OnHeightResizePayload) => {
        const actualDelta =
          prevHeightRef.current !== null
            ? payload.height - prevHeightRef.current
            : payload.currentDelta;
        prevHeightRef.current = payload.height;

        if (!draggable || actualDelta === 0) {
          onHeightResize?.(payload);
          return;
        }
        const sign = payload.origin === 'bottom' ? 1 : -1;
        const dy = (actualDelta / 2) * sign;
        flushSync(() => {
          drag.setPosition((prev) => ({ x: prev.x, y: prev.y + dy }));
        });
        onHeightResize?.(payload);
      },
      [onHeightResize, drag, draggable],
    );

    return (
      <Resizable
        onWidthResize={handleWidthResize}
        onHeightResize={handleHeightResize}
        onWidthResizeEnd={(width, origin) => {
          prevWidthRef.current = null;
          onWidthResizeEnd?.(width, origin);
        }}
        onHeightResizeEnd={(height, origin) => {
          prevHeightRef.current = null;
          onHeightResizeEnd?.(height, origin);
        }}
      >
        <VStack
          ref={ref}
          as="div"
          role={role}
          className={clsx('j13b-frame', 'j13b-frame-dialog', styles.frame, className)}
          {...rest}
        >
          {children}
        </VStack>
        {enableResizeOnTop && <ResizeHandle position="top" />}
        {enableResizeOnBottom && <ResizeHandle position="bottom" />}
        {enableResizeOnStart && <ResizeHandle position="start" />}
        {enableResizeOnEnd && <ResizeHandle position="end" />}
      </Resizable>
    );
  },
);
