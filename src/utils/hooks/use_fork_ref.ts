import React, { useCallback } from 'react';

/**
 * Combine multiple refs into one. Useful when a component needs to attach
 * its own internal ref while ALSO forwarding the consumer's ref to the
 * same DOM node.
 */
export function useForkRef<T>(...args: (React.Ref<T> | undefined)[]) {
  return useCallback((obj: T | null) => {
    args.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(obj);
      } else if (ref != null && typeof ref === 'object' && 'current' in ref) {
        (ref as React.MutableRefObject<T | null>).current = obj;
      }
    });
    // biome-ignore lint/correctness/useExhaustiveDependencies: rest args are the deps
  }, args);
}
