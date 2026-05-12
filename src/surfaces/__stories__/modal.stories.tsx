import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from '../../stacks/spacer.js';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { Input } from '../../inputs/input/input.js';
import { DragHandle } from '../../utils/decorators/draggable/drag_handle.js';
import { VBody } from '../../layouts/body/v_body.js';
import { Modal } from '../modal/modal.js';
import { Header } from '../header/header.js';
import { Footer } from '../footer/footer.js';
import { Confirm } from '../confirm/confirm.js';

const meta: Meta = {
  title: 'Surfaces/Modal',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: function ModalDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal isOpen={open}>
          <DragHandle>
            <Header>
              <Title>Edit account</Title>
              <Spacer />
              <Button hierarchy="tertiary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </Header>
          </DragHandle>
          <VBody padding="16px" gap="8px">
            <BodyText>Email address.</BodyText>
            <Input width="fill" defaultValue="you@example.com" />
            <BodyText>Display name.</BodyText>
            <Input width="fill" defaultValue="Jane Smith" />
          </VBody>
          <Footer>
            <Spacer />
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button hierarchy="primary" onClick={() => setOpen(false)}>
              Save
            </Button>
          </Footer>
        </Modal>
      </>
    );
  },
};

export const Resizable: Story = {
  render: function ResizableModal() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open resizable Modal</Button>
        <Modal isOpen={open} resizable>
          <DragHandle>
            <Header>
              <Title>Resizable</Title>
              <Spacer />
              <Button hierarchy="tertiary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </Header>
          </DragHandle>
          <VBody padding="16px" gap="8px" minHeight="120px" minWidth="320px">
            <BodyText>Drag any edge to resize.</BodyText>
            <BodyText>The Modal stays centered as it changes size.</BodyText>
          </VBody>
        </Modal>
      </>
    );
  },
};

export const ConfirmDialog: Story = {
  render: function ConfirmDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button severity="dangerous" hierarchy="primary" onClick={() => setOpen(true)}>
          Delete project
        </Button>
        <Confirm
          isOpen={open}
          title="Delete project?"
          description="This permanently removes the project and all its data. This cannot be undone."
          actions={
            <>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
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
