# Surfaces and Layouts

`@j13b/ui` separates structural components into three roles. Knowing which role a component plays tells you where it lives in the source tree and what theme authors target.

## The three roles

**Stacks** (`src/stacks/`) — the topology primitive.
`HStack`, `VStack`, `ZStack`, `Spacer`. Pure flex topology + sizing + alignment. Every other structural component is built on these.

**Layouts** (`src/layouts/`) — named arrangement patterns. Wireframes that organize content *on* a surface.
A layout does **not** paint a material. It does **not** redeclare `--material` / `--on-material` / `--action` / `--on-action`. It only arranges children spatially.
Examples: `Grid`, `List`, `Divider`, `Responsive` / `Breakpoint`, `Group`, `Scaffold`.

**Surfaces** (`src/surfaces/`) — places that paint and redeclare the vocabulary.
A surface **does** paint a `--material`. It **does** redeclare the four-variable vocabulary at its boundary so every interactive child reads from a fresh cascade context.
Examples: `Card`, `Modal`, `Tooltip`, `Popover`, `Drawer`, `Window`, `Header`, `Footer`, `Bar`, `Table` (rows redeclare per-row), `Panel`, `Sidebar`, `Alert`, `Page`, `Aside`, `Section`, and small "token" surfaces like `Chip`, `Badge`, `Bubble`.

## The test

When deciding where a new component lives, ask:

> Does this component want a `--material` of its own?

- **Yes** → surface. Lives in `src/surfaces/`. Its theme part redeclares the vocabulary.
- **No** → layout. Lives in `src/layouts/`. It only arranges children.

A clarifying second question:

> If I drop a `<Button>` inside this, should the button look the same as on the page, or different because it's *here*?

- **Different (or potentially different)** → surface. The button needs a redeclared `--material` to consume.
- **Same** → layout. The layout is transparent to its children's color story.

### Strong default, not a tripwire

The rule above is a **strong default**, not a rigid contract. A layout that exposes a CSS-variable knob (for example, a `Grid` accepting a `--row-stripe` prop the theme can paint) is still a layout — it parameterizes color without owning the surface vocabulary. The line that matters is:

> Only surfaces redeclare `--material` / `--on-material` / `--action` / `--on-action`.

A layout may expose other tunable variables; a surface is the only place those four canonical ones get rewritten. If you find a layout reaching for `--material` of its own, the question to ask is "should this actually be a surface?" — usually the answer is yes.

## Why the split matters

Theme authors care about **which selectors paint**. A theme part file for `actions.css` declares how Button looks on a generic surface. A theme part file for `surfaces.css` declares per-surface variations: the Header redeclares to a slightly elevated material, the Tooltip redeclares to an inverted material, the alternating Table row redeclares to a tint.

If layouts were allowed to paint, theme authors would have to chase color decisions across two separate categories. The contract is: **paint only happens at surface boundaries.** Layouts compose freely without contributing color.

## Examples that surprise

Some components live in `surfaces/` even though they don't *look* like "places" at first:

- **`Header` / `Footer` / `Bar` / `UtilityBar`** — they paint a material (often distinct from the body) and host interactive children that should pick up the bar's vocabulary.
- **`Table`** — `TR` redeclares `--material` based on stripe / `:hover` / `[data-is-selected="true"]`. A `Button` inside a selected row recolors automatically because the row is acting as a surface for its cells.
- **`Sidebar`** — paints a persistent panel material; nav items consume the sidebar's `--action`.
- **`Section`** — depth-keyed material rotation (`.j13b-section > .j13b-section` shifts the palette accent).

Some things stay in `layouts/` even though they wrap content:

- **`Scaffold`** — orchestrates Header / body / Footer placement but doesn't paint. The Header *inside* paints; the Scaffold doesn't.
- **`Group`** — semantic grouping, no material.
- **`List`** — the list itself is structural; list *items* may consume or may be `j13b-interactive`.

## Two tiers of per-context control

The surface model gives theme authors two ways to vary a component's look based on where it sits.

### Tier 1 — free, via cascade

Every surface redeclares the vocabulary at its boundary. Interactive children recompute their state colors via `color-mix` against the local `--material`. **No per-context CSS is required** for typical recoloring.

```css
/* In the theme — Modal redeclares: */
.j13b-modal :where(.j13b-modal-header) {
  --material: var(--theme-overlay);
  --on-material: var(--theme-on-overlay);
  --action: var(--theme-accent-on-overlay);
}
```

A `Button` inside the modal header just reads `var(--material)` and recolors. No `.j13b-modal-header .j13b-button { ... }` rule is needed.

### Tier 2 — explicit, via selector

When the design system needs a *structurally* different treatment — say, "buttons inside Modal headers don't lift on hover; they show an edge underline instead" — that's a theme-side CSS rule using the library's stable selectors:

```css
.j13b-modal-header .j13b-button:hover {
  transform: none;
  border-bottom: 2px solid var(--act);
}
```

The library **guarantees** that `.j13b-modal-header` and `.j13b-button` (and their data attributes) are stable. The library **never** ships these rules itself. Themes opt into per-context overrides only when their design system asks for it.

The two tiers compose: the surface still redeclares `--material`; the button still consumes it for the background. The theme has only overridden one specific visual behavior in one specific context.

### Composition decides emphasis

Same component, different visual depending on what it sits inside. `Sidebar` inside a `Page` is the app-shell rail; the same `Sidebar` inside a `Card` is the card's internal navigation pane. Same component, two metaphors — the *theme* decides per composition, not the component. See [`composition-emphasis.md`](./composition-emphasis.md) for the full principle and a worked example across Page / Panel / Card.

### Sizing intent is per-component

Each surface declares a sizing intent in its CSS module — *fill*, *content*, or *always-fill*. All three patterns share the same `data-*="default"` opt-out hook, so consumers always have one mechanism for overriding: pass an explicit size. See [`sizing-defaults.md`](./sizing-defaults.md).

### Cascade corner cases live in the theme, not in the component

When a cascade combination produces an undesired visual result — a child component disappears against a redeclared material, a hover tint goes invisible against a tinted parent, anything where "this looks wrong only when X is inside Y" — the fix is a **per-context theme selector**. It is **not**:

- a change to the component's own CSS,
- a rewiring of root system tokens,
- an extra redeclaration of vocabulary variables on the parent surface (unless those additional redeclarations are independently meaningful).

The component's resolution chain is the contract. The root tokens are the chain's anchor. Theme reconciliation is what happens when a *specific combination* doesn't read well, and it should target *only that combination*.

**Worked example** — the canonical case the library exposes. A `<TR data-is-selected="true">` redeclares `--material` to the accent color. Inside that row, a `Button[hierarchy="tertiary"]` draws its text in `var(--act)` (via the standard Button chain). On a normal row, `--act` resolves to the accent — accent text on the elevated surface. On a selected row, `--act` still resolves to the accent, but now the surface IS the accent: text disappears against its background.

Three possible fixes:

| Approach | Where the change lands | Why it's the wrong shape |
|---|---|---|
| Rewire `--action-severity-neutral` to `var(--action)` at `:root` | System tokens | Couples a root token to a corner case. Changes the chain globally to fix one combination. |
| Redeclare all four vocabulary variables on the selected row | Theme, on the surface | Forces unrelated decisions (what should `--action` and `--on-action` be on a selected row?) just to disambiguate one descendant. |
| **Per-context selector** | Theme | Targets only the actual offending combination. Other descendants of the row are unaffected. |

The right fix:

```css
.j13b-tbody .j13b-tr[data-is-selected="true"] .j13b-button[data-hierarchy="tertiary"] {
  --ink: var(--on-material);
}
```

One rule, one combination, no upstream churn. Inputs and chips inside the same selected row still inherit the row's `--on-material` for their text because none of their other defaults broke. The Button's resolution chain is intact for every other context. The root tokens haven't moved.

**Rule of thumb.** Before changing anything upstream of the corner case, write the contextual selector first. If it works, that's the fix. Look upstream only when the same combination of selectors keeps coming up across many cases — that's a signal a token should follow the vocabulary rather than the palette, and is a separate (deliberate) decision.

## Class-name conventions

Surfaces always emit `.j13b-<name>` on their outer element, plus stable sub-region classes for inner parts that themes might target:

```
.j13b-modal
.j13b-modal-header
.j13b-modal-body
.j13b-modal-footer

.j13b-table
.j13b-thead
.j13b-tbody
.j13b-tr
.j13b-th
.j13b-td

.j13b-sidebar
.j13b-sidebar-item

.j13b-card
.j13b-card-header
.j13b-card-body
.j13b-card-footer
```

Layouts emit `.j13b-<name>` too, but typically without sub-regions — their job is to arrange the children you pass in.
