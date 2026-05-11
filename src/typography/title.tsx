import {
  createTypographyComponent,
  type TypographyProps,
} from './typography_factory.js';

export type TitleProps = TypographyProps;

export const Title = createTypographyComponent({
  variant: 'title',
  defaultTag: 'h2',
  displayName: 'Title',
});
