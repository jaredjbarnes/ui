import React from 'react';
import type { BreakpointProps } from './breakpoint.js';
import { ResponsiveContainer } from './responsive_container.js';
import { ResponsiveViewport } from './responsive_viewport.js';

export interface ResponsiveProps {
  /** `container` reacts to the parent element's width; `viewport` to the body. Default `container`. */
  on?: 'viewport' | 'container';
  children?: React.ReactElement<BreakpointProps>[] | React.ReactElement<BreakpointProps>;
}

/**
 * Renders exactly one of its `<Breakpoint>` children — whichever's `from`/`to`
 * range contains the current width.
 */
export function Responsive({ on = 'container', children }: ResponsiveProps) {
  if (on === 'viewport') return <ResponsiveViewport>{children}</ResponsiveViewport>;
  return <ResponsiveContainer>{children}</ResponsiveContainer>;
}
