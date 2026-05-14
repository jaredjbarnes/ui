# Structural vocabulary

A small set of CSS variables that surfaces declare and layout primitives consume — same mechanism as the [surface vocabulary](./surface-vocabulary.md), but for **layout** instead of **visuals**.

The surface vocabulary makes a `<Button>` recolor automatically when it's dropped inside a `<Modal>`. The structural vocabulary makes a `<VBody>` size itself correctly whether it's inside a `<Card>` (content-determined) or a `<Panel>` (fills the slot). In both cases, the inner component reads from CSS context — it never asks "where am I?"

## The mechanism

Identical to the visual vocabulary:

1. A surface sets a variable on its own element.
2. The variable cascades to descendants.
3. A nested surface redeclares the variable, breaking the cascade for its subtree.
4. Inner layout primitives read whatever value is closest in the cascade.

```css
/* Panel — fills its container; its body should fill the remaining slot. */
:where(.panel) {
  --body-fill: 1;
  --body-basis: 0;
  /* … */
}

/* Card — content-sized; its body should size to its content, not flex-grow. */
:where(.card) {
  --body-fill: 0;
  --body-basis: auto;
  /* … */
}

/* Body — consumes the contract. */
:where(.v-body),
:where(.h-body) {
  flex-grow: var(--body-fill, 0);
  flex-shrink: 1;
  flex-basis: var(--body-basis, auto);
  /* … */
}
```

## The vocabulary today

| Variable | Purpose | Values |
|---|---|---|
| `--body-fill` | Body's `flex-grow` inside this surface | `1` (fill) or `0` (content-sized) |
| `--body-basis` | Body's `flex-basis` inside this surface | `0` (no content opinion; pure flex distribution) or `auto` (basis = content size) |

Together they describe how a `<VBody>` or `<HBody>` should size when dropped inside this surface. The pair maps directly to the sizing patterns in [`sizing-defaults.md`](./sizing-defaults.md):

| Surface | Sizing pattern | `--body-fill` | `--body-basis` |
|---|---|---|---|
| `Page`, `Panel`, `Section`, `TTable` | Pattern 1 — Fill | `1` | `0` |
| `Card`, `Aside`, floating surfaces | Pattern 2 — Content | `0` | `auto` |

If you author a new fill-pattern surface, declare `1; 0`. New content-pattern surface? Declare `0; auto`. Body picks it up.

## Why a surface must explicitly declare even for the default

A Card nested inside a Panel inherits Panel's `--body-fill: 1` via the cascade. If Card doesn't redeclare, a `<VBody>` inside that Card would read Panel's value and try to fill — collapsing because Card itself is auto-sized.

So **every surface declares its values**, even ones that match the fallback. The declarations are also the cascade boundaries that make nested compositions work:

```jsx
<Panel>                            {/* sets --body-fill: 1, --body-basis: 0   */}
  <HBody>                          {/* inherits (1, 0) — fills                */}
    <VBody>...</VBody>             {/* inherits (1, 0) — fills                */}
    <Card>                         {/* resets --body-fill: 0, --body-basis: auto */}
      <VBody>...</VBody>           {/* inherits (0, auto) — content-sized     */}
    </Card>
  </HBody>
</Panel>
```

Each `<VBody>` ends up with the right behavior without anyone passing a sizing prop. The composition tells the cascade what to do.

## Why the system layer, not the theme

The surface vocabulary lives in the theme because *visual* differences between Modal-as-overlay vs. Modal-as-floating-card are theme concerns. The structural vocabulary lives in the **system layer** because *layout* differences between Panel-as-region vs. Card-as-widget are structural concerns — they would be wrong in every theme.

A theme is free to add additional structural variables of its own for chrome-related sizing (e.g., default padding). But the cross-component layout contract — the variables that decide whether a Body fills or doesn't — is baked into each component's CSS module.

This is the line drawn in [`composition-emphasis.md`](./composition-emphasis.md): theme owns visual variation per context; the system owns structural variation per context. Both use the same cascade-based mechanism.

## Edge cases

**Consumer passes explicit dimensions to a content-sized surface** (`<Card height="400px">`). Card's declaration stays `--body-fill: 0; --body-basis: auto;`. The Body inside is still content-sized by default. If the consumer wants Body to fill the now-determinate Card, they pass `<VBody height="fill">` — the [data-* opt-out](./sizing-defaults.md) is the explicit escape hatch.

**Body not inside any surface** (a bare `<VBody>` at the root of a Storybook story). The fallback values from `var(--body-fill, 0)` and `var(--body-basis, auto)` give content-sized behavior — the conservative default that won't collapse content.

**Body inside multiple nested fill surfaces.** Each surface redeclares the same values (`1; 0`), so descendants of Page > Panel > Section all see `1; 0`. The redeclarations are cheap; no special handling needed.

## Relationship to the surface vocabulary

Same mechanism, different domain:

| | Surface vocabulary | Structural vocabulary |
|---|---|---|
| Layer | Theme (`j13b-theme`) | System (`j13b-system`) |
| Declared by | Surfaces (per theme) | Surfaces (per component module) |
| Variables | `--material`, `--on-material`, `--action`, `--on-action` | `--body-fill`, `--body-basis` |
| Consumed by | Every paintable component | Layout primitives (today: Body) |
| Output | Colors, chrome | Flex behavior |
| Documented in | [`surface-vocabulary.md`](./surface-vocabulary.md) | this file |

Together they form the library's "smart based on context" contract. A surface declares what it is — visually and structurally — and the components inside adapt without needing to know which surface they're inside. Same five-variable contract from the consumer's perspective; same cascade resolution from the browser's.

## Where this could extend

The structural vocabulary is small on purpose. If a future layout primitive (say, `Grid` or `List`) needs to be context-aware in a structural way, we can add a variable — but only when the use case justifies it. The principle is the same: surface declares; primitive consumes. Don't invent variables ahead of need.
