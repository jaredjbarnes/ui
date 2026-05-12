import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import styles from './panel.module.css';

export interface PanelOwnProps {}

export interface PanelProps extends Omit<VStackProps, 'as'>, PanelOwnProps {
  as?: VStackProps['as'];
}

/**
 * Panel — an inset region surface. Like Card but typically structural rather
 * than self-contained — settings sections, sub-page blocks, sidebar
 * content panes. Distinct class hook so themes can paint it differently from
 * Card (e.g. no shadow, full-height, flush borders).
 */
export const Panel = React.forwardRef<HTMLElement, PanelProps>(function Panel(
  { as = 'section', children, className, hAlign = 'start', vAlign = 'start', ...props },
  ref,
) {
  return (
    <VStack
      ref={ref}
      as={as}
      hAlign={hAlign}
      vAlign={vAlign}
      className={clsx('j13b-surface', 'j13b-panel', styles.panel, className)}
      {...props}
    >
      {children}
    </VStack>
  );
});
