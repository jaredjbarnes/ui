import React from 'react';
import { createPortal } from 'react-dom';
import { useIsomorphicLayoutEffect } from '../../utils/hooks/use_isomorphic_layout_effect.js';
import './portal.css';

export interface PortalProps {
  children: React.ReactNode;
  /** Container to portal into. Defaults to the shared portal platform
   *  (a position:fixed div in body). */
  container?: HTMLElement | null;
}

/**
 * Lazily creates (or finds) the singleton portal-platform div in
 * document.body. The platform is position:fixed across the viewport so
 * any absolute-positioned descendant uses viewport coordinates — making
 * tethered positioning correct under scroll.
 */
function ensurePlatform(): HTMLDivElement | null {
  if (typeof document === 'undefined') return null;
  const existing = document.querySelector(
    '.j13b-portal-platform',
  ) as HTMLDivElement | null;
  if (existing) return existing;
  const div = document.createElement('div');
  div.className = 'j13b-portal-platform';
  document.body.appendChild(div);
  return div;
}

/**
 * Renders children into the shared portal platform (or a custom container).
 * Defers mounting until after the first render so SSR doesn't try to call
 * createPortal on the server pass.
 */
export function Portal({ children, container }: PortalProps) {
  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  // Layout effect (client) so the portal target is set before paint — a
  // deferred (post-paint) mount makes tethered children flash at their
  // pre-positioned origin. `useEffect` on the server keeps SSR warning-free.
  useIsomorphicLayoutEffect(() => {
    setTarget(container ?? ensurePlatform());
  }, [container]);

  if (!target) return null;
  return createPortal(children, target);
}
