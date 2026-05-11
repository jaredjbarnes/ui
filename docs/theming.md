# Theming

Themes ship as `CSSStyleSheet` instances and are attached at runtime via `document.adoptedStyleSheets` (or a Shadow Root's). Swapping themes is a single assignment — no DOM thrash, no className churn, works in Shadow DOM.

## The Theme provider

```tsx
import { Theme } from '@j13b/ui';
import { myDarkStyleSheet } from '@j13b/ui/themes/my_dark';

<Theme styleSheets={[myDarkStyleSheet]}>
  <App />
</Theme>
```

`Theme` finds its enclosing `Document` or `ShadowRoot` and assigns `adoptedStyleSheets`. The provider also adds a `j13b-theme-root` class to its outer element so themes can target the root surface.

## Anatomy of a theme

A theme is a folder under `src/themes/themes/<name>/`. **The structure is a convention, not a contract** — themes are free to organize their CSS however they like. The convention below is what midnight uses; adopt or reject as you see fit:

```
my_dark/
├── index.ts                  ← entrypoint, exports `myDarkStyleSheet`
├── tokens/
│   ├── theme_tokens.css      ← palette
│   └── system_tokens.css     ← aliases palette into the surface vocabulary
└── parts/
    ├── base.css              ← root surface paint, font, optional --*-toward overrides
    ├── actions.css           ← Button, Toggle, ButtonGroup chrome
    ├── inputs.css            ← TextInput, Select, Checkbox, Slider, ...
    ├── surfaces.css          ← Card, Modal, Drawer, Page, Panel, Tooltip, ...
    ├── navigation.css        ← Tabs, NavItem, MenuItem
    └── typography.css        ← Title, BodyText, Headline, ...
```

If a theme wants to factor a shared visual recipe (say, a "floating overlay shadow" used by Modal, Drawer, Tooltip, Popover) into its own internal class — that's purely a theme implementation detail. Pick a name in your theme's namespace (`.midnight-overlay-shadow`), apply it from your other parts files. The library does not define or know about that class.

The entrypoint concatenates the parts and constructs a single `CSSStyleSheet`:

```ts
import { buildStyleSheet } from '../../build_stylesheet.js';
import tokensCss from './tokens/theme_tokens.css?raw';
import systemTokensCss from './tokens/system_tokens.css?raw';
import baseCss from './parts/base.css?raw';
import actionsCss from './parts/actions.css?raw';
// ...

export const myDarkStyleSheet = buildStyleSheet([
  tokensCss,
  systemTokensCss,
  baseCss,
  actionsCss,
  // ...
]);
```

Order matters when later rules depend on earlier custom properties. Tokens come first; parts that reference them come after.

## The two-tier token split

### Tier 1 — palette (`theme_tokens.css`)

Brand colors, raw values:

```css
@layer j13b-theme {
  :root {
    --my-dark-bg-base: #2c2f3a;
    --my-dark-bg-elevated: #353947;
    --my-dark-text: #dde0e8;
    --my-dark-accent: #6c8fff;
    /* ... */
  }
}
```

### Tier 2 — system aliases (`system_tokens.css`)

Maps the palette onto the surface vocabulary that components consume:

```css
@layer j13b-theme {
  :root {
    --material: var(--my-dark-bg-base);
    --on-material: var(--my-dark-text);
    --action: var(--my-dark-accent);
    --on-action: #ffffff;
    /* status, action-severity, etc. */
  }
}
```

Components only ever reference Tier 2 (and the per-state direction knobs). Swapping themes means rewriting Tier 2 against a new Tier 1.

## What a theme writes vs. what it doesn't

**Writes:**
- All palette + system tokens.
- All `box-shadow`, `border`, `border-radius`, `transition` values.
- All component-specific decorations (Button hover lift, MenuItem edge stripe, Modal drop shadow, ...).
- Surface vocabulary redeclarations on `Header`, `Card`, `Modal`, ... (each surface that wants a different `--material`).
- Per-state direction overrides (`--shade`, `--hover-toward`, ...) on surfaces where the default direction is wrong (typically near-black surfaces that need press to lift).
- Whatever internal organizing classes the theme finds useful (in its own namespace).

**Does NOT write:**
- Component layout (flex direction, gaps as topology, padding-as-structure).
- Pseudo-class wiring of `--act-raised` / `--act-down` to `:hover` / `:active` (system layer owns this).
- Box-sizing, position-relative, focus-outline resets.

## Authoring checklist for a new theme

1. Pick a palette. Two or three neutral tones, an accent, status colors.
2. Fill `tokens/theme_tokens.css` (palette).
3. Fill `tokens/system_tokens.css` (aliases onto the surface vocabulary + spacing/typography tokens).
4. Fill `parts/base.css` — root surface paint (`:root, .j13b-theme-root`), font setup, optional `--*-toward` overrides.
5. Fill component parts files for whatever components exist. Each rule is `.j13b-<component>` plus its data attributes.
6. Author `index.ts`, register the subpath export in `package.json`.

## Multiple themes in one app

Because themes are attached per `Document` / `ShadowRoot`, you can run multiple themes simultaneously by hosting the alternate UI in a Shadow DOM with a different `adoptedStyleSheets` set. Useful for tooling UIs (e.g. a theme inspector) that must look different from the surrounding app.
