import React from 'react';

export interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);
