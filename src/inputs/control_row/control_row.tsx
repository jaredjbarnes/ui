import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';

export type ControlRowProps = HStackProps;

export const ControlRow = React.forwardRef<HTMLElement, ControlRowProps>(
  function ControlRow({ className, children, ...rest }, ref) {
    return (
      <HStack
        ref={ref}
        className={clsx('j13b-control-row', className)}
        {...rest}
      >
        {children}
      </HStack>
    );
  },
);
