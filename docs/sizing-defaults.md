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

### Pattern 3 — Always-fill (Body)

Used by: `VBody`, `HBody`.

The content slot of a surface always fills the slot — both axes, regardless of the parent stack's alignment:

```css
:where(.v-body),
:where(.h-body) {
  flex: 1 1 0;          /* main-axis: pure flex distribution */
  align-self: stretch;  /* cross-axis: beat parent's align-items */
  min-width: 0;
  min-height: 0;
  overflow: auto;
}
```

Three pieces:

- **`flex: 1 1 0`** — main-axis fill via flex distribution (same primitive as Pattern 1). A VBody inside an HBody fills horizontally; an HBody inside a VBody fills vertically. Two Body siblings split the main axis.
- **`align-self: stretch`** — cross-axis fill. Necessary because `HStack` defaults to `vAlign='center'` (`align-items: center`), which would otherwise sit a child VBody at the row midpoint with `height: auto` instead of filling. `align-self` on the child wins over `align-items` on the parent, but only when the cross-axis size is `auto` — explicit values still win.
- **`min-{width,height}: 0` + `overflow: auto`** — the standard flex-with-overflow pattern. The Body can shrink below its content size when the surface is constrained, and content that exceeds the slot scrolls.

Unlike Patterns 1 and 2, the Body rule applies unconditionally — Body is a layout primitive whose identity is "the content slot that fills." If you want content-sized vertical stacking, reach for a `VStack`, not a `VBody`.

## Choosing a pattern for a new component

Ask: *if I drop two of these into a VStack with no other content, what should happen?*

- **They split the space.** → Pattern 1 (Fill). The component is a *region OF* its parent.
- **Each takes its content height.** → Pattern 2 (Content). The component is a *widget ON* its parent.
- **It's the content slot of a surface.** → Pattern 3 (Body).

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
