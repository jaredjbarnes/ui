import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';

export type ControlStackProps = VStackProps;

export const ControlStack = React.forwardRef<HTMLElement, ControlStackProps>(
  function ControlStack({ className, children, ...rest }, ref) {
    return (
      <VStack
        ref={ref}
        className={clsx('j13b-control-stack', className)}
        {...rest}
      >
        {children}
      </VStack>
    );
  },
);
