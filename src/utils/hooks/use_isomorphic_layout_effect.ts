import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * `useLayoutEffect` warns during server rendering ("useLayoutEffect does
 * nothing on the server"). This picks the layout variant only where the DOM
 * exists, so effects that must run before paint stay synchronous on the client
 * without emitting the SSR warning.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
