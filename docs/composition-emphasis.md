# Composition decides emphasis

The same surface component should be allowed to look meaningfully different depending on what it sits inside — or beside, or how deeply it nests within itself. The component's *purpose* is fixed; the theme decides the *visual emphasis* per composition.

This is the strength of the library that makes a few components stretch a long way. `Sidebar` inside a `Page` is the app-shell rail. The same `Sidebar` inside a `Card` is the card's internal navigation pane. Same component, two metaphors — none of which the component itself knows about.

## The principle

> **Component purpose is fixed. Theme emphasis is per-composition.**

When you write a theme rule for a surface, don't stop at `.j13b-<name> { ... }`. Ask:

- What does this surface look like inside a `Page`?
- What does it look like inside a `Panel`?
- What does it look like inside a `Card`?
- What does it look like inside another instance of itself?
- What does it look like at the start vs. end of an `HBody`?

Each meaningfully different answer is its own rule.

## The mechanism

Two ingredients, both already first-class in the library:

1. **Stable selectors.** Every component emits `.j13b-<name>` plus data attributes (`data-hierarchy`, `data-severity`, `data-is-selected`, structural pseudos like `:first-child`). See [`principles.md`](./principles.md#what-the-library-is) for what's guaranteed.
2. **The four-variable vocabulary.** Every surface redeclares `--material` / `--on-material` / `--action` / `--on-action` at its boundary. See [`surface-vocabulary.md`](./surface-vocabulary.md).

Compose them in the theme:

```css
/* Generic Sidebar rule — just the vocabulary, no chrome. */
.j13b-sidebar {
  --material: var(--neo-bg-mid);
  --on-material: var(--neo-text);
  --action: var(--neo-accent);
  --on-action: var(--neo-text-on-accent);
  background-color: var(--material);
  color: var(--on-material);
}

/* Per-context chrome — composition decides emphasis. */
.j13b-page .j13b-sidebar,
.j13b-panel .j13b-sidebar { /* sunken slot in the canvas */ }

.j13b-card .j13b-sidebar { /* engraved into the widget's sheet */ }
```

No prop. No subclass. No component knowledge. The component ships a stable hook; the theme decides how it reads in each place.

### Recursive emphasis via the cascade

Material darkening across nesting composes for free:

```css
.j13b-sidebar .j13b-sidebar {
  --material: color-mix(in srgb, var(--material), black 3%);
}
```

`var(--material)` on the right-hand side resolves to the parent rail's already-darkened value, so the third nested level reads the second's value and darkens further. No `.sidebar .sidebar .sidebar` rules needed — the cascade does the recursion.

## Worked example: Sidebar across compositions

In the neumorphism theme, `Sidebar` reads three different ways depending on what it sits inside. Same component, same JSX, same `j13b-sidebar` / `j13b-sidebar-start` / `j13b-sidebar-end` hooks.

### `Page > HBody > Sidebar` — sunken slot in the canvas

The app-shell rail. The page is the lit gradient canvas; the sidebar is a slot sunk into the side of it. Material steps slightly darker so the rail reads as a recessed sheet, and the inline edge facing the main content gets a directional inset shadow on the seam.

```css
.j13b-page .j13b-sidebar {
  --material: color-mix(in srgb, var(--neo-bg-mid), black 3%);
  background-color: var(--material);
}
.j13b-sidebar-start { box-shadow: inset -8px 0 14px -8px var(--neo-shadow); }
.j13b-sidebar-end   { box-shadow: inset  8px 0 14px -8px var(--neo-shadow); }
```

### `Panel > HBody > Sidebar` — same as Page

Panel's role is "structural region of the parent" — a canvas of its territory. A sidebar inside a Panel is still a sidebar inside a canvas; the visual is identical to the Page case. One rule, two compositions.

```css
.j13b-page .j13b-sidebar,
.j13b-panel .j13b-sidebar { /* …same as above */ }
```

### `Card > HBody > Sidebar` — engraved into the card

Card is a self-contained widget (raised paper sheet). A sidebar inside it is the widget's internal navigation — file tree of a code-editor card, steps pane of a wizard card. The slot reads as carved INTO the card's sheet, not as a slot in the page canvas. The full boundary is the well; the directional edge shadow doesn't apply.

```css
.j13b-card .j13b-sidebar,
.j13b-card .j13b-sidebar-start,
.j13b-card .j13b-sidebar-end {
  box-shadow: var(--neo-shadow-engraved);
}
```

Specificity ordering takes care of the conflict: `.j13b-card .j13b-sidebar-start` (0,2,0) beats `.j13b-sidebar-start` (0,1,0), so the Card override wins in Card context and the directional rule wins everywhere else.

## Panel vs Card — sizing tells you the metaphor

The Panel-vs-Card distinction is the canonical example of *role* driving *visual*. The role split is encoded in their component-level defaults:

| | sizing default | role | chrome |
|---|---|---|---|
| `Card` | content-sized | a self-contained widget that sits ON the surface | raised paper sheet |
| `Panel` | fills (splits space with siblings) | a region OF the surface that splits space with siblings | faint engraved boundary |
| `Page` | fills viewport | the canvas itself | gradient on `:root`, no own chrome |

Two stacked Panels in a VStack split the available space automatically. See [`sizing-defaults.md`](./sizing-defaults.md) for the three sizing-intent patterns (fill, content, always-fill) and the shared `data-*="default"` opt-out mechanism every surface uses.

Because Panel is "canvas-of-region," anything that paints differently against the Page canvas (Sidebar, Aside, Table) gets the same treatment when inside a Panel. The theme doesn't write two rules — one selector covers both.

## When the same composition rule applies to multiple components

If you find yourself writing the same per-context rule for `Sidebar` and `Aside` and `Panel` and on and on, that's a signal those components share a meta-role the theme can name. Author your own theme-level class (`.neo-canvas-child`, `.neo-widget-internal`, whatever) and attach it via a selector group:

```css
/* Theme-authored meta-class, NOT a library hook. */
.j13b-page > *,
.j13b-panel > * {
  /* shared "canvas child" treatment */
}
```

Theme-authored classes are fine. The library never ships them; themes can invent whatever organizational structure they want.

## Related principles

- [`surface-vocabulary.md`](./surface-vocabulary.md) — the four variables every surface redeclares.
- [`surfaces-and-layouts.md`](./surfaces-and-layouts.md) — surfaces redeclare and paint; layouts only arrange. Also covers the "cascade corner cases live in the theme" rule, which composes with composition-emphasis: corner-case fixes go in the theme; emphasis-by-composition also goes in the theme.
- [`principles.md`](./principles.md) — the library is structure + selectors + vocabulary; everything visual is theme.
