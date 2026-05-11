import React from 'react';
import { clsx } from 'clsx';
import type { Size } from '../../utils/index.js';
import { ClickAwayListener } from '../../utils/listeners/click_away_listener.js';
import { ScrollAwayListener } from '../../utils/listeners/scroll_away_listener.js';
import { FocusRedirect } from '../../utils/listeners/focus_redirect.js';
import { ElementTethered } from '../../overlay/tethered/element_tethered.js';
import { SuggestionList } from '../suggestion_list/suggestion_list.js';
import { SuggestionItem } from '../suggestion_list/suggestion_item.js';
import { Option, type OptionProps } from './option.js';
import { Input } from '../input/input.js';
import { HStack } from '../../stacks/h_stack.js';
import { VStack } from '../../stacks/v_stack.js';
import styles from './select.module.css';

/** Internal shape extracted from each Option child. */
interface OptionData {
  value: string;
  label: string;
  keywords?: string[];
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface SelectOwnProps {
  /** Option children. */
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: Size;
  invalid?: boolean;
  width?: 'default' | 'auto' | 'fill' | string | number;
  /** Show a search input in the dropdown that filters the option list. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Override the search match function. Default: substring (case-insensitive)
   *  match on label and keywords. */
  filterOption?: (option: OptionData, query: string) => boolean;
}

export type SelectProps = SelectOwnProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof SelectOwnProps | 'value' | 'defaultValue' | 'children'
  >;

const KEYWORD = new Set(['default', 'auto', 'fill']);

function defaultFilterOption(option: OptionData, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  if (option.label.toLowerCase().includes(q)) return true;
  if (option.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
  return false;
}

/** Walk children, pulling props out of every Option element. */
function extractOptions(children: React.ReactNode): OptionData[] {
  const out: OptionData[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<OptionProps>(child)) return;
    if (child.type !== Option) return;
    out.push({
      value: child.props.value,
      label: child.props.label,
      keywords: child.props.keywords,
      disabled: child.props.disabled,
      content: child.props.children,
    });
  });
  return out;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    children,
    value: valueProp,
    defaultValue,
    onChange,
    placeholder = 'Select…',
    disabled = false,
    size = 'md',
    invalid = false,
    width = 'default',
    searchable = false,
    searchPlaceholder = 'Search…',
    filterOption,
    className,
    style,
    onKeyDown,
    onClick,
    ...rest
  },
  ref,
) {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue);
  const value = isControlled ? valueProp : internalValue;

  const [open, setOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const [searchQuery, setSearchQuery] = React.useState('');

  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const listboxRef = React.useRef<HTMLUListElement | null>(null);

  const setRefs = (el: HTMLButtonElement | null) => {
    triggerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
  };

  const allOptions = React.useMemo(() => extractOptions(children), [children]);

  const filterFn = filterOption ?? defaultFilterOption;
  const visibleOptions = React.useMemo(
    () => (searchable ? allOptions.filter((o) => filterFn(o, searchQuery)) : allOptions),
    [allOptions, searchable, searchQuery, filterFn],
  );

  const selected = allOptions.find((o) => o.value === value);

  /* Keep the focused option in view as keyboard navigation moves through
     the list. Real DOM focus stays on the trigger/search input, so the
     browser won't scroll for us — we have to nudge the listbox manually
     whenever focusedIndex changes. */
  React.useEffect(() => {
    if (!open || focusedIndex < 0) return;
    const list = listboxRef.current;
    if (!list) return;
    const item = list.children[focusedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [focusedIndex, open]);

  const closeDropdown = React.useCallback(() => {
    setOpen(false);
    setSearchQuery('');
  }, []);

  const openDropdown = () => {
    setOpen(true);
    setSearchQuery('');
    const idx = value ? allOptions.findIndex((o) => o.value === value) : 0;
    setFocusedIndex(idx >= 0 ? idx : 0);
  };

  const selectValue = (newValue: string) => {
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
    closeDropdown();
    triggerRef.current?.focus();
  };

  /** Shared keyboard handler — used by both the trigger and the search input
   *  when the dropdown is open. Returns true if the event was handled (so
   *  the search input's onKeyDown knows to suppress default). */
  const handleNavKey = (event: React.KeyboardEvent): boolean => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      closeDropdown();
      triggerRef.current?.focus();
      return true;
    }
    if (event.key === 'Enter') {
      if (open && focusedIndex >= 0 && focusedIndex < visibleOptions.length) {
        const opt = visibleOptions[focusedIndex];
        if (opt && !opt.disabled) {
          event.preventDefault();
          selectValue(opt.value);
          return true;
        }
      } else if (!open) {
        event.preventDefault();
        openDropdown();
        return true;
      }
    }
    /* Tab acts like ArrowDown, Shift+Tab like ArrowUp — and both wrap.
       Combined with the FocusRedirect sentinel below the listbox, the
       dropdown forms a focus trap: keyboard navigation cycles through
       the options without ever escaping the popover. */
    const isDown =
      event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey);
    const isUp =
      event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey);
    if (isDown) {
      event.preventDefault();
      if (!open) {
        openDropdown();
      } else if (visibleOptions.length > 0) {
        setFocusedIndex((prev) => (prev + 1) % visibleOptions.length);
      }
      return true;
    }
    if (isUp) {
      event.preventDefault();
      if (!open) {
        openDropdown();
        setFocusedIndex(visibleOptions.length - 1);
      } else if (visibleOptions.length > 0) {
        setFocusedIndex(
          (prev) => (prev - 1 + visibleOptions.length) % visibleOptions.length,
        );
      }
      return true;
    }
    if (event.key === 'Home' && open) {
      event.preventDefault();
      setFocusedIndex(0);
      return true;
    }
    if (event.key === 'End' && open) {
      event.preventDefault();
      setFocusedIndex(visibleOptions.length - 1);
      return true;
    }
    return false;
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;
    if (event.key === ' ' && !open) {
      event.preventDefault();
      openDropdown();
      return;
    }
    handleNavKey(event);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    handleNavKey(event);
    // Other keys (typing) flow through to the input naturally.
  };

  const handleTriggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    if (open) closeDropdown();
    else openDropdown();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setFocusedIndex(0);
  };

  const composedStyle: React.CSSProperties = { ...style };
  if (typeof width === 'number' || (typeof width === 'string' && !KEYWORD.has(width))) {
    composedStyle.width = width;
  }

  return (
    <>
      <button
        ref={setRefs}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? 'j13b-select-listbox' : undefined}
        disabled={disabled}
        data-size={size}
        data-width={typeof width === 'string' && KEYWORD.has(width) ? width : undefined}
        data-is-open={open ? 'true' : 'false'}
        data-is-disabled={disabled ? 'true' : 'false'}
        data-is-invalid={invalid ? 'true' : 'false'}
        className={clsx(styles.select, 'j13b-select', 'j13b-atom', 'j13b-control', className)}
        style={composedStyle}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        {...rest}
      >
        <span className={clsx(styles['select-value'], 'j13b-select-value')}>
          {selected?.label ?? placeholder}
        </span>
        <span
          aria-hidden="true"
          className={clsx(styles['select-chevron'], 'j13b-select-chevron')}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2,4 5,7 8,4" />
          </svg>
        </span>
      </button>

      {open && (
        <ElementTethered
          anchorElement={triggerRef}
          /* Origin (point on the dropdown) is always its TOP — the dropdown
             extends downward. The anchor (point on the trigger) flips:
             - searchable: anchor = trigger's TOP → dropdown overlays the
               trigger; the search input visually replaces it.
             - default:    anchor = trigger's BOTTOM → dropdown opens
               below the trigger. */
          verticalAnchor={searchable ? 'top' : 'bottom'}
          verticalOrigin="top"
          verticalOffset={searchable ? -4 : 4}
          horizontalAnchor="start"
          horizontalOrigin="start"
        >
          <ClickAwayListener onClickAway={closeDropdown} refs={[triggerRef]}>
            <ScrollAwayListener onScrollAway={closeDropdown}>
              <VStack
                className={clsx(styles['select-dropdown'], 'j13b-select-dropdown')}
                style={{ minWidth: triggerRef.current?.offsetWidth }}
              >
                {searchable && (
                  <HStack
                    className={clsx(styles['select-search'], 'j13b-select-search')}
                  >
                    <Input
                      ref={searchInputRef}
                      width="fill"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      placeholder={searchPlaceholder}
                      autoFocus
                      aria-label="Filter options"
                    />
                  </HStack>
                )}
                <SuggestionList ref={listboxRef} id="j13b-select-listbox">
                  {visibleOptions.length === 0 && searchable ? (
                    <li
                      className={clsx(
                        styles['select-empty'],
                        'j13b-select-empty',
                      )}
                      aria-disabled="true"
                    >
                      No matches
                    </li>
                  ) : (
                    visibleOptions.map((opt, i) => (
                      <SuggestionItem
                        key={opt.value}
                        value={opt.value}
                        isSelected={opt.value === value}
                        isFocused={i === focusedIndex}
                        disabled={opt.disabled}
                        onClick={() => !opt.disabled && selectValue(opt.value)}
                        onMouseEnter={() => setFocusedIndex(i)}
                      >
                        {opt.content ?? opt.label}
                      </SuggestionItem>
                    ))
                  )}
                </SuggestionList>
                {/* Tab sentinel: if focus ever escapes the listbox forward,
                    route it back to the search input (or the trigger when
                    there's no search). Combined with the keyboard handler
                    that intercepts Tab/Shift+Tab, this closes the trap. */}
                <FocusRedirect
                  onRedirect={() => {
                    if (searchable) searchInputRef.current?.focus();
                    else triggerRef.current?.focus();
                  }}
                />
              </VStack>
            </ScrollAwayListener>
          </ClickAwayListener>
        </ElementTethered>
      )}
    </>
  );
});
