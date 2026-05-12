import React from 'react';
import { clsx } from 'clsx';
import { Frame, type FrameProps } from '../../overlay/frame/frame.js';
import styles from './drawer.module.css';

export type DrawerSide = 'top' | 'bottom' | 'start' | 'end';

export interface DrawerOwnProps {
  side: DrawerSide;
}

/**
 * Drawer is anchored to a side and not draggable. Resize is allowed only
 * on the edge that faces the rest of the content (a `bottom` drawer
 * resizes from its top, etc.), so the per-side flags are derived from
 * `side` and the public API hides them.
 */
export type DrawerProps = Omit<
  FrameProps,
  | 'draggable'
  | 'enableResizeOnTop'
  | 'enableResizeOnBottom'
  | 'enableResizeOnStart'
  | 'enableResizeOnEnd'
> &
  DrawerOwnProps;

export const Drawer = React.forwardRef<HTMLElement, DrawerProps>(function Drawer(
  { children, side, resizable = false, veil = false, className, ...rest },
  ref,
) {
  const isVertical = side === 'top' || side === 'bottom';

  return (
    <Frame
      ref={ref}
      draggable={false}
      resizable={resizable}
      veil={veil}
      enableResizeOnTop={side === 'bottom'}
      enableResizeOnBottom={side === 'top'}
      enableResizeOnStart={side === 'end'}
      enableResizeOnEnd={side === 'start'}
      data-side={side}
      data-is-vertical={isVertical}
      data-is-horizontal={!isVertical}
      className={clsx('j13b-surface', 'j13b-drawer', styles.drawer, className)}
      {...rest}
    >
      {children}
    </Frame>
  );
});
