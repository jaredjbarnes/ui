import {
  createTypographyComponent,
  type TypographyProps,
} from './typography_factory.js';

export type CalloutProps = TypographyProps;

export const Callout = createTypographyComponent({
  variant: 'callout',
  defaultTag: 'p',
  displayName: 'Callout',
});
