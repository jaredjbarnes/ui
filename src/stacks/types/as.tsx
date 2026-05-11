export type WithDetailedHTMLProps<
  Props = any,
  Tag extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
> = JSX.IntrinsicElements[Tag] & Props;

export type AsWithDetailedHTMLProps<
  Props = any,
  Tag extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
> = WithDetailedHTMLProps<Props, Tag> & {
  as?: Tag;
};
