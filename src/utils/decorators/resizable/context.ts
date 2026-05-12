import { createContext } from 'react';
import { makeContextHook } from '../../hooks/make_context_hook.js';
import type { ResizableContextValue } from './types.js';

export const ResizableContext = createContext<ResizableContextValue | undefined>(
  undefined,
);

export const useResizable = makeContextHook(ResizableContext, 'ResizableContext');
