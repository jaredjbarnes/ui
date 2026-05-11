import React, { useLayoutEffect, useState } from 'react';
import { useForkRef } from '../../utils/hooks/use_fork_ref.js';
import { useResizeObserver } from '../../utils/hooks/use_resize_observer.js';
import { InternalBreakpoint, type BreakpointProps } from './breakpoint.js';

export interface ResponsiveContainerProps {
  children?: React.ReactElement<BreakpointProps>[] | React.ReactElement<BreakpointProps>;
}

/**
 * Picks the active Breakpoint based on the container (parent element) width.
 * Renders a hidden probe child once to discover the parent, then observes the
 * parent's size via the shared ResizeObserver registry.
 */
export function ResponsiveContainer(props: ResponsiveContainerProps) {
  const [parent, setParent] = useState<Element | null>(null);
  const [width, setWidth] = useState(0);

  const resizeRef = useResizeObserver<Element>((newWidth) => {
    setWidth(newWidth);
  }, 'width');

  const forkedRef = useForkRef<HTMLDivElement>((element) => {
    if (element == null || element.parentElement == null) return;
    resizeRef(element.parentElement);
    setParent(element.parentElement);
  });

  const hiddenProbe = (
    <div ref={forkedRef} style={{ display: 'none' }} aria-hidden />
  );

  const breakpoints = React.Children.toArray(props.children).map((child: any) => (
    <InternalBreakpoint key={child.key} {...child.props} width={width} />
  ));

  useLayoutEffect(() => {
    return () => {
      setParent(null);
    };
  }, []);

  return (
    <>
      {parent == null ? hiddenProbe : null}
      {breakpoints}
    </>
  );
}
