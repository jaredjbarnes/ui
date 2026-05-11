import React from 'react';

export interface OptionProps {
  /** Display content for the option row. If omitted, `label` is rendered. */
  children?: React.ReactNode;
  /** Value emitted to the parent's onChange when this option is selected. */
  value: string;
  /** REQUIRED. The string used as the trigger's display text when this
   *  option is selected, and as the default search-match string. */
  label: string;
  /** Additional terms the search filter will match against beyond `label`.
   *  Useful for synonyms (e.g., a "United States" option with keywords
   *  ['usa', 'america']). */
  keywords?: string[];
  disabled?: boolean;
}

/**
 * A data-carrier component used as a child of Select / MultiSelect /
 * ComboBox. The parent component reads its props (value, label, keywords,
 * disabled, children) and renders SuggestionItems internally; Option's own
 * render output is used only as a fallback when used outside a parent that
 * understands it.
 */
export function Option({ children, label }: OptionProps) {
  return <>{children ?? label}</>;
}
