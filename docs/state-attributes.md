# State Attributes

Components communicate state through **data attributes** so themes can react without parsing React state or component props. The library promises a stable set of attribute names; themes target them with regular CSS selectors.

## Why data attributes (and not classes)

Two reasons:

1. **State is a value, not a tag.** A button that's selected isn't structurally different from one that isn't — it just has a different `data-is-selected` value. Toggling a class to communicate "selected" mixes presentation (which class are you wearing?) with state (which value do you have?). Data attributes keep the two clean.
2. **Themes can match on values, not absence.** `[data-is-selected="true"]` and `[data-is-selected="false"]` are both valid selectors. A theme can give the unselected case its own treatment without relying on `:not(.is-selected)` gymnastics.

Class names, by contrast, mark **identity** ("I am a button," "I am a tab item") — what something *is*, not what state it's in.

## The two kinds of data attributes

### `data-is-*` — boolean state

For any binary state. Always emitted with `"true"` or `"false"` (never omitted), so themes can target either case explicitly.

| Attribute | Meaning | Component examples |
|---|---|---|
| `data-is-disabled` | User cannot interact | Button, Input, Toggle, Tab, Item |
| `data-is-selected` | One of N is currently chosen | Toggle, Tab, Row, Suggestion, Item |
| `data-is-checked` | Boolean toggle is on | Checkbox, Radio, Switch |
| `data-is-open` | Drawer/menu/modal is visible | Modal, Drawer, Menu, Dropdown |
| `data-is-loading` | Async state is pending | Button, Form |
| `data-is-utility` | Compact icon-only mode | Button (`utility` prop) |
| `data-is-today` | Calendar date | DatePicker date cell |
| `data-is-within-range` | Calendar date | DatePicker date cell |
| `data-is-within-month` | Calendar date | DatePicker date cell |
| `data-is-collapsed` | Section/accordion folded | Section, Accordion |
| `data-is-sticky` | Sticky variant active | Header, Section |

### `data-*` — enum state

For multi-value categorical state.

| Attribute | Values | Component examples |
|---|---|---|
| `data-size` | `sm` / `md` / `lg` | Button, Input, Icon, Toggle |
| `data-hierarchy` | `primary` / `secondary` / `tertiary` | Button, Sidebar, Section |
| `data-severity` | `dangerous` / `cautious` / `neutral` / `suggested` / `encouraged` | Button (severity prop) |
| `data-variant` | component-specific | Tabs (`default` / `inline`), Header (`window` / `toolbar` / `app` / `nav` / `panel`) |
| `data-kind` | component-specific | Header (`window` / `card` / `panel` / ...) |
| `data-orientation` | `horizontal` / `vertical` | Slider, Tabs, Divider, Bar |
| `data-anchor-direction` | `top` / `bottom` / `start` / `end` | Tooltip, Popover |
| `data-direction` | `top` / `bottom` / `start` / `end` | Caret, ResizeHandle |

## Pseudo-classes vs. data attributes

| Concern | Mechanism |
|---|---|
| `:hover` / `:focus-visible` / `:active` | Pseudo-classes (browser-driven) |
| `:disabled` (on form controls) | Pseudo-class on `<button>` / `<input>` etc. — the library emits both `:disabled` and `data-is-disabled` so themes can target either. |
| Anything else | Data attributes |

The library mirrors the three core pseudo-classes with `[data-hover]`, `[data-focus-visible]`, `[data-active]` so docs/Storybook can pin states without real input. The `.j13b-interactive` primitive matches both. See [`interactive-states.md`](./interactive-states.md).

## Conventions

- **Always emit both values.** A Toggle always has `data-is-selected="true"` or `data-is-selected="false"`, never absent. This lets themes match on either explicitly.
- **Boolean-ish attrs use `data-is-*`.** Reads naturally: "is the button disabled?" → `data-is-disabled`.
- **Multi-value attrs drop the `-is-`.** "What size is the button?" → `data-size`, not `data-is-size`.
- **Don't invent attribute names lightly.** Each new attribute is a public API surface that themes must learn. Reuse before invent.
- **Don't overload.** A single attribute should mean one thing. If a `data-status` would carry both severity and async state, split into `data-severity` and `data-is-loading`.

## How themes use them

```css
@layer j13b-theme {
  /* simple boolean */
  .j13b-button[data-is-disabled="true"] {
    opacity: 0.45;
  }

  /* enum */
  .j13b-button[data-hierarchy="primary"][data-severity="dangerous"] {
    /* primary danger button */
  }

  /* combined with pseudo-class */
  .j13b-tab-item[data-is-selected="false"]:hover {
    /* unselected tab on hover — pseudo and data compose freely */
  }

  /* mirroring pseudo for forced state in stories */
  .j13b-button:hover,
  .j13b-button[data-hover] {
    transform: translateY(-1px);
  }
}
```

The data attributes are the public API of state. A theme that targets only attributes the library promises, never reads React internals, never patches component code, can survive any library version that keeps the contract.
