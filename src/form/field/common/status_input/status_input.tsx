import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackOwnProps } from '../../../../stacks/index.js';
import type { WithDetailedHTMLProps } from '../../../../stacks/types/as.js';
import styles from './status_input.module.css';

export type StatusInputState = 'locked' | 'loading' | 'error' | 'default';

/**
 * Renders the adornment for a given field state. Each state gets its own
 * empty `<span>` with a stable class name; the theme paints the glyph
 * (background SVG, mask-image, icon font — its choice). The library does not
 * ship icons.
 */
export const AdornmentMap: React.FC<{ state: StatusInputState }> = ({ state }) => {
  switch (state) {
    case 'locked':
      return <span className="j13b-field-lock j13b-field-status-adornment" aria-hidden />;
    case 'loading':
      return (
        <span
          className="j13b-field-loading j13b-field-status-adornment"
          role="status"
          aria-live="polite"
        />
      );
    case 'error':
      return (
        <span className="j13b-field-error j13b-field-status-adornment" aria-hidden />
      );
    default:
      return null;
  }
};

export interface StatusInputOwnProps {
  children: React.ReactNode;
  state?: StatusInputState;
}

export type StatusInputProps = WithDetailedHTMLProps<
  StatusInputOwnProps & HStackOwnProps,
  'div'
>;

export const FieldStatusInput = React.forwardRef<HTMLDivElement, StatusInputProps>(
  function FieldStatusInput({ children, state = 'default', className, ...props }, ref) {
    const showControl = state === 'default' || state === 'error';

    return (
      <HStack
        ref={ref as React.Ref<HTMLElement>}
        data-state={state}
        className={clsx(
          'j13b-field-status-input',
          styles['field-status-input'],
          className,
        )}
        vAlign="center"
        hAlign="end"
        gap="4px"
        {...props}
      >
        {showControl && children}
        <AdornmentMap state={state} />
      </HStack>
    );
  },
);
