import { clsx } from 'clsx';
import React, { HTMLAttributes } from 'react';
import { stackInlineStyles } from './utils/stack_inline_styles.js';
import { CommonProps } from './types/common.js';
import { StackStyleProps, VerticalProps } from './types/styles.js';
import styles from './stack.module.css';

export type VStackOwnProps = CommonProps & StackStyleProps & VerticalProps;

export interface VStackProps<T extends HTMLElement = HTMLElement>
  extends VStackOwnProps,
    HTMLAttributes<T> {
  as?: string;
  children?: React.ReactNode;
}

export const VStack = React.forwardRef(function VStack<
  T extends HTMLElement = HTMLElement,
>(
  {
    as = 'div',
    children,
    style,
    className,
    hAlign = 'start',
    vAlign = 'start',
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
  }: VStackProps<T>,
  ref: React.Ref<T>,
) {
  const As = as as React.ElementType;

  return (
    <As
      ref={ref}
      className={clsx(styles['v-stack'], className, 'j13b-v-stack', 'j13b-stack')}
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
      data-overflow-y={overflowY}
      data-overflow-x={overflowX}
      {...attr}
    >
      {children}
    </As>
  );
});
