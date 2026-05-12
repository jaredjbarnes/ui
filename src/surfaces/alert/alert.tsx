import React from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../../stacks/v_stack.js';
import type { ActionSeverity } from '../../actions/types.js';
import styles from './alert.module.css';

export type AlertSeverity = ActionSeverity;

export interface AlertOwnProps {
  /** Severity tone — themes paint `--material` based on this. */
  severity?: AlertSeverity;
  /** Optional adornment slot (icon, status indicator). Theme paints the
   * surrounding circle/box; you supply or omit the inner glyph. */
  adornment?: React.ReactNode;
}

export interface AlertProps extends Omit<VStackProps, 'as'>, AlertOwnProps {}

/**
 * Alert — inline status surface. The `severity` prop emits `data-severity`,
 * and the theme redeclares the surface vocabulary (`--material` shifts
 * toward the matching status color) at that boundary. Interactive children
 * dropped inside recolor against the alert\'s material automatically.
 *
 * This is the inline banner / callout variant — not a modal dialog. For a
 * modal confirmation prompt, use `Confirm` (when ported).
 */
export const Alert = React.forwardRef<HTMLElement, AlertProps>(function Alert(
  {
    severity = 'neutral',
    adornment,
    children,
    className,
    hAlign = 'start',
    vAlign = 'start',
    ...props
  },
  ref,
) {
  return (
    <VStack
      ref={ref}
      as="section"
      role="alert"
      hAlign={hAlign}
      vAlign={vAlign}
      data-severity={severity}
      className={clsx('j13b-surface', 'j13b-alert', styles.alert, className)}
      {...props}
    >
      {adornment != null && (
        <div className="j13b-alert-adornment" aria-hidden>
          {adornment}
        </div>
      )}
      {children}
    </VStack>
  );
});
