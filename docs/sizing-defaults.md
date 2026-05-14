# Sizing defaults

Every component in `@j13b/ui` declares a sizing *intent* in its CSS module — what it wants to do when the consumer passes no explicit size prop. There are three intent patterns. Knowing which one a component uses tells you how it'll behave in a layout.

All three patterns share a single opt-out mechanism: the `data-*="default"` attribute. The stack only emits that attribute when no width/height prop was passed; any explicit value (`"auto"`, `"200px"`, `"fill"`) changes the attribute, the default rule stops matching, and the consumer's value takes over. One contract, no per-component prop branching.

## The three patterns

### Pattern 1 — Fill (split space with siblings)

Used by: `Page`, `Panel`, `Section`, `TTable`.

The surface fills its container's main axis by default. Two stacked siblings split the space proportionally.

```css
:where(.panel[data-height="default"]) {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}
```

Why basis 0: with `flex-basis: 0`, the surface contributes nothing from its content to the basis sum. Pure flex distribution determines size. Two Panels in a VStack each grow from 0 by `flex-grow: 1`, so they split available height evenly. With `flex-basis: auto` they'd weight by content size — sometimes useful, but not the "fill the region" semantic these surfaces want.

The rule is gated on `[data-height="default"]` so passing any explicit height breaks the rule:

| Prop | Result |
|---|---|
| `(none)` | `data-height="default"` → fill rule matches → splits space |
| `height="auto"` | `data-height="auto"` → rule doesn't match → content-sized via stack base |
| `height="200px"` | `data-height="200px"` → rule doesn't match → inline style sets 200px |
| `height="fill"` | `data-height="fill"` → routes through the stack's existing `[data-height="fill"]` rule → also fills |

Same shape for the cross axis with `data-width="default"`. `Page` and `Section` both gate both axes; `Panel` and `Table` gate just the main one because their cross-axis fill is already handled by the stack base (`width: 100%`).

### Pattern 2 — Content (inline widget, no fill)

Used by: `Card`, `Aside`, `Bar` / `Header` / `Footer`.

No special rule. The component sizes to its content via the stack base (`height: auto, width: 100%` for VStacks; mirrored for HStacks).

```css
:where(.card) {
  position: relative;
}
```

These are *self-contained inline widgets* — they sit ON the surrounding surface rather than being a structural region OF it. Two Cards in a VStack each take their content height; they don't split. The consumer can still pass an explicit size — `Card` works with `height="fill"` the same way `Panel` does — but the default reads as "use as much as you need."

### Pattern 3 — Context-aware (Body)

Used by: `VBody`, `HBody`.

Body's main-axis behavior tracks the parent surface's sizing pattern — fills inside Panel/Page/Section, content-sized inside Card/Aside. Cross-axis always stretches to fill the slot:

```css
:where(.v-body),
:where(.h-body) {
  flex-grow: var(--body-fill, 0);          /* main-axis: declared by parent surface */
  flex-shrink: 1;
  flex-basis: var(--body-basis, auto);     /* main-axis: declared by parent surface */
  align-self: stretch;                     /* cross-axis: beat parent's align-items */
  min-width: 0;
  min-height: 0;
  overflow: auto;
}
```

Body's main-axis behavior is **context-aware** — it tracks the parent surface's sizing pattern via the [structural vocabulary](./structural-vocabulary.md):

| Inside | `--body-fill` | `--body-basis` | Effect |
|---|---|---|---|
| Panel / Page / Section | `1` | `0` | Body fills the remaining slot |
| Card / Aside | `0` | `auto` | Body is content-sized; doesn't collapse Card to 0 |

Surfaces declare these values in their CSS modules; the cascade carries them to Body. A Card nested inside a Panel resets to `0 / auto`, so the Body inside that Card sizes to its content even though Panel above declared fill. See [`structural-vocabulary.md`](./structural-vocabulary.md) for the full mechanism.

Cross-axis is `align-self: stretch` — overrides the parent stack's `align-items` so a child VBody fills the row height of its parent HBody (which defaults to `align-items: center` via `vAlign='center'`). Only takes effect when the cross-axis size is `auto`; explicit sizes still win.

`min-{width,height}: 0` + `overflow: auto` is the standard flex-with-overflow pattern: Body shrinks below its content when the surface is constrained, content that exceeds the slot scrolls.

## Choosing a pattern for a new component

Ask: *if I drop two of these into a VStack with no other content, what should happen?*

- **They split the space.** → Pattern 1 (Fill). The component is a *region OF* its parent.
- **Each takes its content height.** → Pattern 2 (Content). The component is a *widget ON* its parent.
- **It's the content slot of a surface.** → Pattern 3 (Context-aware Body — adapts to whichever surface it sits inside).

The Panel-vs-Card line is the canonical case for Patterns 1 vs 2. Panel splits because it represents a region; Card doesn't because it represents a widget. See [`composition-emphasis.md`](./composition-emphasis.md) for the role split and visual treatment that follows from it.

## Why the same opt-out hook for everything

The stack's data-attribute system is the single source of truth for "did the consumer pass an explicit size or not?" Components hook into the same `[data-*="default"]` query the stack itself uses:

```css
/* From stack.module.css */
:where(.h-stack > [data-width="default"]) {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0%;
  width: auto;
}

/* From panel.module.css */
:where(.panel[data-height="default"]) {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}
```

Consumers never have to know which surface honors which prop. Surface authors never have to invent a custom opt-out — the data attribute already exists.

If you find yourself reaching for a per-component sizing prop, a CSS variable, or an `!important`, you're fighting the system. The fix is almost always a `data-*="default"` rule that paints the intent you want.

## Related principles

- [`principles.md`](./principles.md) — what the library promises (stable selectors, stable data attributes, the surface vocabulary).
- [`surfaces-and-layouts.md`](./surfaces-and-layouts.md) — surfaces redeclare and paint; layouts arrange. Bodies are layouts that fill; Panels are surfaces that fill; Cards are surfaces that don't.
- [`composition-emphasis.md`](./composition-emphasis.md) — same component, different visual depending on context. The sizing intent (Pattern 1 vs 2) is part of *what* a surface is; the composition rules decide *how it looks* in each context.
