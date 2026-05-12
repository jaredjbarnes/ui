import type { Meta, StoryObj } from '@storybook/react';
import { HStack } from '../../stacks/h_stack.js';
import { VStack } from '../../stacks/v_stack.js';
import { Responsive } from '../responsive/responsive.js';
import { Breakpoint } from '../responsive/breakpoint.js';

const meta: Meta = {
  title: 'Layouts/Responsive',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Container: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Container mode reacts to the parent element width. Drag the Storybook canvas (or wrap in a resizable element) to see the active breakpoint change.',
      },
    },
  },
  render: () => (
    <HStack width="100%" hAlign="center">
      <Responsive>
        <Breakpoint to={300}>
          <strong>Small (&lt; 300px)</strong>
        </Breakpoint>
        <Breakpoint from={300} to={800}>
          <strong>Medium (300–800px)</strong>
        </Breakpoint>
        <Breakpoint from={800}>
          <strong>Large (≥ 800px)</strong>
        </Breakpoint>
      </Responsive>
    </HStack>
  ),
};

export const Viewport: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Viewport mode reacts to `document.body` width. Resize the browser to switch.',
      },
    },
  },
  render: () => (
    <HStack width="100%" hAlign="center">
      <Responsive on="viewport">
        <Breakpoint to={600}>
          <strong>Phone (&lt; 600px)</strong>
        </Breakpoint>
        <Breakpoint from={600} to={1200}>
          <strong>Tablet (600–1200px)</strong>
        </Breakpoint>
        <Breakpoint from={1200}>
          <strong>Desktop (≥ 1200px)</strong>
        </Breakpoint>
      </Responsive>
    </HStack>
  ),
};

export const NestedInResizableBox: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Container mode reads its parent. Drag the bottom-right corner of the box to resize and see the breakpoint flip.',
      },
    },
  },
  render: () => (
    <VStack gap="12px" width="100%">
      <div
        style={{
          width: 400,
          minWidth: 100,
          minHeight: 80,
          padding: 16,
          resize: 'horizontal',
          overflow: 'auto',
          border: '1px dashed currentColor',
        }}
      >
        <Responsive>
          <Breakpoint to={200}>Small (&lt; 200px)</Breakpoint>
          <Breakpoint from={200} to={500}>
            Medium (200–500px)
          </Breakpoint>
          <Breakpoint from={500}>Large (≥ 500px)</Breakpoint>
        </Responsive>
      </div>
    </VStack>
  ),
};
