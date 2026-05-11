import React, { useState } from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackOwnProps } from '../../../stacks/index.js';
import type { WithDetailedHTMLProps } from '../../../stacks/types/as.js';
import type { FieldInput } from '../common/types.js';
import { FieldHeader } from '../common/field_header.js';
import { FieldControl } from '../common/field_control/field_control.js';
import { FieldStatusInput } from '../common/status_input/status_input.js';
import styles from './field_stack.module.css';

export interface FieldStackOwnProps extends FieldInput {
  children: React.ReactNode;
}

export type FieldStackProps = WithDetailedHTMLProps<FieldStackOwnProps, 'div'> &
  VStackOwnProps;

let idIndex = 0;

export const FieldStack = React.forwardRef<HTMLDivElement, FieldStackProps>(
  function FieldStack(
    {
      label,
      description,
      errorMessage,
      children,
      locked = false,
      loading = false,
      className,
      id,
      required,
      ...props
    },
    ref,
  ) {
    const [finalId] = useState(() => id || `field-stack-${idIndex++}`);
    const hasError = Boolean(errorMessage);
    const state = locked
      ? 'locked'
      : loading
        ? 'loading'
        : hasError
          ? 'error'
          : 'default';

    return (
      <VStack
        ref={ref as React.Ref<HTMLElement>}
        as="div"
        data-is-locked={locked}
        data-is-loading={loading}
        data-has-error={hasError}
        className={clsx(
          'j13b-field',
          styles['field-stack'],
          'j13b-field-stack',
          className,
        )}
        vAlign="start"
        hAlign="start"
        height="auto"
        gap="4px"
        {...props}
      >
        <FieldHeader
          id={finalId}
          label={label}
          description={description}
          required={required}
        />
        <FieldControl
          errorMessage={errorMessage}
          loading={loading}
          locked={locked}
          hAlign="start"
        >
          <FieldStatusInput state={state} hAlign="start">
            {children}
          </FieldStatusInput>
        </FieldControl>
      </VStack>
    );
  },
);
