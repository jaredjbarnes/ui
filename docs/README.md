# Docs

Architectural documentation for `@j13b/ui`. Read in this order:

1. [`principles.md`](./principles.md) — what the library is, what it isn't, the two axes (surface, state) it exposes, and the cascade-first philosophy.
2. [`css-layers.md`](./css-layers.md) — `j13b-reset` / `j13b-system` / `j13b-theme` and what belongs in each.
3. [`surface-vocabulary.md`](./surface-vocabulary.md) — the four-variable contract every surface declares.
4. [`surfaces-and-layouts.md`](./surfaces-and-layouts.md) — how components split between `surfaces/` (paint material) and `layouts/` (arrange without painting), and the two tiers of per-context theming.
5. [`composition-emphasis.md`](./composition-emphasis.md) — same component, different visual depending on composition; the theme owns per-context variation. Worked example: `Sidebar` across `Page` / `Panel` / `Card`.
6. [`sizing-defaults.md`](./sizing-defaults.md) — three sizing intents (fill, content, always-fill) and the shared `data-*="default"` hook every component uses.
7. [`structural-vocabulary.md`](./structural-vocabulary.md) — surfaces declare their layout stance via CSS variables; layout primitives consume. The structural sibling to the surface vocabulary.
8. [`interactive-states.md`](./interactive-states.md) — `.j13b-interactive`, the `--*-toward` direction system, the two-layer composition (surface base + component decoration).
9. [`state-attributes.md`](./state-attributes.md) — the `data-*` conventions for state beyond pseudo-classes.
10. [`theming.md`](./theming.md) — how to author a theme, the two-tier token split, the parts file layout.
