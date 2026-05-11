import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '../../themes/theme.js';
import { midnightStyleSheet } from '../../themes/themes/midnight/index.js';
import { VStack } from '../../stacks/v_stack.js';
import { HStack } from '../../stacks/h_stack.js';
import { Select } from '../select/select.js';
import { Option } from '../select/option.js';
import { Input } from '../input/input.js';
import { ControlRow } from '../control_row/control_row.js';
import { BodyText } from '../../typography/body_text.js';
import { Caption } from '../../typography/caption.js';

const meta: Meta = {
  title: 'Inputs/Select',
  decorators: [
    (Story) => (
      <Theme styleSheets={[midnightStyleSheet]} style={{ padding: 32 }}>
        <Story />
      </Theme>
    ),
  ],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const avatar = (bg: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: bg,
  color: 'white',
  fontWeight: 600,
  fontSize: 13,
  flexShrink: 0,
});

export const Basic: Story = {
  render: () => (
    <Select placeholder="Pick a country">
      <Option value="us" label="United States" />
      <Option value="ca" label="Canada" />
      <Option value="uk" label="United Kingdom" />
      <Option value="jp" label="Japan" />
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="pro">
      <Option value="free" label="Free" />
      <Option value="pro" label="Pro" />
      <Option value="team" label="Team" />
      <Option value="enterprise" label="Enterprise" />
    </Select>
  ),
};

export const Sizes: Story = {
  render: () => (
    <VStack gap="12px" maxWidth="320px">
      <Select size="sm" defaultValue="b">
        <Option value="a" label="Small option A" />
        <Option value="b" label="Small option B" />
      </Select>
      <Select size="md" defaultValue="b">
        <Option value="a" label="Medium option A" />
        <Option value="b" label="Medium option B" />
      </Select>
      <Select size="lg" defaultValue="b">
        <Option value="a" label="Large option A" />
        <Option value="b" label="Large option B" />
      </Select>
    </VStack>
  ),
};

export const WithDisabledOption: Story = {
  render: () => (
    <Select placeholder="Pick a status">
      <Option value="active" label="Active" />
      <Option value="paused" label="Paused" />
      <Option value="archived" label="Archived" disabled />
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled defaultValue="x">
      <Option value="x" label="Can't change me" />
    </Select>
  ),
};

export const Searchable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'searchable adds a search input at the top of the dropdown that filters the option list live. Default filter does case-insensitive substring match on label and keywords; pass filterOption to customize.',
      },
    },
  },
  render: () => (
    <Select searchable placeholder="Pick a country">
      <Option value="us" label="United States" keywords={['usa', 'america']} />
      <Option value="ca" label="Canada" />
      <Option value="mx" label="Mexico" />
      <Option value="uk" label="United Kingdom" keywords={['uk', 'britain', 'england']} />
      <Option value="fr" label="France" />
      <Option value="de" label="Germany" />
      <Option value="jp" label="Japan" />
      <Option value="kr" label="South Korea" keywords={['korea']} />
      <Option value="cn" label="China" />
      <Option value="in" label="India" />
      <Option value="br" label="Brazil" />
      <Option value="au" label="Australia" />
    </Select>
  ),
};

export const CustomContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Option children render the row content (custom JSX). `label` remains the canonical string used in the trigger when selected, and as the default search-match string.',
      },
    },
  },
  render: () => (
    <Select searchable placeholder="Pick a teammate" defaultValue="alice">
      <Option value="alice" label="Alice Wong" keywords={['frontend', 'engineer']}>
        <HStack gap="10px" vAlign="center">
          <span style={avatar('#6c8fff')}>A</span>
          <VStack gap="2px">
            <BodyText>Alice Wong</BodyText>
            <Caption>Frontend engineer</Caption>
          </VStack>
        </HStack>
      </Option>
      <Option value="bob" label="Bob Garcia" keywords={['backend', 'engineer']}>
        <HStack gap="10px" vAlign="center">
          <span style={avatar('#3fb950')}>B</span>
          <VStack gap="2px">
            <BodyText>Bob Garcia</BodyText>
            <Caption>Backend engineer</Caption>
          </VStack>
        </HStack>
      </Option>
      <Option value="carla" label="Carla Schmidt" keywords={['design', 'lead']}>
        <HStack gap="10px" vAlign="center">
          <span style={avatar('#d29922')}>C</span>
          <VStack gap="2px">
            <BodyText>Carla Schmidt</BodyText>
            <Caption>Design lead</Caption>
          </VStack>
        </HStack>
      </Option>
    </Select>
  ),
};

export const InsideControlRow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The dropdown is portaled to the platform layer (position:fixed) so it escapes ControlRow\'s overflow:hidden and stays positioned correctly under scroll.',
      },
    },
  },
  render: () => (
    <ControlRow maxWidth="420px">
      <Select placeholder="Country" width="auto">
        <Option value="us" label="United States" />
        <Option value="ca" label="Canada" />
      </Select>
      <Input width="fill" placeholder="Enter your address" />
    </ControlRow>
  ),
};
