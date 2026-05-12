import type { Meta, StoryObj } from '@storybook/react';
import { VStack } from '../../stacks/v_stack.js';
import {
  Title,
  Headline,
  Subheadline,
  BodyText,
  Callout,
  Footnote,
  Caption,
} from '../index.js';

const meta: Meta = {
  title: 'Typography',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const TypeScale: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Full type scale at default size. Each variant emits .j13b-typography + .j13b-{variant}; theme owns size, weight, line-height, color tints.',
      },
    },
  },
  render: () => (
    <VStack gap="20px" maxWidth="640px">
      <Title size="lg">Title — large</Title>
      <Title>Title — medium</Title>
      <Title size="sm">Title — small</Title>
      <Subheadline>Subheadline sits below a Title as secondary heading</Subheadline>
      <Headline>Headline — emphasized content for row labels and callouts</Headline>
      <BodyText>
        Body text is paragraph copy. Renders a {'<p>'} with .j13b-body-text. Color
        inherits the surface via --on-material.
      </BodyText>
      <Callout>
        Callouts are slightly emphasized body text — used for notes, hints, and short
        explanatory passages.
      </Callout>
      <Footnote>
        Footnotes are smaller and muted. Used for references, fine print, and meta
        annotations.
      </Footnote>
      <Caption>CAPTION — small meta labels with slight letter-spacing</Caption>
    </VStack>
  ),
};

export const TitleSizes: Story = {
  render: () => (
    <VStack gap="6px">
      <Title size="sm">Title size sm</Title>
      <Title size="md">Title size md</Title>
      <Title size="lg">Title size lg</Title>
    </VStack>
  ),
};

export const BodyTextSizes: Story = {
  render: () => (
    <VStack gap="4px">
      <BodyText size="sm">Body sm — the quick brown fox jumps over the lazy dog.</BodyText>
      <BodyText size="md">Body md — the quick brown fox jumps over the lazy dog.</BodyText>
      <BodyText size="lg">Body lg — the quick brown fox jumps over the lazy dog.</BodyText>
    </VStack>
  ),
};

export const TagOverride: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The `as` prop overrides the rendered HTML tag. Title defaults to h2; pass as="h1" for a page hero.',
      },
    },
  },
  render: () => (
    <VStack gap="16px">
      <Title as="h1" size="lg">Page hero (rendered h1)</Title>
      <Title>Section heading (rendered h2 default)</Title>
    </VStack>
  ),
};

export const InlineUsage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'inline switches typography to inline display so it sits within text flow.',
      },
    },
  },
  render: () => (
    <VStack gap="16px">
      <BodyText>
        Inline meta: <Caption inline>last updated 3 minutes ago</Caption>
      </BodyText>
      <BodyText>
        Inline footnote: this paragraph references a source
        <Footnote inline> — see Smith 2024</Footnote>.
      </BodyText>
    </VStack>
  ),
};
