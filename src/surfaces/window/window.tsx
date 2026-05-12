import React from 'react';
import { clsx } from 'clsx';
import { Frame, type FrameProps } from '../../overlay/frame/frame.js';
import styles from './window.module.css';

export interface WindowOwnProps {}

export interface WindowProps extends FrameProps, WindowOwnProps {}

/**
 * Window — free-floating, non-modal surface. Draggable, resizable from all
 * sides. Like Modal but no veil and not centered by default — meant for
 * tooling palettes, secondary inspectors, or any independent floating
 * panel the user can position alongside their work.
 */
export const Window = React.forwardRef<HTMLElement, WindowProps>(function Window(
  {
    children,
    className,
    isOpen,
    veil = false,
    draggable = true,
    resizable = true,
    ...props
  },
  ref,
) {
  return (
    <Frame
      ref={ref}
      isOpen={isOpen}
      veil={veil}
      draggable={draggable}
      resizable={resizable}
      className={clsx('j13b-surface', 'j13b-window', styles.window, className)}
      {...props}
    >
      {children}
    </Frame>
  );
});
