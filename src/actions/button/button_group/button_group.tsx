import React from 'react';
import { clsx } from 'clsx';
import { HStack } from '../../../stacks/h_stack.js';
import type { Hierarchy, Size } from '../../../utils/index.js';
import styles from './button_group.module.css';

/** Minimum surface a child needs to participate in the group. Button and
 *  Toggle both satisfy this; bespoke wrappers can too as long as they
 *  forward className and accept hierarchy/size. Toggle ignores the injected
 *  hierarchy because it owns its own selected→primary mapping. */
interface ButtonGroupChildProps {
  className?: string;
  hierarchy?: Hierarchy;
  size?: Size;
}

export interface ButtonGroupOwnProps {
  /** Hierarchy applied to every child. Buttons are rendered as a visually
   *  unified row, so mixing hierarchies wouldn't read clearly. Components
   *  that own their own hierarchy (e.g. Toggle) silently ignore it. */
  hierarchy?: Hierarchy;
  size?: Size;
  /** Optional sizing for the group container. */
  width?: 'default' | 'auto' | 'fill' | string | number;
  children: React.ReactNode;
}

export type ButtonGroupProps = ButtonGroupOwnProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof ButtonGroupOwnProps>;

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(
    {
      children,
      className,
      hierarchy = 'secondary',
      size = 'md',
      width = 'auto',
      ...rest
    },
    ref,
  ) {
    const items = React.Children.toArray(children).filter(
      React.isValidElement,
    ) as React.ReactElement<ButtonGroupChildProps>[];

    return (
      <HStack
        ref={ref as React.Ref<HTMLElement>}
        inline
        width={width}
        height="auto"
        data-hierarchy={hierarchy}
        data-size={size}
        className={clsx(styles['button-group'], 'j13b-button-group', className)}
        {...rest}
      >
        {items.map((item, i) =>
          React.cloneElement(item, {
            key: item.key ?? i,
            className: clsx(
              styles['button-group-button'],
              'j13b-button-group-button',
              item.props.className,
            ),
            hierarchy,
            size,
          }),
        )}
      </HStack>
    );
  },
);
