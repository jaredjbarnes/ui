import { clsx } from 'clsx';
import React from 'react';

export interface SpacerProps {
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  fullHeight?: boolean;
  fullWidth?: boolean;
  fillSpaceWeight?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(function Spacer(
  {
    width = 'auto',
    height = 'auto',
    fullHeight = false,
    fullWidth = false,
    fillSpaceWeight = 1,
    style,
    className,
  }: SpacerProps,
  ref,
) {
  const flex = width === 'auto' && height === 'auto' ? fillSpaceWeight : undefined;
  const finalWidth = fullWidth ? '100%' : width;
  const finalHeight = fullHeight ? '100%' : height;
  return (
    <div
      ref={ref}
      style={{
        ...style,
        position: 'relative',
        width: finalWidth,
        minWidth: finalWidth,
        height: finalHeight,
        minHeight: finalHeight,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        flex,
      }}
      className={clsx('spacer', className, 'j13b-spacer')}
    ></div>
  );
});
