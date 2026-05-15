import React from 'react';
import { clsx } from 'clsx';
import { HStack, type HStackProps } from '../../stacks/h_stack.js';
import type { Size } from '../../utils/index.js';
import '../../themes/primitives/interactive.css';
import styles from './nav_item.module.css';

export interface NavItemOwnProps {
  /** When the item represents the current route, set true. Emits
   *  `data-is-active="true"` and `aria-current="page"` for assistive tech
   *  and theme hooks. */
  isActive?: boolean;
  /** Optional href. When provided, NavItem renders as `<a href>`;
   *  otherwise it renders as `<button type="button">`. */
  href?: string;
  /** Anchor target (only honored when href is set). */
  target?: string;
  /** Anchor rel (only honored when href is set). */
  rel?: string;
  /** Leading icon slot — renders before the label. */
  icon?: React.ReactNode;
  /** Density. Theme reads `data-size` for sizing variants. */
  size?: Size;
  /** Disable interaction. Renders aria-disabled on links, disabled on
   *  buttons. */
  disabled?: boolean;
}

export type NavItemProps = NavItemOwnProps &
  Omit<HStackProps, keyof NavItemOwnProps | 'as'> &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement> &
      React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof NavItemOwnProps | 'href' | 'target' | 'rel'
  >;

/**
 * NavItem — a single navigation target. Shared primitive used inside both
 * `NavBar` (horizontal) and `SideNav` (vertical). The PARENT decides
 * orientation and the visual emphasis of the active state via the
 * cascade — same component, two readings.
 *
 * Renders as `<a>` when `href` is provided, `<button>` otherwise. Emits
 * `data-is-active="true"` and `aria-current="page"` when `isActive` is
 * set. Carries the `.j13b-interactive` primitive so themes can derive
 * hover/focus/press colors from the local `--material` and `--action`.
 */
export const NavItem = React.forwardRef<HTMLElement, NavItemProps>(function NavItem(
  {
    isActive = false,
    href,
    target,
    rel,
    icon,
    size = 'md',
    disabled = false,
    children,
    className,
    ...rest
  },
  ref,
) {
  const isLink = href !== undefined;
  const elementProps: Record<string, unknown> = {
    'data-is-active': isActive ? 'true' : 'false',
    'data-size': size,
    'data-is-disabled': disabled ? 'true' : 'false',
    'aria-current': isActive ? 'page' : undefined,
    'aria-disabled': disabled || undefined,
  };

  if (isLink) {
    elementProps.href = disabled ? undefined : href;
    if (target) elementProps.target = target;
    if (rel) elementProps.rel = rel;
  } else {
    elementProps.type = 'button';
    elementProps.disabled = disabled;
  }

  return (
    <HStack
      ref={ref as React.Ref<HTMLElement>}
      as={isLink ? 'a' : 'button'}
      inline
      vAlign="center"
      hAlign="start"
      width="auto"
      gap="8px"
      className={clsx(styles['nav-item'], 'j13b-interactive', 'j13b-nav-item', className)}
      {...elementProps}
      {...(rest as React.HTMLAttributes<HTMLElement>)}
    >
      {icon != null && (
        <span className="j13b-nav-item-icon" aria-hidden>
          {icon}
        </span>
      )}
      {children}
    </HStack>
  );
});
