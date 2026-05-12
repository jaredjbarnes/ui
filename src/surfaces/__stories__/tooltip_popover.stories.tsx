import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '../../themes/theme.js';
import { midnightStyleSheet } from '../../themes/themes/midnight/index.js';
import { HStack } from '../../stacks/h_stack.js';
import { VStack } from '../../stacks/v_stack.js';
import { Spacer } from '../../stacks/spacer.js';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { Tooltip } from '../tooltip/tooltip.js';
import { Popover } from '../popover/popover.js';
import { PopConfirm } from '../pop_confirm/pop_confirm.js';

const meta: Meta = {
  title: 'Surfaces/Tooltip & Popover',
  decorators: [
    (Story) => (
      <Theme styleSheets={[midnightStyleSheet]} style={{ padding: 64 }}>
        <Story />
      </Theme>
    ),
  ],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const TooltipBasic: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Hover or focus the button to show the tooltip. Escape dismisses.',
      },
    },
  },
  render: () => (
    <HStack gap="16px">
      <Tooltip label="Save the current document">
        <Button hierarchy="primary">Save</Button>
      </Tooltip>
      <Tooltip label="Discard your changes" verticalAnchor="bottom" verticalOrigin="top">
        <Button>Discard (below)</Button>
      </Tooltip>
    </HStack>
  ),
};

export const PopoverBasic: Story = {
  render: function PopoverDemo() {
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button ref={triggerRef} onClick={() => setOpen((s) => !s)}>
          {open ? 'Close' : 'Open'} popover
        </Button>
        <Popover
          isOpen={open}
          anchorElement={triggerRef}
          onDismiss={() => setOpen(false)}
        >
          <VStack padding="12px" gap="6px" minWidth="220px">
            <Title size="sm">Popover content</Title>
            <BodyText size="sm">
              Click anywhere outside to dismiss. Buttons inside recolor against
              the popover's --material.
            </BodyText>
            <HStack gap="8px">
              <Spacer />
              <Button hierarchy="tertiary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button hierarchy="primary" onClick={() => setOpen(false)}>
                Apply
              </Button>
            </HStack>
          </VStack>
        </Popover>
      </>
    );
  },
};

export const PopConfirmInline: Story = {
  render: function PopConfirmDemo() {
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button
          ref={triggerRef}
          severity="dangerous"
          onClick={() => setOpen(true)}
        >
          Delete file
        </Button>
        <PopConfirm
          isOpen={open}
          anchorElement={triggerRef}
          onDismiss={() => setOpen(false)}
          title="Delete this file?"
          description="The file will be moved to trash."
          actions={
            <>
              <Button hierarchy="tertiary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                hierarchy="primary"
                severity="dangerous"
                onClick={() => setOpen(false)}
              >
                Delete
              </Button>
            </>
          }
        />
      </>
    );
  },
};
