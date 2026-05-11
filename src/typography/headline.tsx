import {
  createTypographyComponent,
  type TypographyProps,
} from './typography_factory.js';

export type HeadlineProps = TypographyProps;

export const Headline = createTypographyComponent({
  variant: 'headline',
  defaultTag: 'h3',
  displayName: 'Headline',
});
