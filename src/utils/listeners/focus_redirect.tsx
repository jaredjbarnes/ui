import React from 'react';

export interface FocusRedirectProps {
  onRedirect: () => void;
}

/**
 * A zero-size focusable sentinel. Place one at the boundary of a region
 * you want to trap focus inside. When the user tabs onto the sentinel,
 * `onRedirect` fires — typically to refocus the desired element inside
 * the region, so Tab/Shift+Tab cycles instead of escaping.
 */
export const FocusRedirect = React.forwardRef<HTMLDivElement, FocusRedirectProps>(
  function FocusRedirect({ onRedirect }, ref) {
    return (
      <div
        ref={ref}
        tabIndex={0}
        onFocus={onRedirect}
        style={{
          padding: 0,
          margin: 0,
          width: 0,
          height: 0,
          opacity: 0,
          position: 'relative',
        }}
      />
    );
  },
);
