import React from 'react';
import { BodyText } from '../../../typography/index.js';

export interface FieldDescriptionOwnProps {
  children?: React.ReactNode | string;
  id?: string;
}

export const FieldDescription = ({ children, id }: FieldDescriptionOwnProps) => {
  if (!children) return null;
  if (typeof children === 'string') {
    return (
      <BodyText size="sm" id={id} className="j13b-field-description">
        {children}
      </BodyText>
    );
  }
  return <>{children}</>;
};
