import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import styles from './suggestion_list.module.css';

export type SuggestionListProps = Omit<VStackProps<HTMLUListElement>, 'as'>;

/**
 * Listbox container for suggestion items. Renders as a VStack-as-ul so it
 * inherits the stack's column layout (width:100%, flex column) plus
 * listbox semantics. Items inside opt into the cross-axis fill via their
 * own width:100%.
 */
export const SuggestionList = React.forwardRef<HTMLUListElement, SuggestionListProps>(
  function SuggestionList({ className, children, ...rest }, ref) {
    return (
      <VStack
        ref={ref as React.Ref<HTMLElement>}
        as="ul"
        role="listbox"
        className={clsx(styles['suggestion-list'], 'j13b-suggestion-list', className)}
        {...rest}
      >
        {children}
      </VStack>
    );
  },
);
