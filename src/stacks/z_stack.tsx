import { clsx } from 'clsx';
import React, { HTMLAttributes } from 'react';
import { stackInlineStyles } from './utils/stack_inline_styles.js';
import { CommonProps } from './types/common.js';
import { StackStyleProps } from './types/styles.js';
import styles from './stack.module.css';

export type ZStackOwnProps = CommonProps &
  StackStyleProps & {
    overflow?: 'hidden' | 'visible';
  };

export interface ZStackProps<T extends HTMLElement = HTMLElement>
  extends ZStackOwnProps,
    HTMLAttributes<T> {
  as?: string;
  children?: React.ReactNode;
}

export const ZStack = React.forwardRef(function ZStack<T extends HTMLElement>(
  {
    as = 'div',
    children,
    style,
    hAlign = 'center',
    vAlign = 'center',
    inline,
    width = 'default',
    height = 'default',
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
    className,
    overflow,
    ...attr
  }: ZStackProps<T>,
  ref: React.Ref<T>,
) {
  const As = as as React.ElementType;

  return (
    <As
      ref={ref}
      style={{
        ...stackInlineStyles({
          width, height, minWidth, maxWidth, minHeight, maxHeight,
          growWeight, shrinkWeight,
          padding, paddingBlock, paddingInline,
          margin, marginBlock, marginInline,
          zIndex, gap, rowGap, columnGap,
        }),
        overflow,
        ...style,
      }}
      className={clsx(styles['z-stack'], className, 'j13b-z-stack', 'j13b-stack')}
      data-inline={Boolean(inline)}
      data-v-alignment={vAlign}
      data-h-alignment={hAlign}
      data-height={height}
      data-width={width}
      {...attr}
    >
      {typeof children === 'string' ? <span>{children}</span> : children}
    </As>
  );
});
