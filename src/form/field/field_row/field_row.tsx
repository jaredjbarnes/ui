import React, { useState } from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackOwnProps } from '../../../stacks/index.js';
import type { WithDetailedHTMLProps } from '../../../stacks/types/as.js';
import type { FieldInput } from '../common/types.js';
import { FieldHeader } from '../common/field_header.js';
import { FieldControl } from '../common/field_control/field_control.js';
import { FieldStatusInput } from '../common/status_input/status_input.js';
import styles from './field_row.module.css';

export interface FieldRowOwnProps extends FieldInput {
  labelWidth?: string;
  children: React.ReactNode;
}

export type FieldRowProps = WithDetailedHTMLProps<FieldRowOwnProps, 'div'> &
  HStackOwnProps;

let idIndex = 0;

export const FieldRow = React.forwardRef<HTMLDivElement, FieldRowProps>(
  function FieldRow(
    {
      label,
      description,
      errorMessage,
      children,
      labelWidth = '40%',
      locked = false,
      loading = false,
      className,
      id,
      required,
      ...props
    },
    ref,
  ) {
    const [finalId] = useState(() => id || `field-row-${idIndex++}`);
    const hasError = Boolean(errorMessage);
    const state = locked
      ? 'locked'
      : loading
        ? 'loading'
        : hasError
          ? 'error'
          : 'default';

    return (
      <HStack
        ref={ref as React.Ref<HTMLElement>}
        as="div"
        data-is-locked={locked}
        data-is-loading={loading}
        data-has-error={hasError}
        className={clsx('j13b-field', styles['field-row'], 'j13b-field-row', className)}
        vAlign="start"
        hAlign="start"
        height="auto"
        gap="4px"
        {...props}
      >
        <FieldHeader
          minWidth={labelWidth}
          width={labelWidth}
          id={finalId}
          label={label}
          description={description}
          required={required}
        />
        <FieldControl errorMessage={errorMessage} loading={loading} locked={locked}>
          <FieldStatusInput state={state}>{children}</FieldStatusInput>
        </FieldControl>
      </HStack>
    );
  },
);
