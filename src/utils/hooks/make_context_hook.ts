import React from 'react';

export type NonUndefined<T> = T extends undefined ? never : T;

/**
 * Build a hook that reads a React context and throws if accessed outside its
 * provider. Use for contexts where the default value would be meaningless and
 * silent fallthrough would mask a structural bug.
 */
export function makeContextHook<T>(context: React.Context<T>, name?: string) {
  return () => {
    const value = React.useContext(context);
    if (value === undefined) {
      throw new Error(
        name
          ? `Context "${name}" was accessed outside of its provider.`
          : 'Context was accessed outside of its provider.',
      );
    }
    return value as NonUndefined<T>;
  };
}
