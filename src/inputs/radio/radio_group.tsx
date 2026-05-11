import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import { RadioGroupContext, type RadioGroupContextValue } from './radio_context.js';

export interface RadioGroupOwnProps {
  /** Name applied to all child Radios for native form grouping. */
  name: string;
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export type RadioGroupProps = RadioGroupOwnProps &
  Omit<VStackProps, keyof RadioGroupOwnProps>;

export const RadioGroup = React.forwardRef<HTMLElement, RadioGroupProps>(
  function RadioGroup(
    { name, value: valueProp, defaultValue, onChange, disabled, className, children, ...rest },
    ref,
  ) {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<string | undefined>(
      defaultValue,
    );
    const value = isControlled ? valueProp : internalValue;

    const handleChange = React.useCallback(
      (newValue: string) => {
        if (!isControlled) setInternalValue(newValue);
        onChange?.(newValue);
      },
      [isControlled, onChange],
    );

    const ctxValue = React.useMemo<RadioGroupContextValue>(
      () => ({ name, value, onChange: handleChange, disabled }),
      [name, value, handleChange, disabled],
    );

    return (
      <RadioGroupContext.Provider value={ctxValue}>
        <VStack
          ref={ref}
          role="radiogroup"
          gap="8px"
          className={clsx('j13b-radio-group', className)}
          {...rest}
        >
          {children}
        </VStack>
      </RadioGroupContext.Provider>
    );
  },
);
