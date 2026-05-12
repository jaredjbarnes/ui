import React from 'react';
import { clsx } from 'clsx';
import { HStack } from '../../stacks/h_stack.js';
import { VStack } from '../../stacks/v_stack.js';
import { Spacer } from '../../stacks/spacer.js';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Popover, type PopoverProps } from '../popover/popover.js';
import styles from './pop_confirm.module.css';

export interface PopConfirmOwnProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

// `title` collides with the HTML attribute (string vs ReactNode); ours wins.
export interface PopConfirmProps
  extends Omit<PopoverProps, 'children' | 'title'>,
    PopConfirmOwnProps {
  children?: React.ReactNode;
}

/**
 * PopConfirm — preset Popover for inline "are you sure?" prompts. Anchors
 * to a trigger and shows a compact title + description + actions row. Use
 * for low-stakes confirmations that don't need a full Modal.
 */
export const PopConfirm = React.forwardRef<HTMLDivElement, PopConfirmProps>(
  function PopConfirm(
    { title, description, actions, children, className, ...rest },
    ref,
  ) {
    return (
      <Popover
        ref={ref}
        className={clsx('j13b-pop-confirm', styles['pop-confirm'], className)}
        {...rest}
      >
        <VStack padding="12px" gap="8px" width="default" minWidth="220px">
          {typeof title === 'string' ? <Title size="sm">{title}</Title> : title}
          {typeof description === 'string' ? (
            <BodyText size="sm">{description}</BodyText>
          ) : (
            description
          )}
          {children}
          {actions && (
            <HStack width="default" gap="6px">
              <Spacer />
              {actions}
            </HStack>
          )}
        </VStack>
      </Popover>
    );
  },
);
