import React, { useLayoutEffect } from 'react';
import { clsx } from 'clsx';
import { VStack, type VStackProps } from '../stacks/v_stack.js';

import './stylesheets/reset.css';

export interface ThemeProps extends VStackProps {
  styleSheets: CSSStyleSheet[];
  children: React.ReactNode;
}

export function Theme({
  styleSheets,
  children,
  className,
  width = '100%',
  height = '100%',
  ...rest
}: ThemeProps) {
  const ref = React.useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = ref.current?.getRootNode();
    if (!root || !('adoptedStyleSheets' in root)) return;
    (root as Document | ShadowRoot).adoptedStyleSheets = styleSheets;
  }, [styleSheets]);

  return (
    <VStack
      ref={ref}
      width={width}
      height={height}
      className={clsx('j13b-theme-root', className)}
      {...rest}
    >
      {children}
    </VStack>
  );
}
