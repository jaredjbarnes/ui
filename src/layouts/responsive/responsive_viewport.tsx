import React from 'react';
import { useViewportSize } from '../../utils/hooks/use_viewport_size.js';
import { InternalBreakpoint, type BreakpointProps } from './breakpoint.js';

export interface ResponsiveViewportProps {
  children?: React.ReactElement<BreakpointProps>[] | React.ReactElement<BreakpointProps>;
}

/** Picks the active Breakpoint based on the viewport (document.body) width. */
export function ResponsiveViewport(props: ResponsiveViewportProps) {
  const { width } = useViewportSize();

  const breakpoints = React.Children.toArray(props.children).map((child: any) => (
    <InternalBreakpoint key={child.key} {...child.props} width={width} />
  ));

  return <>{breakpoints}</>;
}
