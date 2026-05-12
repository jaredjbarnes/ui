import React from 'react';
import { clsx } from 'clsx';
import { HStack } from '../../stacks/h_stack.js';
import { VStack } from '../../stacks/v_stack.js';
import { Spacer } from '../../stacks/spacer.js';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Modal, type ModalProps } from '../modal/modal.js';
import styles from './confirm.module.css';

export interface ConfirmOwnProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** The action buttons (Cancel / OK). Rendered in a right-aligned row at
   *  the bottom of the dialog. */
  actions?: React.ReactNode;
  /** Optional adornment above the title (icon, illustration). */
  graphic?: React.ReactNode;
}

export interface ConfirmProps
  extends Omit<ModalProps, 'title' | 'children'>,
    ConfirmOwnProps {
  children?: React.ReactNode;
}

/**
 * Confirm — preset Modal for confirmation prompts. Lays out a graphic,
 * title, description, and actions row. Pass `children` instead of
 * description for richer content (forms, etc.).
 */
export const Confirm = React.forwardRef<HTMLElement, ConfirmProps>(function Confirm(
  { isOpen, title, description, actions, graphic, children, className, ...rest },
  ref,
) {
  return (
    <Modal
      ref={ref}
      isOpen={isOpen}
      className={clsx('j13b-confirm', styles.confirm, className)}
      {...rest}
    >
      <VStack
        padding="20px"
        gap="12px"
        hAlign="center"
        width="default"
        minWidth="320px"
      >
        {graphic}
        {typeof title === 'string' ? <Title size="md">{title}</Title> : title}
        {typeof description === 'string' ? (
          <BodyText>{description}</BodyText>
        ) : (
          description
        )}
        {children}
        {actions && (
          <>
            <Spacer height="8px" />
            <HStack width="default" gap="8px">
              <Spacer />
              {actions}
            </HStack>
          </>
        )}
      </VStack>
    </Modal>
  );
});
