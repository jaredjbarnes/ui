import React from 'react';
import { clsx } from 'clsx';
import type { Size } from '../../utils/index.js';
import { ElementTethered } from '../../overlay/tethered/element_tethered.js';
import { ClickAwayListener } from '../../utils/listeners/click_away_listener.js';
import { ScrollAwayListener } from '../../utils/listeners/scroll_away_listener.js';
import { DatePicker, type DatePickerActions } from './date_picker.js';
import styles from './date_picker_input.module.css';

export interface DatePickerInputOwnProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;

  placeholder?: string;
  disabled?: boolean;
  size?: Size;
  invalid?: boolean;
  width?: 'default' | 'auto' | 'fill' | string | number;

  showTime?: boolean;
  timeIntervalInMinutes?: number;
  min?: Date | null;
  max?: Date | null;
  disabledDates?: Date[];
  locale?: string;

  /**
   * IANA time zone (e.g. 'America/New_York'). The calendar selects in this
   * zone and the trigger label is formatted in it. Defaults to the runtime's.
   */
  timeZone?: string;

  /** Format options for the trigger label. Sensible defaults applied. */
  formatOptions?: Intl.DateTimeFormatOptions;

  renderActions?: (api: DatePickerActions) => React.ReactNode;
}

export type DatePickerInputProps = DatePickerInputOwnProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof DatePickerInputOwnProps | 'value' | 'defaultValue' | 'children'
  >;

const KEYWORD = new Set(['default', 'auto', 'fill']);

/* The date-picker dropdown can host nested popovers (the month Select, the
 * year selector). Their dropdowns are portaled out, so a click in them is
 * "outside" our popover by default. Treat any click inside them as inside
 * to keep the date picker open. */
function isNestedPopover(target: HTMLElement): boolean {
  return Boolean(
    target.closest('.j13b-select-dropdown') ||
      target.closest('.j13b-date-picker-year-selector') ||
      target.closest('.j13b-suggestion-list'),
  );
}

export const DatePickerInput = React.forwardRef<HTMLButtonElement, DatePickerInputProps>(
  function DatePickerInput(
    {
      value: valueProp,
      defaultValue = null,
      onChange,
      placeholder = 'Select date…',
      disabled = false,
      size = 'md',
      invalid = false,
      width = 'default',
      showTime = false,
      timeIntervalInMinutes = 15,
      min = null,
      max = null,
      disabledDates,
      locale,
      timeZone,
      formatOptions,
      renderActions,
      className,
      style,
      onKeyDown,
      onClick,
      ...rest
    },
    ref,
  ) {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<Date | null>(defaultValue);
    const value = isControlled ? valueProp : internalValue;

    const [open, setOpen] = React.useState(false);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const popoverRef = React.useRef<HTMLDivElement | null>(null);

    const setRefs = (el: HTMLButtonElement | null) => {
      triggerRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
    };

    const formatter = React.useMemo(() => {
      const opts: Intl.DateTimeFormatOptions = formatOptions ?? {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...(showTime ? { hour: 'numeric', minute: '2-digit', hour12: true } : null),
      };
      // The trigger label must read in the same zone the calendar selects in,
      // otherwise the displayed date can disagree with the highlighted day.
      return new Intl.DateTimeFormat(locale, timeZone ? { ...opts, timeZone } : opts);
    }, [locale, showTime, formatOptions, timeZone]);

    const label = value ? formatter.format(value) : placeholder;

    function closePopover() {
      setOpen(false);
      // Hand focus back to the trigger so keyboard nav resumes naturally.
      requestAnimationFrame(() => triggerRef.current?.focus());
    }

    function handleChange(next: Date | null) {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
      // Time-mode: keep the popover open so the user can pick a time after a date.
      if (!showTime) closePopover();
    }

    function handleTriggerClick(e: React.MouseEvent<HTMLButtonElement>) {
      onClick?.(e);
      if (e.defaultPrevented || disabled) return;
      setOpen((o) => !o);
    }

    function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled) return;
      if ((e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') && !open) {
        e.preventDefault();
        setOpen(true);
      }
    }

    function handlePopoverKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closePopover();
      }
    }

    const composedStyle: React.CSSProperties = { ...style };
    if (typeof width === 'number' || (typeof width === 'string' && !KEYWORD.has(width))) {
      composedStyle.width = width;
    }

    return (
      <>
        <button
          ref={setRefs}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          disabled={disabled}
          data-size={size}
          data-width={typeof width === 'string' && KEYWORD.has(width) ? width : undefined}
          data-is-open={open ? 'true' : 'false'}
          data-is-disabled={disabled ? 'true' : 'false'}
          data-is-invalid={invalid ? 'true' : 'false'}
          data-is-empty={value ? 'false' : 'true'}
          className={clsx(
            styles['date-picker-input'],
            'j13b-date-picker-input',
            'j13b-atom',
            'j13b-control',
            className,
          )}
          style={composedStyle}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          {...rest}
        >
          <span
            className={clsx(
              styles['date-picker-input-label'],
              'j13b-date-picker-input-label',
            )}
          >
            {label}
          </span>
          <CalendarGlyph />
        </button>

        {open && (
          <ElementTethered
            anchorElement={triggerRef}
            verticalAnchor="bottom"
            verticalOrigin="top"
            verticalOffset={4}
            horizontalAnchor="start"
            horizontalOrigin="start"
          >
            <ClickAwayListener
              onClickAway={() => setOpen(false)}
              refs={[triggerRef]}
              isException={isNestedPopover}
            >
              <ScrollAwayListener
                onScrollAway={() => setOpen(false)}
                isException={isNestedPopover}
              >
                <div
                  ref={popoverRef}
                  role="dialog"
                  aria-label="Choose a date"
                  className={clsx(
                    styles['date-picker-popover'],
                    'j13b-date-picker-popover',
                  )}
                  onKeyDown={handlePopoverKeyDown}
                >
                  <DatePicker
                    value={value}
                    onChange={handleChange}
                    showTime={showTime}
                    timeIntervalInMinutes={timeIntervalInMinutes}
                    min={min}
                    max={max}
                    disabledDates={disabledDates}
                    locale={locale}
                    timeZone={timeZone}
                    renderActions={renderActions}
                  />
                </div>
              </ScrollAwayListener>
            </ClickAwayListener>
          </ElementTethered>
        )}
      </>
    );
  },
);

function CalendarGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx('j13b-date-picker-input-glyph')}
    >
      <rect x="2" y="3.5" width="12" height="11" rx="1.5" />
      <line x1="2" y1="6.5" x2="14" y2="6.5" />
      <line x1="5" y1="2" x2="5" y2="5" />
      <line x1="11" y1="2" x2="11" y2="5" />
    </svg>
  );
}
