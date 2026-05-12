import React from 'react';
import { clsx } from 'clsx';
import { HStack } from '../../stacks/h_stack.js';
import { Spacer } from '../../stacks/spacer.js';
import { Button } from '../../actions/button/button/button.js';
import { ButtonGroup } from '../../actions/button/button_group/button_group.js';
import { ElementTethered } from '../../overlay/tethered/element_tethered.js';
import { ClickAwayListener } from '../../utils/listeners/click_away_listener.js';
import { ScrollAwayListener } from '../../utils/listeners/scroll_away_listener.js';
import { SuggestionList } from '../suggestion_list/suggestion_list.js';
import { SuggestionItem } from '../suggestion_list/suggestion_item.js';
import { getMonthsOfYear } from '../../utils/calendar/get_months_of_year.js';
import { canNavigateToMonth } from '../../utils/calendar/date_helpers.js';
import { DatePickerYearSelector } from './date_picker_year_selector.js';
import styles from './date_picker_header.module.css';

export interface DatePickerHeaderProps {
  visibleYear: number;
  visibleMonth: number;
  min: Date | null;
  max: Date | null;
  locale?: string;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export function DatePickerHeader({
  visibleYear,
  visibleMonth,
  min,
  max,
  locale,
  onMonthChange,
  onYearChange,
}: DatePickerHeaderProps) {
  const longMonths = React.useMemo(() => getMonthsOfYear(locale, 'long'), [locale]);
  const shortMonths = React.useMemo(() => getMonthsOfYear(locale, 'short'), [locale]);
  // Header button uses the short form so the trigger keeps a fixed width
  // across months (long names like "September" / "November" make the header
  // jump). The dropdown below still shows long names — plenty of room there.
  const monthLabel = shortMonths[visibleMonth] ?? '';

  const canPrev = canNavigateToMonth(visibleYear, visibleMonth - 1, min, max);
  const canNext = canNavigateToMonth(visibleYear, visibleMonth + 1, min, max);

  const monthTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const yearTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const [monthOpen, setMonthOpen] = React.useState(false);
  const [yearOpen, setYearOpen] = React.useState(false);

  function step(delta: number) {
    const next = new Date(visibleYear, visibleMonth + delta, 1);
    onYearChange(next.getFullYear());
    onMonthChange(next.getMonth());
  }

  return (
    <HStack
      vAlign="center"
      gap="4px"
      className={clsx(styles['date-picker-header'], 'j13b-date-picker-header')}
    >
      <Button
        utility
        size="sm"
        hierarchy="tertiary"
        disabled={!canPrev}
        onClick={() => step(-1)}
        aria-label="Previous month"
      >
        <NavChevron direction="left" />
      </Button>

      <Spacer />

      <ButtonGroup hierarchy="tertiary" size="sm">
        <Button
          ref={monthTriggerRef}
          onClick={() => setMonthOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={monthOpen}
          data-is-open={monthOpen ? 'true' : 'false'}
        >
          {monthLabel}
        </Button>
        <Button
          ref={yearTriggerRef}
          onClick={() => setYearOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={yearOpen}
          data-is-open={yearOpen ? 'true' : 'false'}
        >
          {String(visibleYear)}
        </Button>
      </ButtonGroup>

      <Spacer />

      <Button
        utility
        size="sm"
        hierarchy="tertiary"
        disabled={!canNext}
        onClick={() => step(1)}
        aria-label="Next month"
      >
        <NavChevron direction="right" />
      </Button>

      {monthOpen && (
        <ElementTethered
          anchorElement={monthTriggerRef}
          verticalAnchor="bottom"
          verticalOrigin="top"
          verticalOffset={4}
          horizontalAnchor="start"
          horizontalOrigin="start"
        >
          <ClickAwayListener
            onClickAway={() => setMonthOpen(false)}
            refs={[monthTriggerRef]}
          >
            <ScrollAwayListener onScrollAway={() => setMonthOpen(false)}>
              <SuggestionList aria-label="Month">
                {longMonths.map((name, i) => (
                  <SuggestionItem
                    key={i}
                    value={String(i)}
                    isSelected={i === visibleMonth}
                    onClick={() => {
                      onMonthChange(i);
                      setMonthOpen(false);
                    }}
                  >
                    {name}
                  </SuggestionItem>
                ))}
              </SuggestionList>
            </ScrollAwayListener>
          </ClickAwayListener>
        </ElementTethered>
      )}

      {yearOpen && (
        <ElementTethered
          anchorElement={yearTriggerRef}
          verticalAnchor="bottom"
          verticalOrigin="top"
          verticalOffset={4}
          horizontalAnchor="center"
          horizontalOrigin="center"
        >
          <ClickAwayListener
            onClickAway={() => setYearOpen(false)}
            refs={[yearTriggerRef]}
          >
            <ScrollAwayListener onScrollAway={() => setYearOpen(false)}>
              <div>
                <DatePickerYearSelector
                  visibleYear={visibleYear}
                  min={min}
                  max={max}
                  onSelect={(y) => {
                    onYearChange(y);
                    setYearOpen(false);
                  }}
                />
              </div>
            </ScrollAwayListener>
          </ClickAwayListener>
        </ElementTethered>
      )}
    </HStack>
  );
}

function NavChevron({ direction }: { direction: 'left' | 'right' }) {
  const points = direction === 'left' ? '7,3 3,6 7,9' : '3,3 7,6 3,9';
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points={points} />
    </svg>
  );
}
