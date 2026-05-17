# CSS Layers

The cascade order is declared once, in `src/css/layers.css`:

```css
@layer j13b-reset, j13b-system, j13b-theme;
```

This file is imported first in `src/index.ts` so every consumer of the package gets a deterministic cascade. **Reset loses to system. System loses to theme.**

## What belongs where

### `j13b-reset`

Meyer-style normalization. Box-model defaults, font inheritance for form controls, removing list bullets, removing default margins. Touched only when adding broad cross-browser fixes.

Lives in `src/themes/stylesheets/reset.css`.

### `j13b-system`

Component **structure**. Things that are true regardless of theme:

- Layout — `display`, `flex-direction`, `gap` topology
- Sizing primitives that key off tokens — `min-height: var(--control-height)`
- Box model — `box-sizing`, `position: relative` for stacking contexts
- Focusability affordances — `outline: none` resets, `:focus-visible` hooks
- The state grammar — `.j13b-interactive` declares the `--*-toward` variables and computed `--act-*` colors, plus the `:hover` / `:active` / `:focus-visible` background bindings

What does NOT belong here:
- Hard-coded colors
- Hard-coded shadows
- Border radii (themes pick those)
- Transition timings beyond the bare minimum needed for state crossfades
- Anything that would force a theme to undo work

If you find yourself writing `background-color: #...` in a `*.module.css` file, it belongs in a theme.

System CSS is colocated with components as `*.module.css` files, scoped via CSS Modules so class names can't collide.

### `j13b-theme`

Visual **skin**. The whole appearance of the UI lives here:

- Token files — palette and system token aliases
- Per-domain part files — `actions.css`, `inputs.css`, `surfaces.css`, etc.
- Anything color, shadow, radius, transition that gives the UI personality

Themes ship as one or more `CSSStyleSheet` instances, applied via `adoptedStyleSheets`. A theme owns this layer entirely; components do not write into it.

## Why `:where()` in system CSS

System CSS uses `:where(.foo)` rather than `.foo` to keep specificity at zero. This guarantees a theme rule like `.j13b-button { ... }` (specificity 0,1,0) wins without `!important`, no matter how nested the system selector is.

```css
@layer j13b-system {
  /* specificity 0,0,0 — themes effortlessly override */
  :where(.button[data-hierarchy="primary"]) {
    display: inline-flex;
  }
}
```

## Why specificity-0 system CSS isn't a license to override the theme

`@layer` order beats specificity. Even if you wrote a 1000-specificity selector in `j13b-system`, a 0-specificity selector in `j13b-theme` would still win. The `:where()` is belt-and-suspenders: it lets us drop `@layer` someday without breaking themes. Layer-first, specificity-second.

## Import upstream dependencies before your own CSS

When two `:where()` rules in the same layer both reach an element, they tie at 0,0,0 and **source order** decides — the later rule wins. Source order in the bundle follows the JS module graph, so the convention in a component file is:

```tsx
// 1. Upstream component imports (their CSS registers first)
import { Portal } from '../portal/portal.js';

// 2. Your own .module.css (registers after, wins source-order ties)
import styles from './frame.module.css';
```

This is what lets a component override a structural rule its dependency sets — e.g. `Frame` neutralizing `pointer-events` on the veil wrapper that `Portal`'s platform would otherwise activate. Reorder those imports and the cascade flips silently. Keep upstream deps above your own stylesheet, always.
