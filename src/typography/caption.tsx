import {
  createTypographyComponent,
  type TypographyProps,
} from './typography_factory.js';

export type CaptionProps = TypographyProps;

export const Caption = createTypographyComponent({
  variant: 'caption',
  defaultTag: 'span',
  displayName: 'Caption',
});
