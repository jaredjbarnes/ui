import { clsx } from 'clsx';
import React, { HTMLAttributes } from 'react';
import { stackInlineStyles } from './utils/stack_inline_styles.js';
import { CommonProps } from './types/common.js';
import { HorizontalProps, StackStyleProps } from './types/styles.js';
import styles from './stack.module.css';

export type HStackOwnProps = CommonProps & StackStyleProps & HorizontalProps;
export interface HStackProps<T extends HTMLElement = HTMLElement>
  extends HStackOwnProps,
    HTMLAttributes<T> {
  as?: string;
  children?: React.ReactNode;
}

export const HStack = React.forwardRef(function HStack<T extends HTMLElement>(
  {
    as = 'div',
    children,
    style,
    className,
    hAlign = 'start',
    vAlign = 'center',
    inline,
    allowFlow,
    width = inline ? 'auto' : 'default',
    height = inline ? 'auto' : 'default',
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    growWeight,
    shrinkWeight,
    padding,
    paddingBlock,
    paddingInline,
    margin,
    marginBlock,
    marginInline,
    zIndex,
    gap,
    rowGap,
    columnGap,
    overflowX,
    overflowY,
    ...attr
  }: HStackProps<T>,
  ref: React.Ref<T>,
) {
  const As = as as React.ElementType;

  return (
    <As
      ref={ref}
      className={clsx(styles['h-stack'], className, 'j13b-h-stack', 'j13b-stack')}
      style={{
        ...stackInlineStyles({
          width, height, minWidth, maxWidth, minHeight, maxHeight,
          growWeight, shrinkWeight,
          padding, paddingBlock, paddingInline,
          margin, marginBlock, marginInline,
          zIndex, gap, rowGap, columnGap,
        }),
        overflowX,
        overflowY,
        ...style,
      }}
      data-inline={Boolean(inline)}
      data-allow-flow={Boolean(allowFlow)}
      data-v-alignment={vAlign}
      data-h-alignment={hAlign}
      data-height={height}
      data-width={width}
      data-overflow-x={overflowX}
      data-overflow-y={overflowY}
      {...attr}
    >
      {children}
    </As>
  );
});
