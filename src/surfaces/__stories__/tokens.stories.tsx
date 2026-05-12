import type { Meta, StoryObj } from '@storybook/react';
import { HStack } from '../../stacks/h_stack.js';
import { VStack } from '../../stacks/v_stack.js';
import { BodyText } from '../../typography/body_text.js';
import { Title } from '../../typography/title.js';
import { Card } from '../card/card.js';
import { Chip } from '../tokens/chip.js';
import { Bubble } from '../tokens/bubble.js';
import { Badge } from '../tokens/badge.js';
import { Key } from '../tokens/key.js';
import { Value } from '../tokens/value.js';
import { Term } from '../tokens/term.js';

const meta: Meta = {
  title: 'Surfaces/Tokens',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const ChipSeverities: Story = {
  render: () => (
    <HStack gap="8px" vAlign="center">
      <Chip severity="neutral">neutral</Chip>
      <Chip severity="suggested">suggested</Chip>
      <Chip severity="encouraged">encouraged</Chip>
      <Chip severity="cautious">cautious</Chip>
      <Chip severity="dangerous">dangerous</Chip>
    </HStack>
  ),
};

export const ChipSizes: Story = {
  render: () => (
    <HStack gap="8px" vAlign="center">
      <Chip size="sm">sm</Chip>
      <Chip size="md">md</Chip>
      <Chip size="lg">lg</Chip>
    </HStack>
  ),
};

export const BubbleSeverities: Story = {
  render: () => (
    <HStack gap="8px" vAlign="center">
      <Bubble severity="neutral">1</Bubble>
      <Bubble severity="suggested">2</Bubble>
      <Bubble severity="encouraged">3</Bubble>
      <Bubble severity="cautious">4</Bubble>
      <Bubble severity="dangerous">5</Bubble>
    </HStack>
  ),
};

export const BadgeOnIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Badge overlays a Bubble on the top-end corner of its children. Common usage: unread counts on a button or icon.',
      },
    },
  },
  render: () => (
    <HStack gap="24px" vAlign="center">
      <Badge value="3" severity="dangerous">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 6,
            background: 'color-mix(in srgb, var(--material), white 8%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          📬
        </div>
      </Badge>
      <Badge value="!" severity="cautious">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 6,
            background: 'color-mix(in srgb, var(--material), white 8%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          🔔
        </div>
      </Badge>
      <Badge value="new" severity="encouraged">
        <div
          style={{
            width: 80,
            height: 32,
            borderRadius: 6,
            background: 'color-mix(in srgb, var(--material), white 8%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 8px',
          }}
        >
          Feature
        </div>
      </Badge>
    </HStack>
  ),
};

export const KeyValueTerms: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Key + Value inside a Term build a definition-list row. Severity on Value tints the value tone — useful for status displays.',
      },
    },
  },
  render: () => (
    <Card padding="16px" maxWidth="420px">
      <VStack width="default" gap="0px">
        <Term>
          <Key>Username</Key>
          <Value>jane-smith</Value>
        </Term>
        <Term>
          <Key>Email</Key>
          <Value severity="encouraged">jane@example.com</Value>
        </Term>
        <Term>
          <Key>Two-factor</Key>
          <Value severity="encouraged">Enabled</Value>
        </Term>
        <Term>
          <Key>Sessions</Key>
          <Value severity="cautious">2 active</Value>
        </Term>
        <Term>
          <Key>Access token</Key>
          <Value severity="dangerous">Expired</Value>
        </Term>
      </VStack>
    </Card>
  ),
};

export const ChipsInsideAlert: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Chips inside an Alert (or any other surface) recolor against the surrounding surface\'s --action. Drop the same Chip into different surfaces; it reads differently in each because of the cascade.',
      },
    },
  },
  render: () => (
    <VStack gap="16px" maxWidth="520px">
      <Title size="sm">Chips inherit their context</Title>
      <Card padding="12px" width="default">
        <HStack gap="8px" vAlign="center">
          <BodyText>On Card:</BodyText>
          <Chip>v1.0.0</Chip>
          <Chip severity="cautious">beta</Chip>
        </HStack>
      </Card>
    </VStack>
  ),
};
