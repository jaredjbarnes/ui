import React from 'react';
import { clsx, type ClassValue } from 'clsx';

interface DecoratorProps {
  className?: ClassValue;
  style?: React.CSSProperties;
  ref?: React.Ref<unknown>;
  children?: React.ReactNode;
  [key: string]: unknown;
}

/**
 * Internal helper for decorator-pattern components that wrap a child via
 * `cloneElement`. Merges className (via clsx), merges style, threads a
 * pre-forked ref, and optionally appends extra children (e.g. handles).
 *
 * Callers must fork refs themselves with `useForkRef` and pass the result in
 * as `ref` — keeping ref forking out of this helper lets the caller decide
 * what to do when the cloned child also forwards a ref.
 */
export function cloneWithDecorator(
  child: React.ReactElement,
  injectedProps: DecoratorProps,
  extraChildren?: React.ReactNode[],
): React.ReactElement {
  const { className, style, ref, children, ...rest } = injectedProps;
  const childProps = child.props as Record<string, unknown> & {
    className?: ClassValue;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  };

  const merged: Record<string, unknown> = {
    ...rest,
    className: clsx(childProps.className, className),
    style: { ...(childProps.style ?? {}), ...(style ?? {}) },
  };

  if (ref !== undefined) {
    merged.ref = ref;
  }

  const childContent = children ?? childProps.children;

  if (extraChildren && extraChildren.length > 0) {
    return React.cloneElement(child, merged, childContent, ...extraChildren);
  }
  return React.cloneElement(child, merged, childContent);
}
