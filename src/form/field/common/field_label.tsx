import React from 'react';
import { BodyText } from '../../../typography/index.js';

export interface FieldLabelOwnProps {
  children?: React.ReactNode | string;
  id?: string;
  required?: boolean;
}

export const FieldLabel = ({ children, id, required }: FieldLabelOwnProps) => {
  if (!children) return null;
  if (typeof children === 'string') {
    return (
      <BodyText size="lg" id={id} className="j13b-field-label">
        {children}
        {required && (
          <span className="j13b-field-required-indicator" aria-hidden>
            *
          </span>
        )}
      </BodyText>
    );
  }
  return <>{children}</>;
};
