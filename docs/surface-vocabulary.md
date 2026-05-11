# Surface Vocabulary

Every surface — `Page`, `Panel`, `Card`, `Modal`, `Drawer`, `Window`, `Aside`, `Tooltip`, `PopConfirm`, table rows, even nested `Section`s — declares the same four variables:

```css
--material       /* the surface's background */
--on-material    /* legible foreground on it */
--action         /* the accent appropriate here */
--on-action      /* legible foreground when something IS the accent */
```

That's the entire "what kind of place is this" contract.

## Redeclaration at every boundary

The pattern works because surfaces *redeclare* the vocabulary for themselves. A modal header doesn't query "am I in a modal?" — the modal header rule says:

```css
.j13b-modal :where(.j13b-header) {
  --material: var(--theme-overlay);
  --on-material: var(--theme-on-overlay);
  --action: var(--theme-accent-on-overlay);
  --on-action: var(--theme-on-accent-on-overlay);

  background-color: var(--material);
  color: var(--on-material);
}
```

Now every interactive child of that header — buttons, icons, text — automatically inherits from the header's CSS scope. The Button inside reads `var(--material)` and gets the header's overlay color. The Button never knew it was inside a modal.

## Composition via cascade

Three places this really shines:

### Sections rotate palette by depth

Each nested section level can swap its `--material` and `--action` to a different palette accent, giving automatic visual hierarchy without per-component logic.

### Tables redefine surface per row

`tbody tr:nth-of-type(even)` sets one `--material`, odd rows another, `:hover` mixes accent in, `[data-is-selected="true"]` flips both `--material` and `--on-material`. A button or chip dropped into a selected row instantly recolors because it consumes the row's material.

### Headers, tooltips, dialogs each set their own vocabulary

The same `Header` component looks completely different inside a Card vs a Modal vs a PopConfirm — because each parent surface redeclares the vocabulary the header consumes.

## Component-side contract

Components MUST consume `--material` and `--on-material` rather than referencing palette tokens directly. A Button in `actions.css` writes:

```css
.j13b-button {
  background-color: var(--material);
  color: var(--on-material);
}
```

Not:
```css
.j13b-button {
  background-color: white;        /* ← wrong, breaks dark themes */
  color: var(--theme-text);       /* ← wrong, breaks surface composition */
}
```

The only exception is the *root surface* of a theme, which establishes initial values for the whole tree.

## Per-instance overrides

Components also expose per-instance escape hatches via `--j13b-button-color` / `--j13b-button-text-color`-style variables, applied through `style={{}}` props. These resolve through the same vocabulary so they compose with surface context: an instance override for color still picks up the surrounding `--material` for hover/active mixing.

## Why this is the right primitive

The four variables are the **smallest** vocabulary that fully captures "where am I and what color do I act with." Adding a fifth (e.g., `--secondary-action`) hurts more than it helps — components would need to know which action to consume, and the cascade composability falls apart. If a surface needs more variation, it's a *different surface* with its own redeclaration block.
