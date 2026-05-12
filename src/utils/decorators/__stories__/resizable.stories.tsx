import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BodyText } from '../../../typography/body_text.js';
import { Resizable } from '../resizable/resizable.js';
import { ResizeHandle } from '../resizable/resize_handle.js';
import { Draggable } from '../draggable/draggable.js';
import { DragHandle } from '../draggable/drag_handle.js';

const meta: Meta = {
  title: 'Utils/Decorators/Resizable',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const panel: React.CSSProperties = {
  width: 300,
  height: 200,
  minWidth: 120,
  minHeight: 80,
  maxWidth: 600,
  maxHeight: 400,
  padding: 16,
  background: 'var(--material)',
  color: 'var(--on-material)',
  border: '1px solid color-mix(in srgb, var(--material), black 30%)',
  borderRadius: 6,
  boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
  overflow: 'hidden',
};

export const AllSides: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Edge handles on all four sides. The handles inherit cursor and position from the system-layer CSS.',
      },
    },
  },
  render: () => (
    <Resizable>
      <div style={panel}>
        <BodyText>Drag any edge.</BodyText>
      </div>
      <ResizeHandle position="top" />
      <ResizeHandle position="bottom" />
      <ResizeHandle position="start" />
      <ResizeHandle position="end" />
    </Resizable>
  ),
};

export const CornersToo: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Add corner handles for two-axis resize.',
      },
    },
  },
  render: () => (
    <Resizable>
      <div style={panel}>
        <BodyText>Drag edges or corners.</BodyText>
      </div>
      <ResizeHandle position="top" />
      <ResizeHandle position="bottom" />
      <ResizeHandle position="start" />
      <ResizeHandle position="end" />
      <ResizeHandle position="top-start" />
      <ResizeHandle position="top-end" />
      <ResizeHandle position="bottom-start" />
      <ResizeHandle position="bottom-end" />
    </Resizable>
  ),
};

export const RespectsMinMax: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The element has `minWidth: 120 / minHeight: 80 / maxWidth: 600 / maxHeight: 400`. `detect_resize_bounds` reads the computed style and clamps the inline size so the user sees the constraint without an extra prop.',
      },
    },
  },
  render: () => (
    <Resizable>
      <div style={panel}>
        <BodyText>120–600 wide, 80–400 tall.</BodyText>
      </div>
      <ResizeHandle position="bottom-end" />
    </Resizable>
  ),
};

export const ReportsCallbacks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Provide `onWidthResize` / `onHeightResize` to follow the live size; `onWidthResizeEnd` / `onHeightResizeEnd` fire on pointer up.',
      },
    },
  },
  render: function ReportsCallbacksDemo() {
    const [size, setSize] = useState({ w: 300, h: 200 });
    return (
      <Resizable
        onWidthResize={(p) => setSize((s) => ({ ...s, w: Math.round(p.width) }))}
        onHeightResize={(p) => setSize((s) => ({ ...s, h: Math.round(p.height) }))}
      >
        <div style={panel}>
          <BodyText>
            {size.w} × {size.h}
          </BodyText>
        </div>
        <ResizeHandle position="bottom-end" />
      </Resizable>
    );
  },
};

export const DraggableAndResizable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Decorators compose by stacking. Wrap `<Resizable>` inside `<Draggable>` to get both behaviors on the same element.',
      },
    },
  },
  render: () => (
    <Draggable>
      <Resizable>
        <div style={panel}>
          <DragHandle>
            <div
              style={{
                padding: '6px 8px',
                background: 'color-mix(in srgb, var(--material), white 6%)',
                borderRadius: 4,
                cursor: 'grab',
                marginBottom: 8,
              }}
            >
              ⋮⋮  Drag the title bar — resize any edge.
            </div>
          </DragHandle>
          <BodyText>The body is selectable; edges and corners resize.</BodyText>
        </div>
        <ResizeHandle position="top" />
        <ResizeHandle position="bottom" />
        <ResizeHandle position="start" />
        <ResizeHandle position="end" />
        <ResizeHandle position="bottom-end" />
      </Resizable>
    </Draggable>
  ),
};
