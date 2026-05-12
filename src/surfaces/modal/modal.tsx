import React from 'react';
import { clsx } from 'clsx';
import { Frame, type FrameProps } from '../../overlay/frame/frame.js';
import styles from './modal.module.css';

export interface ModalOwnProps {}

export interface ModalProps extends FrameProps, ModalOwnProps {}

/**
 * Modal — centered, veiled, optionally draggable/resizable surface for
 * confirmation flows, full forms, and any focused interaction that blocks
 * the rest of the page. Built on `Frame`; the theme paints `.j13b-modal`.
 *
 * Default veil:on, draggable:on, resizable:off — modals usually don't
 * resize, but you can opt in. Drop a `<DragHandle>` around the Header to
 * make the modal draggable from its title bar.
 */
export const Modal = React.forwardRef<HTMLElement, ModalProps>(function Modal(
  {
    children,
    className,
    isOpen,
    veil = true,
    draggable = true,
    resizable = false,
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
      className={clsx('j13b-surface', 'j13b-modal', styles.modal, className)}
      {...props}
    >
      {children}
    </Frame>
  );
});
