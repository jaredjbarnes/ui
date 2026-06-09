# @j13b/ui

A small, strict, deeply theme-able React component library.

The library ships **structure, accessibility, and a vocabulary**. Everything visual — color, depth, motion, typography scale — lives in themes. Two themes ship in the box (`midnight` and `neumorphism`); writing a third is a matter of authoring CSS, not patching components.

```bash
npm install @j13b/ui
```

```tsx
import { Theme, Page, Header, VBody, Card, Button, Title, BodyText } from '@j13b/ui';
import { neumorphismStyleSheet } from '@j13b/ui/themes/neumorphism';

export function App() {
  return (
    <Theme styleSheets={[neumorphismStyleSheet]}>
      <Page>
        <Header><Title>My app</Title></Header>
        <VBody padding="24px" gap="12px">
          <Card padding="16px" gap="8px">
            <Title size="sm">Welcome</Title>
            <BodyText>This card paints itself from the cascade.</BodyText>
            <Button hierarchy="primary">Get started</Button>
          </Card>
        </VBody>
      </Page>
    </Theme>
  );
}
```

That's the entire surface area you have to learn to ship: pick a theme, drop it into a `<Theme>`, compose components. Everything else is opt-in depth.

## What the library is

Five guarantees, and only five:

1. **Component structure** — correct JSX, accessible markup, ARIA, focus management, keyboard handling. Layout topology via stack primitives (`HStack`, `VStack`, `ZStack`).
2. **Stable class names** at meaningful elements — `.j13b-button`, `.j13b-card`, `.j13b-modal-header`, `.j13b-tab-item`, `.j13b-suggestion-item`, etc. These are the public skinning targets.
3. **Stable data attributes** for state CSS pseudo-classes can't express — `data-is-checked`, `data-is-selected`, `data-is-open`, `data-hierarchy`, `data-severity`, `data-size`.
4. **One state-grammar primitive** — `.j13b-interactive`, which derives hover/focus/press colors from the local `--material` and `--action` via `color-mix`.
5. **Two cascade-based vocabularies** —
   - **Surface vocabulary** (`--material`, `--on-material`, `--action`, `--on-action`) — what kind of place is this, what color should I act with.
   - **Structural vocabulary** (`--body-fill`, `--body-basis`) — should a `<VBody>` here fill or be content-sized.

That's it. The library never ships a hex color, a `box-shadow`, a gradient, or a transition timing inside a component's CSS. Those are theme territory.

## What it isn't

- **Not a design system.** It doesn't pick a depth model, a color palette, or a density. Themes pick those.
- **Not a styled-components / Emotion / Tailwind wrapper.** Themes ship as `CSSStyleSheet` instances and attach via `document.adoptedStyleSheets` — no runtime style injection, no className churn on swap, works in Shadow DOM.
- **Not a Material / Chakra / shadcn lookalike.** Components are intentionally chrome-less in the system layer; the look is whatever the theme paints.

If you want a library that *prescribes* a look, this is the wrong one. If you want one that gets out of your theme's way, read on.

## The cascade is the API

Every surface (Card, Modal, Section, Panel, Page, Sidebar, the table-row context — anything that paints) redeclares the surface vocabulary at its boundary:

```css
/* From a theme — Modal sets its own material */
.j13b-modal {
  --material:    var(--theme-overlay);
  --on-material: var(--theme-on-overlay);
  --action:      var(--theme-accent-on-overlay);
  --on-action:   var(--theme-on-accent-on-overlay);
  background-color: var(--material);
  color: var(--on-material);
}
```

A `<Button>` dropped inside reads `var(--material)` for its background, `var(--action)` for its hover tint, and never knows it's inside a modal. Drop the same Button into a `<TR data-is-selected="true">` and it recolors against the selected-row material instead. Same component, three readings, zero per-context logic.

The structural vocabulary works the same way for layout. A `<VBody>` inside a `<Panel>` fills the remaining height (Panel sets `--body-fill: 1`). The same `<VBody>` inside a `<Card>` sizes to its content (Card sets `--body-fill: 0`). One component, two structural readings — driven by the surrounding surface, not by a prop.

## Themes

Two themes ship in the package:

- **`midnight`** — dark, flat, near-zero chrome. Borders and material steps do the work.
- **`neumorphism`** — light grayscale gradient canvas with neumorphic shadow recipes (raised pebbles, engraved seams, sunken slots, sheet edges).

Swap is a one-line state change:

```tsx
import { midnightStyleSheet } from '@j13b/ui/themes/midnight';
import { neumorphismStyleSheet } from '@j13b/ui/themes/neumorphism';

<Theme styleSheets={[isDark ? midnightStyleSheet : neumorphismStyleSheet]}>
  {/* ... */}
</Theme>
```

No DOM thrash, no className rewrite, no flash. The `adoptedStyleSheets` swap takes effect in one paint.

### Writing your own theme

A theme is a single `CSSStyleSheet` built from CSS strings via `buildStyleSheet`. Mirror the structure of `src/themes/themes/midnight/`:

```ts
import { buildStyleSheet } from '@j13b/ui/themes';

import themeTokens from './tokens/theme.css?raw';
import systemTokens from './tokens/system.css?raw';
import base from './parts/base.css?raw';
import surfaces from './parts/surfaces.css?raw';
// ... typography, inputs, actions, layouts, calendar, form

export const myThemeStyleSheet = buildStyleSheet([
  themeTokens, systemTokens, base,
  surfaces, /* ... */
]);
```

You only need to provide the parts your design system cares about. Themes target the library's stable selectors — they never see component internals.

## Architecture

The library is intentionally small, but the *principles* it enforces deserve their own docs:

| Doc | What it covers |
|---|---|
| [`docs/principles.md`](./docs/principles.md) | What the library promises, what it doesn't, the two axes (surface, state). |
| [`docs/css-layers.md`](./docs/css-layers.md) | `j13b-reset` / `j13b-system` / `j13b-theme` and what belongs in each. |
| [`docs/surface-vocabulary.md`](./docs/surface-vocabulary.md) | The four-variable contract every surface declares. |
| [`docs/surfaces-and-layouts.md`](./docs/surfaces-and-layouts.md) | Surfaces paint and redeclare; layouts arrange. |
| [`docs/composition-emphasis.md`](./docs/composition-emphasis.md) | Same component, different visual depending on composition. |
| [`docs/sizing-defaults.md`](./docs/sizing-defaults.md) | Three sizing intents (fill / content / context-aware Body). |
| [`docs/structural-vocabulary.md`](./docs/structural-vocabulary.md) | Surfaces declare layout stance via CSS variables; Body consumes. |
| [`docs/interactive-states.md`](./docs/interactive-states.md) | `.j13b-interactive`, hover/focus/press color derivation. |
| [`docs/state-attributes.md`](./docs/state-attributes.md) | The `data-*` conventions for state beyond pseudo-classes. |
| [`docs/theming.md`](./docs/theming.md) | How to author a theme, the two-tier token split, parts file layout. |

Read `principles.md` first; everything else follows from it.

## Components at a glance

**Layout primitives** (the topology): `HStack`, `VStack`, `ZStack`, `Spacer`.

**Layouts** (wireframes that arrange without painting): `HBody`, `VBody`, `Grid`, `Group`, `List`, `Divider`, `Responsive`, `Scaffold`.

**Surfaces** (places that paint): `Page`, `Panel`, `Card`, `Section`, `Header`, `Footer`, `Bar`, `UtilityBar`, `Aside`, `SidebarStart`, `SidebarEnd`, `Alert`, `Modal`, `Window`, `Drawer`, `Popover`, `Tooltip`, `Confirm`, `PopConfirm`, `TTable`, `Tabs`, `Chip`, `Bubble`, `Badge`, `Key`, `Value`, `Term`.

**Inputs**: `Input`, `Textarea`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider`, `Select`, `Option`, `SuggestionList`, `ControlRow`, `ControlStack`, `DatePicker`.

**Actions**: `Button`, `BaseButton`, `ButtonGroup`, `Toggle`.

**Typography**: `Title`, `Headline`, `Subheadline`, `BodyText`, `Callout`, `Footnote`, `Caption`.

**Form**: `Field`, helpers for label / hint / error.

Each component is exported from the root `@j13b/ui` package and also from a per-category subpath (`@j13b/ui/actions`, `@j13b/ui/inputs`, etc.) for tree-shaking-friendly imports.

## Compatibility

- **React** 18.2+
- **TypeScript** types ship with the package
- **Browsers** that support [CSS `@layer`](https://caniuse.com/css-cascade-layers), [`color-mix`](https://caniuse.com/css-color-mix), and [`adoptedStyleSheets`](https://caniuse.com/?search=adoptedStyleSheets) — i.e., evergreen Chrome / Edge / Firefox / Safari since mid-2023. There is no IE / pre-2023 fallback path.

## Storybook

Every component ships with stories. Run locally:

```bash
yarn install
yarn storybook
```

Stories are also the canonical visual documentation — if you want to see what a Sidebar inside a Panel inside a Page looks like, the `Surfaces/Structural` stories show every composition the architecture supports.

## License

MIT
