import React from 'react';

export interface BreakpointProps {
  /** Inclusive lower bound (px). Defaults to 0. */
  from?: number | string;
  /** Exclusive upper bound (px). Defaults to Infinity. */
  to?: number | string;
  children: React.ReactNode;
}

export interface InternalBreakpointProps extends BreakpointProps {
  width: number;
}

function toNumber(value: number | string): number {
  if (typeof value === 'number') return value;
  return parseFloat(value);
}

/**
 * Marker component. Returns `null` on its own — it must be a direct child of
 * `<Responsive>` so the parent can read its `from`/`to` props and decide
 * whether the current width is in range. Wrapping `<Breakpoint>` in another
 * component breaks the contract.
 */
export function Breakpoint(_: BreakpointProps): React.ReactElement | null {
  return null;
}

export function InternalBreakpoint(props: InternalBreakpointProps) {
  const from = toNumber(props.from ?? 0);
  const to = toNumber(props.to ?? Infinity);
  const isWithinRange = props.width >= from && props.width < to;
  return isWithinRange ? <>{props.children}</> : null;
}
