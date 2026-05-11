import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '../../themes/theme.js';
import { midnightStyleSheet } from '../../themes/themes/midnight/index.js';
import { VStack } from '../../stacks/v_stack.js';
import { HStack } from '../../stacks/h_stack.js';
import { Spacer } from '../../stacks/spacer.js';
import { Input } from '../input/input.js';
import { Textarea } from '../textarea/textarea.js';
import { ControlRow } from '../control_row/control_row.js';
import { ControlStack } from '../control_stack/control_stack.js';
import { Button } from '../../actions/button/button/button.js';
import { Divider } from '../../layouts/divider/divider.js';

const meta: Meta = {
  title: 'Inputs/ControlRow & ControlStack',
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

export const SearchWithClear: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Search icon, input fills, clear button. ControlRow paints one well around the whole group; children lose their own chrome. Focus the input — the row glows.',
      },
    },
  },
  render: () => (
    <ControlRow maxWidth="420px">
      <HStack
        vAlign="center"
        paddingInline="10px"
        style={{ color: 'rgba(255, 255, 255, 0.55)' }}
        width="auto"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11 L14 14" strokeLinecap="round" />
        </svg>
      </HStack>
      <Input width="fill" placeholder="Search…" />
      <Button utility hierarchy="tertiary" aria-label="Clear">
        ×
      </Button>
    </ControlRow>
  ),
};

export const WithDivider: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Dividers are composable — drop a `<Divider />` between siblings for a hairline. Inside a ControlRow it auto-orients vertical; in a ControlStack horizontal.',
      },
    },
  },
  render: () => (
    <ControlRow maxWidth="420px">
      <Input width="fill" placeholder="Search…" />
      <Divider />
      <Button utility hierarchy="tertiary" aria-label="Clear">
        ×
      </Button>
    </ControlRow>
  ),
};

export const InputPlusButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Input + primary button — both share one well. The button keeps its accent face because system layer rewires --mat to var(--act) for primary regardless of context.',
      },
    },
  },
  render: () => (
    <ControlRow maxWidth="420px">
      <Input width="fill" placeholder="Type a reply…" />
      <Button hierarchy="primary">Send</Button>
    </ControlRow>
  ),
};

export const ButtonInContext: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Same `<Button>` standalone vs inside a ControlRow. Outside: slab — perimeter, top/bottom hairlines, drop shadow, translateY on press. Inside: stripped slab, embedded in the well, settle-into-well press without translateY. Component code is identical; the theme decides.',
      },
    },
  },
  render: () => (
    <VStack gap="32px" maxWidth="520px">
      <HStack gap="12px">
        <Button hierarchy="tertiary">Tertiary</Button>
        <Button hierarchy="secondary">Secondary</Button>
        <Button hierarchy="primary">Primary</Button>
      </HStack>
      <ControlRow>
        <Button hierarchy="tertiary">Tertiary</Button>
        <Divider />
        <Button hierarchy="secondary">Secondary</Button>
        <Divider />
        <Input width="fill" placeholder="…" />
        <Button hierarchy="primary">Primary</Button>
      </ControlRow>
    </VStack>
  ),
};

export const SlackComposer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'ControlStack — vertical merging. Toolbar above, textarea, toolbar below all share one well. Focus the textarea: the whole stack glows accent.',
      },
    },
  },
  render: () => (
    <ControlStack maxWidth="520px">
      <HStack gap="4px" padding="4px 8px">
        <Button utility hierarchy="tertiary" aria-label="Bold">
          <strong>B</strong>
        </Button>
        <Button utility hierarchy="tertiary" aria-label="Italic">
          <em>I</em>
        </Button>
      </HStack>
      <Divider />
      <Textarea placeholder="Type a message…" rows={4} style={{ resize: 'none' }} />
      <Divider />
      <HStack gap="4px" padding="4px 8px" vAlign="center">
        <Button utility hierarchy="tertiary" aria-label="Attach">
          +
        </Button>
        <Spacer />
        <Button hierarchy="primary" size="sm">
          Send
        </Button>
      </HStack>
    </ControlStack>
  ),
};
