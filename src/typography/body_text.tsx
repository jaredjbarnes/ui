import {
  createTypographyComponent,
  type TypographyProps,
} from './typography_factory.js';

export type BodyTextProps = TypographyProps;

export const BodyText = createTypographyComponent({
  variant: 'body-text',
  defaultTag: 'p',
  displayName: 'BodyText',
});
