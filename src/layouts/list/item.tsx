import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';
import styles from './list.module.css';

export interface ItemOwnProps {
  /** Visually mark the item as selected. Emits `data-is-selected`; themes
   *  paint the selection chrome via the `.j13b-interactive` cascade. */
  selected?: boolean;
}

export interface ItemProps extends Omit<HStackProps, 'as'>, ItemOwnProps {}

/**
 * Item — list row built on `<li>`. Emits `.j13b-interactive` so themes
 * can paint hover, focus, and press states via the standard state grammar.
 * `selected` flips `data-is-selected`; themes handle the redeclaration
 * (and the cascade reconciliation if buttons sit inside selected items).
 */
export const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  { children, className, selected = false, vAlign = 'center', ...props },
  ref,
) {
  return (
    <HStack
      ref={ref}
      as="li"
      vAlign={vAlign}
      data-is-selected={selected ? 'true' : 'false'}
      className={clsx(
        'j13b-item',
        'j13b-interactive',
        styles.item,
        className,
      )}
      {...props}
    >
      {children}
    </HStack>
  );
});
