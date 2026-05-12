import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HStack } from '../../stacks/h_stack.js';
import { Spacer } from '../../stacks/spacer.js';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { DragHandle } from '../../utils/decorators/draggable/drag_handle.js';
import { VBody } from '../../layouts/body/v_body.js';
import { Drawer, type DrawerSide } from '../drawer/drawer.js';
import { Window } from '../window/window.js';
import { Header } from '../header/header.js';

const meta: Meta = {
  title: 'Surfaces/Drawer & Window',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const DrawerSides: Story = {
  render: function DrawerSidesDemo() {
    const [side, setSide] = useState<DrawerSide | null>(null);
    return (
      <>
        <HStack gap="8px">
          <Button onClick={() => setSide('start')}>Open start</Button>
          <Button onClick={() => setSide('end')}>Open end</Button>
          <Button onClick={() => setSide('top')}>Open top</Button>
          <Button onClick={() => setSide('bottom')}>Open bottom</Button>
        </HStack>
        {side && (
          <Drawer isOpen side={side} veil resizable>
            <Header>
              <Title>Drawer from {side}</Title>
              <Spacer />
              <Button hierarchy="tertiary" onClick={() => setSide(null)}>
                Close
              </Button>
            </Header>
            <VBody padding="16px" gap="8px" minWidth="240px" minHeight="160px">
              <BodyText>Drag the inside edge to resize.</BodyText>
              <BodyText>Click the veil to dismiss is not wired here —
                consumers handle dismissal explicitly.</BodyText>
            </VBody>
          </Drawer>
        )}
      </>
    );
  },
};

export const FreeFloatingWindow: Story = {
  render: function WindowDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Window</Button>
        <Window isOpen={open}>
          <DragHandle>
            <Header>
              <Title>Inspector</Title>
              <Spacer />
              <Button hierarchy="tertiary" onClick={() => setOpen(false)}>
                ×
              </Button>
            </Header>
          </DragHandle>
          <VBody padding="12px" gap="8px" minHeight="160px" minWidth="240px">
            <BodyText>Free-floating, no veil. Drag the title bar.</BodyText>
            <BodyText>Resize any edge.</BodyText>
          </VBody>
        </Window>
      </>
    );
  },
};
