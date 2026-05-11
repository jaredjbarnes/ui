import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackOwnProps } from '../../../stacks/index.js';
import type { WithDetailedHTMLProps } from '../../../stacks/types/as.js';
import { FieldLabel } from './field_label.js';
import { FieldDescription } from './field_description.js';

export interface FieldHeaderOwnProps {
  id: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  required?: boolean;
}

export type FieldHeaderProps = WithDetailedHTMLProps<FieldHeaderOwnProps, 'div'> &
  VStackOwnProps;

export const FieldHeader = React.forwardRef<HTMLDivElement, FieldHeaderProps>(
  function FieldHeader(
    { label, description, className, id, required, ...props },
    ref,
  ) {
    const labelId = `${id}-label`;
    const descriptionId = `${id}-description`;
    return (
      <VStack
        as="div"
        hAlign="start"
        gap="4px"
        className={clsx('j13b-field-header', className)}
        ref={ref as React.Ref<HTMLElement>}
        {...props}
      >
        <FieldLabel id={labelId} required={required}>
          {label}
        </FieldLabel>
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      </VStack>
    );
  },
);
