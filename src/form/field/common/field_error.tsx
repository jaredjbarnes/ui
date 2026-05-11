import React from 'react';
import { HStack } from '../../../stacks/index.js';
import { BodyText } from '../../../typography/index.js';

export interface FieldErrorMessageOwnProps {
  children?: React.ReactNode | string;
}

/**
 * Renders the error row. An invisible adornment placeholder is rendered next
 * to the message so the row keeps the same width as `FieldStatusInput` above
 * it, keeping vertical alignment when an icon adornment is present.
 */
export const FieldErrorMessage = ({ children }: FieldErrorMessageOwnProps) => {
  if (!children) return null;

  const content =
    typeof children === 'string' ? (
      <BodyText size="sm" className="j13b-field-error-message">
        {children}
      </BodyText>
    ) : (
      children
    );

  return (
    <HStack hAlign="end" gap="4px" className="j13b-field-error-row">
      {content}
      <span
        className="j13b-field-status-adornment"
        aria-hidden
        style={{ visibility: 'hidden' }}
      />
    </HStack>
  );
};
