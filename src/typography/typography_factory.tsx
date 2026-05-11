import React from 'react';
import { clsx } from 'clsx';
import type { Size } from '../utils/index.js';
import styles from './typography.module.css';

export interface TypographyOwnProps {
  /** Override the rendered HTML tag. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Variant size — themes provide concrete font-size values per size. */
  size?: Size;
  /** Force inline display regardless of the rendered tag. */
  inline?: boolean;
}

export type TypographyProps = TypographyOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof TypographyOwnProps>;

interface FactoryOptions {
  /** Variant slug used in class name (e.g. 'title' → '.j13b-title'). */
  variant: string;
  /** Default rendered tag if `as` is not supplied. */
  defaultTag: keyof React.JSX.IntrinsicElements;
  /** Default size if `size` is not supplied. */
  defaultSize?: Size;
  /** Display name for React DevTools / Storybook. */
  displayName: string;
}

export function createTypographyComponent(opts: FactoryOptions) {
  const { variant, defaultTag, defaultSize = 'md', displayName } = opts;

  const Component = React.forwardRef<HTMLElement, TypographyProps>(
    function TypographyVariant(
      { as, size = defaultSize, inline = false, className, children, ...rest },
      ref,
    ) {
      const Tag = (as ?? defaultTag) as React.ElementType;
      return (
        <Tag
          ref={ref}
          data-size={size}
          className={clsx(
            styles.typography,
            'j13b-typography',
            `j13b-${variant}`,
            inline && styles['typography-inline'],
            className,
          )}
          {...rest}
        >
          {children}
        </Tag>
      );
    },
  );

  Component.displayName = displayName;
  return Component;
}
