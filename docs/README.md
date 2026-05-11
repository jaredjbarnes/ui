# Docs

Architectural documentation for `@j13b/ui`. Read in this order:

1. [`principles.md`](./principles.md) — what the library is, what it isn't, the two axes (surface, state) it exposes, and the cascade-first philosophy.
2. [`css-layers.md`](./css-layers.md) — `j13b-reset` / `j13b-system` / `j13b-theme` and what belongs in each.
3. [`surface-vocabulary.md`](./surface-vocabulary.md) — the four-variable contract every surface declares.
4. [`interactive-states.md`](./interactive-states.md) — `.j13b-interactive`, the `--*-toward` direction system, the two-layer composition (surface base + component decoration).
5. [`state-attributes.md`](./state-attributes.md) — the `data-*` conventions for state beyond pseudo-classes.
6. [`theming.md`](./theming.md) — how to author a theme, the two-tier token split, the parts file layout.
