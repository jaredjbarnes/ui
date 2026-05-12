import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Spacer } from '../../stacks/spacer.js';
import { HStack } from '../../stacks/h_stack.js';
import { Button } from '../../actions/button/button/button.js';
import { Card } from '../../surfaces/card/card.js';
import { Grid } from '../grid/grid.js';
import { List } from '../list/list.js';
import { Item } from '../list/item.js';
import { Group } from '../group/group.js';

const meta: Meta = {
  title: 'Layouts/Grid, List, Group',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

const cellStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'color-mix(in srgb, var(--material), white 4%)',
  border: '1px solid color-mix(in srgb, var(--material), black 20%)',
  borderRadius: 4,
};

export const GridAutoFill: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Items tile to fill the container width via `auto-fill`. Each item is exactly itemWidth × itemHeight. Drag the container narrower / wider to see the column count change.',
      },
    },
  },
  render: () => (
    <Grid itemWidth={140} itemHeight={80} gap="12px">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={cellStyle}>
          Item {i + 1}
        </div>
      ))}
    </Grid>
  ),
};

export const GridCappedColumns: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`columnAmount={3}` caps the grid at three columns even on wide containers. Items still pack from start (justifyContent: start).',
      },
    },
  },
  render: () => (
    <Grid itemWidth={140} itemHeight={80} columnAmount={3} gap="12px">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} style={cellStyle}>
          Item {i + 1}
        </div>
      ))}
    </Grid>
  ),
};

export const ListSelectable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'List items flip `data-is-selected="true"` when chosen. The theme redeclares the row\'s `--material` to the accent — a tertiary Button inside follows via the cascade-reconciliation rule (same pattern as selected Table rows).',
      },
    },
  },
  render: function ListDemo() {
    const items = [
      { id: '1', name: 'Inbox', count: 12 },
      { id: '2', name: 'Sent', count: 4 },
      { id: '3', name: 'Drafts', count: 1 },
      { id: '4', name: 'Archive', count: 220 },
      { id: '5', name: 'Trash', count: 8 },
    ];
    const [selected, setSelected] = useState('2');
    return (
      <Card maxWidth="320px">
        <List padding="6px">
          {items.map((item) => (
            <Item
              key={item.id}
              selected={selected === item.id}
              onClick={() => setSelected(item.id)}
              style={{ cursor: 'pointer' }}
            >
              <BodyText>{item.name}</BodyText>
              <Spacer />
              <BodyText size="sm">{item.count}</BodyText>
              <Button hierarchy="tertiary">Open</Button>
            </Item>
          ))}
        </List>
      </Card>
    );
  },
};

export const GroupSemantic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Group uses `display: contents` — it disappears from layout, only its children participate. Useful for grouping siblings semantically (keyboard nav scopes, ARIA grouping, conditional rendering) without inserting a layout box. Open the inspector to see the Group element is present but the row of buttons lays out as if it weren\'t.',
      },
    },
  },
  render: () => (
    <HStack gap="8px" vAlign="center">
      <Button>Loose</Button>
      <Group role="group" aria-label="Project actions">
        <Button>Open</Button>
        <Button>Share</Button>
        <Button>Archive</Button>
      </Group>
      <Button>Loose</Button>
    </HStack>
  ),
};
