/**
 * Strongly-typed surface vocabulary, exposed as `var(--…)` strings so JS-styled
 * code can reach for the same tokens that components consume in CSS.
 *
 * See docs/surface-vocabulary.md.
 */
export const theme = {
  // Surface — what kind of place is this?
  material: 'var(--material)',
  onMaterial: 'var(--on-material)',
  action: 'var(--action)',
  onAction: 'var(--on-action)',

  // State — direction knobs (rarely consumed directly; provided for completeness)
  shade: 'var(--shade)',
  hoverToward: 'var(--hover-toward)',
  focusToward: 'var(--focus-toward)',
  dragToward: 'var(--drag-toward)',
  pressToward: 'var(--press-toward)',

  // State — derived backgrounds
  raised: 'var(--act-raised)',
  focus: 'var(--act-focus)',
  drag: 'var(--act-drag)',
  pressed: 'var(--act-down)',

  // Action severity (theme-aliased)
  actionSeverity: {
    dangerous: 'var(--action-severity-dangerous)',
    cautious: 'var(--action-severity-cautious)',
    neutral: 'var(--action-severity-neutral)',
    suggested: 'var(--action-severity-suggested)',
    encouraged: 'var(--action-severity-encouraged)',
  },

  // Status
  statusColors: {
    info: 'var(--status-color-info)',
    warning: 'var(--status-color-warning)',
    error: 'var(--status-color-error)',
    positive: 'var(--status-color-positive)',
    disabled: 'var(--status-color-disabled)',
  },

  // Spacing
  padding: {
    sm: 'var(--padding-small)',
    md: 'var(--padding-medium)',
    lg: 'var(--padding-large)',
  },
  gap: {
    sm: 'var(--gap-small)',
    md: 'var(--gap-medium)',
    lg: 'var(--gap-large)',
  },

  // Misc
  scalar: 'var(--scalar)',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--font-size)',
} as const;
