import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackOwnProps } from '../../../../stacks/index.js';
import type { WithDetailedHTMLProps } from '../../../../stacks/types/as.js';
import { FieldErrorMessage } from '../field_error.js';
import styles from './field_control.module.css';

export interface FieldControlOwnProps {
  loading?: boolean;
  locked?: boolean;
  errorMessage?: string | React.ReactNode;
  children: React.ReactNode;
  inputAlignment?: 'start' | 'end';
}

export type FieldControlProps = WithDetailedHTMLProps<
  FieldControlOwnProps & VStackOwnProps,
  'div'
>;

export const FieldControl = React.forwardRef<HTMLDivElement, FieldControlProps>(
  function FieldControl(
    {
      children,
      errorMessage,
      locked = false,
      loading = false,
      className,
      ...props
    },
    ref,
  ) {
    const hasError = Boolean(errorMessage);

    return (
      <VStack
        ref={ref as React.Ref<HTMLElement>}
        data-is-locked={locked}
        data-is-loading={loading}
        data-has-error={hasError}
        className={clsx(styles['field-control'], 'j13b-field-control', className)}
        height="auto"
        width="default"
        hAlign="end"
        vAlign="center"
        gap="4px"
        {...props}
      >
        {children}
        <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
      </VStack>
    );
  },
);
