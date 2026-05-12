# Principles

`@j13b/ui` is a thin library and a strict contract. It ships **structure, accessibility, and a vocabulary**; themes ship **everything visual**.

## What the library is

The library promises five things and only five:

1. **Component structure** — correct JSX, accessible markup, ARIA, focus management, keyboard handling. Layout topology via Stacks (flex, gap, sizing primitives).
2. **Stable class names** at meaningful elements — `.j13b-button`, `.j13b-button-text`, `.j13b-modal`, `.j13b-modal-header`, `.j13b-input-frame`, `.j13b-tab-item`, `.j13b-suggestion-item`, etc. These are the public skinning targets.
3. **Stable data attributes** for state that pseudo-classes can't express — `data-is-checked`, `data-is-selected`, `data-is-open`, `data-is-loading`, `data-hierarchy`, `data-severity`, `data-size`, etc. See [`state-attributes.md`](./state-attributes.md).
4. **One state-grammar primitive** — `.j13b-interactive`, which maps a surface's `--material` and `--action` into derived state colors via `color-mix`. See [`interactive-states.md`](./interactive-states.md).
5. **The four-variable surface vocabulary** — `--material`, `--on-material`, `--action`, `--on-action`. Components consume; themes (and surfaces within themes) provide. See [`surface-vocabulary.md`](./surface-vocabulary.md).

That's the entire library surface area.

## What the library does not promise

- Visual appearance of any component.
- Shadows, depth, elevation, chrome, glass, neumorphism — any visual treatment.
- Color values or palettes.
- Borders, radii, transitions, gradients.
- Iconography, typography sizes, font choices.
- Density beyond what comes from `data-size`.

All of these are theme territory. The library never writes a `box-shadow`, a hex color, a gradient, or a transition timing into component CSS. If you find a `*.module.css` file in `src/` doing any of those, that's a bug.

## The two axes the library exposes

### Surface — *what kind of place is this?*

A four-variable vocabulary every surface declares:

```css
--material       /* the surface's background */
--on-material    /* legible foreground */
--action         /* accent for actions on this surface */
--on-action      /* legible foreground when something IS the accent */
```

Surfaces *redeclare* this vocabulary at every boundary. A modal header redeclares for itself; every interactive child reads from CSS context and recolors automatically. Components never query their parent — they consume from the cascade.

See [`surface-vocabulary.md`](./surface-vocabulary.md).

### State — *how does it respond?*

Two kinds of state, two kinds of mechanism:

- **Pseudo-class states** (`:hover`, `:focus-visible`, `:active`) — owned by the `.j13b-interactive` primitive, which derives `--act-raised` / `--act-focus` / `--act-down` via `color-mix` against the local material. Themes can mirror them with `[data-hover]` etc. for forced state in stories.
- **Stateful data attributes** (everything CSS pseudo-classes can't reach) — `data-is-checked`, `data-is-selected`, `data-is-open`, `data-is-loading`, `data-is-disabled`, plus enums like `data-hierarchy`, `data-severity`, `data-size`. Components emit them from React state.

See [`interactive-states.md`](./interactive-states.md) and [`state-attributes.md`](./state-attributes.md).

## Surfaces, layouts, and the stack primitive

Structural components split into three roles. The full rationale and decision rules are in [`surfaces-and-layouts.md`](./surfaces-and-layouts.md); the short version:

- **`src/stacks/`** — the topology primitive (`HStack`, `VStack`, `ZStack`, `Spacer`). Everything else is built on these.
- **`src/layouts/`** — named arrangement patterns (`Grid`, `List`, `Divider`, `Responsive`, ...). Layouts **do not** paint a material. They are wireframes that organize content *on* a surface.
- **`src/surfaces/`** — places that paint and redeclare the vocabulary (`Card`, `Modal`, `Tooltip`, `Popover`, `Drawer`, `Window`, `Header`, `Footer`, `Bar`, `Table`, `Sidebar`, `Panel`, `Alert`, `Page`, `Section`, ...). Surfaces are the only components that contribute color.

The test: *Does this component want a `--material` of its own?* Yes → surface. No → layout.

This split exists so theme authors only have to look in one place (`surfaces.css` parts) to find where paint happens. Layouts compose freely without contributing color.

## Stacks and atoms

Components fall into two structural shapes:

**Stacks** — components whose outer element is `HStack`, `VStack`, or `ZStack` (or built directly on one — e.g., `Button` renders `HStack as="button"`). They participate in stack layout naturally because they ARE stacks. They emit the stack class (`j13b-h-stack`, etc.) plus `data-width` / `data-height`.

**Atoms** — components whose outer element is a native HTML leaf, typically a form control like `<input>`, `<textarea>`, `<select>`, or `<input type="range">`. The browser's intrinsic behavior on those tags forces the outer element; they cannot be a stack. Atoms emit `j13b-atom` plus `data-width` / `data-height` so they participate in the same stack-child rules as nested stacks.

The `data-width` / `data-height` attributes are the layout-participation mechanism for both. Stack rules like `:where(.h-stack > [data-width="default"])` target ANY direct child with the attribute — stacks and atoms alike. The `j13b-atom` class is a **semantic marker** for theme/layout rules that want to address leaf-shaped components specifically (e.g., `.h-stack > .j13b-atom { ... }`); it is **not** required for layout participation.

Decision rule for new components:
- Can use HStack/VStack as the outer element → it's a stack. No atom class.
- Must use a native form/leaf element → it's an atom. Add `j13b-atom`.

Examples:
- `Button`, `Toggle`, `ButtonGroup` → stacks (built on HStack).
- `Input`, `Textarea`, `Checkbox`, `Radio`, `Slider` → atoms.
- `Switch`, `Select` → depends on implementation (styled wrapper around a hidden native input → atom; pure styled-div with custom interactions → stack).

## Cascade-first composition

The recurring move: **redeclare the vocabulary at each boundary, derive everything else through `color-mix`**. Components do not branch on context. They consume variables and trust the surface to set them.

When you find yourself writing component CSS that asks "am I inside an X?", you've broken the rule. The X should be telling you what you are by writing CSS variables you already read.

## CSS layers as the cascade contract

Three layers, ordered:

```css
@layer j13b-reset, j13b-system, j13b-theme;
```

- `j13b-reset` — Meyer-style normalization.
- `j13b-system` — component **structure** only. Layout, sizing, ARIA-friendly affordances. The `.j13b-interactive` primitive lives here.
- `j13b-theme` — visual **skin**. Themes own this layer entirely.

Themes always win over system. System always wins over reset. See [`css-layers.md`](./css-layers.md).

## Theming as `adoptedStyleSheets`, not className swaps

Themes ship as `CSSStyleSheet` instances and attach via `document.adoptedStyleSheets`. Swapping a theme is a single assignment — no DOM thrash, no className churn, works in Shadow DOM. See [`theming.md`](./theming.md).

## Why the library is this small

UIs vary radically — flat, neumorphic, glass, brutalist, win98 chrome. A library that *prescribes* a depth model or a color system gets in the way of every theme that disagrees. The job of the library is to make components **theme-able**, not **themed**.

The smallest API surface that supports radical visual variation is:
- Stable selectors so themes can target.
- Stable state attributes so themes can react.
- A single state-grammar primitive so trivial themes don't have to redo `color-mix` for hover/focus/press.
- A surface vocabulary so the cascade can compose.

Anything beyond that — an "elevation" model, a "density" model, a "motion" model — is a theme detail. A theme is free to invent its own classes (`.midnight-overlay-shadow`, `.midnight-control-track`) for its own organization, but those names are never part of the library API and never appear in component markup.
