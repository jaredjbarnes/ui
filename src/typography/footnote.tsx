import {
  createTypographyComponent,
  type TypographyProps,
} from './typography_factory.js';

export type FootnoteProps = TypographyProps;

export const Footnote = createTypographyComponent({
  variant: 'footnote',
  defaultTag: 'small',
  displayName: 'Footnote',
});
