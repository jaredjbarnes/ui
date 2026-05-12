import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import styles from './list.module.css';

export interface ListOwnProps {
  /** Render as `<ol>` (ordered) instead of `<ul>` (unordered, default). */
  isOrdered?: boolean;
}

export interface ListProps extends Omit<VStackProps, 'as'>, ListOwnProps {}

/**
 * List — semantic `<ul>` / `<ol>` styled as a VStack. Items inside are
 * typically `<Item>`. The list itself doesn't paint a material; it's a
 * layout, and any visual treatment of items comes from `Item`'s
 * `.j13b-interactive` chrome.
 */
export const List = React.forwardRef<HTMLElement, ListProps>(function List(
  { children, className, isOrdered = false, ...props },
  ref,
) {
  return (
    <VStack
      ref={ref}
      as={isOrdered ? 'ol' : 'ul'}
      className={clsx('j13b-list', styles.list, className)}
      {...props}
    >
      {children}
    </VStack>
  );
});
