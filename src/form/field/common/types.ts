import type React from 'react';

export interface FieldInput {
  id?: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  errorMessage?: string | React.ReactNode;
  locked?: boolean;
  loading?: boolean;
  required?: boolean;
}
