import React from 'react';
import type { FieldInput } from './common/types.js';
import { FieldRow, type FieldRowProps } from './field_row/field_row.js';
import { FieldStack, type FieldStackProps } from './field_stack/field_stack.js';
import { Responsive } from '../../layouts/responsive/responsive.js';
import { Breakpoint } from '../../layouts/responsive/breakpoint.js';

export interface FieldProps extends FieldInput {
  /** Pixel width at which the field switches from stack to row. Default 500. */
  breakpointPixels?: number;
  /** Width of the label column when rendered as a row. */
  labelWidth?: FieldRowProps['labelWidth'];
  children: React.ReactNode;
}

/**
 * Responsive field wrapper. Renders `FieldStack` when narrower than
 * `breakpointPixels`, `FieldRow` when wider. App-level state is passed in
 * as props — this component carries no internal field state.
 */
export const Field = function Field({
  breakpointPixels = 500,
  children,
  ...fieldProps
}: FieldProps) {
  const stackProps = fieldProps as FieldStackProps;
  const rowProps = fieldProps as FieldRowProps;

  return (
    <Responsive>
      <Breakpoint to={breakpointPixels}>
        <FieldStack {...stackProps}>{children}</FieldStack>
      </Breakpoint>
      <Breakpoint from={breakpointPixels}>
        <FieldRow {...rowProps}>{children}</FieldRow>
      </Breakpoint>
    </Responsive>
  );
};
