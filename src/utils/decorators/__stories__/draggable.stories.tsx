import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '../../../themes/theme.js';
import { midnightStyleSheet } from '../../../themes/themes/midnight/index.js';
import { VStack } from '../../../stacks/v_stack.js';
import { HStack } from '../../../stacks/h_stack.js';
import { BodyText } from '../../../typography/body_text.js';
import { Draggable } from '../draggable/draggable.js';
import { DragHandle } from '../draggable/drag_handle.js';

const meta: Meta = {
  title: 'Utils/Decorators/Draggable',
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

const cardStyle: React.CSSProperties = {
  width: 240,
  padding: 12,
  background: 'var(--material)',
  color: 'var(--on-material)',
  border: '1px solid color-mix(in srgb, var(--material), black 30%)',
  borderRadius: 6,
  boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
  userSelect: 'none',
};

const grabStyle: React.CSSProperties = {
  padding: '6px 8px',
  background: 'color-mix(in srgb, var(--material), white 6%)',
  borderRadius: 4,
  cursor: 'grab',
  marginBottom: 8,
};

export const WholeCardIsHandle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Wrap the whole element as the handle. The drag offset is published as `--position-x` / `--position-y` CSS variables, applied as `top`/`left` by the system layer.',
      },
    },
  },
  render: () => (
    <Draggable>
      <DragHandle>
        <div style={{ ...cardStyle, cursor: 'grab' }}>
          <BodyText>Drag me anywhere.</BodyText>
        </div>
      </DragHandle>
    </Draggable>
  ),
};

export const HandleStripOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Restrict drag to a header strip. The rest of the card stays interactive.',
      },
    },
  },
  render: () => (
    <Draggable>
      <div style={cardStyle}>
        <DragHandle>
          <div style={grabStyle}>⋮⋮  Drag here</div>
        </DragHandle>
        <BodyText>Body text is selectable and clickable.</BodyText>
      </div>
    </Draggable>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`draggable={false}` suppresses position updates and disables the system-layer top/left binding. The handle still emits `data-is-draggable="false"` so a theme can grey it out.',
      },
    },
  },
  render: () => (
    <Draggable draggable={false}>
      <DragHandle>
        <div style={{ ...cardStyle, cursor: 'not-allowed' }}>
          <BodyText>Drag is off.</BodyText>
        </div>
      </DragHandle>
    </Draggable>
  ),
};

export const MultipleInstances: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Each Draggable holds its own context, so multiple cards drag independently.',
      },
    },
  },
  render: () => (
    <HStack gap="32px" vAlign="start" width="100%">
      <Draggable>
        <DragHandle>
          <div style={{ ...cardStyle, cursor: 'grab' }}>
            <BodyText>Card A</BodyText>
          </div>
        </DragHandle>
      </Draggable>
      <Draggable>
        <DragHandle>
          <div style={{ ...cardStyle, cursor: 'grab' }}>
            <BodyText>Card B</BodyText>
          </div>
        </DragHandle>
      </Draggable>
      <Draggable>
        <DragHandle>
          <div style={{ ...cardStyle, cursor: 'grab' }}>
            <BodyText>Card C</BodyText>
          </div>
        </DragHandle>
      </Draggable>
    </HStack>
  ),
};

export const PointerEventsTouchAndPen: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The hook is built on Pointer Events with `setPointerCapture`, so touch and pen work the same way as mouse — no extra config.',
      },
    },
  },
  render: () => (
    <VStack gap="12px" width="100%" hAlign="start">
      <BodyText>Touch, pen, and mouse all use the same code path.</BodyText>
      <Draggable>
        <DragHandle>
          <div style={{ ...cardStyle, cursor: 'grab' }}>
            <BodyText>Try with a touchscreen or stylus.</BodyText>
          </div>
        </DragHandle>
      </Draggable>
    </VStack>
  ),
};
