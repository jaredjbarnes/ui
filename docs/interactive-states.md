# Interactive States

`.j13b-interactive` is the foundation for everything clickable: Button, Toggle, TabItem, MenuItem, ListItem, suggestion items, table rows, sortable headers. It declares a state grammar — *not* a visual style. Each component layers its own decoration on top.

## The state grammar

```css
:where(.j13b-interactive) {
  /* Vocabulary — components/surfaces override these */
  --ink: var(--on-material);
  --act: var(--action);
  --mat: var(--material);

  /* Direction knobs — surfaces tune these */
  --shade: black;                          /* "depth" direction; flip to white on dark surfaces */
  --hover-toward: var(--act);
  --focus-toward: var(--act);
  --drag-toward:  var(--act);
  --press-toward: var(--shade);

  /* Derived state colors */
  --act-raised: color-mix(in srgb, var(--mat), var(--hover-toward) 12%);
  --act-focus:  color-mix(in srgb, var(--mat), var(--focus-toward) 16%);
  --act-drag:   color-mix(in srgb, var(--mat), var(--drag-toward)  24%);
  --act-down:   color-mix(in srgb, var(--mat), var(--press-toward) 12%);

  cursor: pointer;
  user-select: none;
  background: var(--mat);
  color: var(--ink);
  transition: background 0.1s, color 0.1s;
}
```

Pseudo-class bindings:

```css
:where(.j13b-interactive:hover),
:where(.j13b-interactive[data-hover])                   { background: var(--act-raised); }

:where(.j13b-interactive:focus-visible),
:where(.j13b-interactive[data-focus-visible])           { background: var(--act-focus); }

:where(.j13b-interactive:active),
:where(.j13b-interactive[data-active])                  { background: var(--act-down); }

:where(.j13b-interactive[data-is-disabled="true"])      { pointer-events: none; }
```

The `data-*` mirrors next to `:hover` / `:active` / `:focus-visible` exist so Storybook (and any test harness) can pin a state without real input. Same coloring path.

## Why states are derived, not declared

Pre-baked "hover blue" and "active blue" tokens force you to author N variants per surface. Deriving from `var(--mat)` + a direction means **the math always sees the local material**. A button on a white card mixes a 12% accent tint of *white*; the same button on a dark modal header mixes a 12% accent tint of *dark*. There is no "dark mode hover color" — it falls out of the math.

This is why a dark theme is mostly a palette + `--shade: white` rewire. The component CSS never changes.

## When to override `--shade`

`--shade` is the **press direction**. It defaults to `black`. The natural rule of thumb:

> Flip `--shade: white` only when the surface is so dark there's no black headroom for press to deepen into.

Most "dark themes" are dark *gray*, not near-black, so they keep `--shade: black`. The press still deepens — same physics as on a light theme. Pure-black or near-pure-black surfaces (a Modal header that intentionally sits darker than its parent for contrast, an OLED-friendly true-black theme) are where the flip earns its keep.

This is why `--shade` lives on the surface vocabulary and not on the theme root: it's a property of *this particular surface*, not of "the theme." A light theme can have a dark `Tooltip` that sets `--shade: white`; a dark theme can have a near-black `Modal.Header` that sets `--shade: white` even though the surrounding theme uses black.

## Two-layer composition: surface sets direction, component adds decoration

**Layer 1 — Surface controls base state colors via `--*-toward`.**

A surface (or theme) tunes the four direction variables. Every interactive child on that surface agrees on what hover/focus/drag/press *mean* color-wise.

```css
/* A near-black header inside any theme: there's no black headroom,
   so press needs to lighten to be perceptible. */
.j13b-modal :where(.j13b-header) {
  --material: #0a0c10;
  --on-material: #ffffff;
  --shade: white;
}
```

**Layer 2 — Component adds flourishes on top of the base.**

Each component owns transforms, shadows, edge stripes, underlines — but reads the same base background colors from Layer 1. Two components on the same surface:

```css
/* Button: lifts and casts a shadow on hover */
.j13b-button:hover {
  /* background already set to --act-raised by .j13b-interactive */
  transform: translateY(-1px);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
}

/* MenuItem: shows a left-edge accent stripe on hover */
.j13b-menu-item:hover {
  /* same --act-raised background — automatic consistency */
  border-inline-start: 3px solid var(--act);
}
```

Both hover with the *same color* (because they share the surface's `--hover-toward`), but each has its own physical signature. Consistency where it matters, variety where it expresses.

## Customizing per component

Components override the **vocabulary** rather than the properties. For example, a primary Button rewires `--mat` and `--ink` to express the "filled" hierarchy:

```css
.j13b-button[data-hierarchy="primary"] {
  --mat: var(--j13b-button-color, var(--button-filled-bg));
  --ink: var(--j13b-button-text-color, var(--button-filled-fg));
}
```

The state colors (`--act-raised`, `--act-down`, `--act-focus`) automatically recompute because they read `var(--mat)`. No need to redefine hover/focus/active for each hierarchy.

## Per-instance escape hatch

Per-instance overrides flow through the same machinery. Setting `style={{ '--j13b-button-color': '#82722B' }}` on a Button reroutes `--mat`, and the four state colors recompute against that new material. Same hover behavior, customized base.

## When to extend the vocabulary vs. when to override expressions

Most needs are met by tuning the four `--*-toward` directions. If a theme needs press to be a *radial gradient* or hover to involve `filter: brightness()`, that's a theme-level expression override:

```css
.magma-theme .j13b-interactive:active {
  background: radial-gradient(circle, oklch(72% 0.30 35), oklch(55% 0.22 25) 45%, var(--mat) 100%);
  filter: brightness(1.1);
}
```

The grammar gives you the *common case* for free. Themes that want richer expression have full access to the same selectors.
