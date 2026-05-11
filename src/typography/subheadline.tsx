import {
  createTypographyComponent,
  type TypographyProps,
} from './typography_factory.js';

export type SubheadlineProps = TypographyProps;

export const Subheadline = createTypographyComponent({
  variant: 'subheadline',
  defaultTag: 'h4',
  displayName: 'Subheadline',
});
