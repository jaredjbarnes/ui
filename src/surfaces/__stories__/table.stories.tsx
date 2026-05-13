import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../actions/button/button/button.js';
import { Card } from '../card/card.js';
import { Panel } from '../panel/panel.js';
import { Header } from '../header/header.js';
import { Footer } from '../footer/footer.js';
import { Spacer } from '../../stacks/spacer.js';
import { HStack } from '../../stacks/h_stack.js';
import { VStack } from '../../stacks/v_stack.js';
import { Title } from '../../typography/title.js';
import { VBody } from '../../layouts/body/v_body.js';
import { theme } from '../../themes/theme_variables.js';
import { TTable, THead, TBody, TFoot, TR, TH, TD } from '../table/table.js';

const meta: Meta = {
  title: 'Surfaces/Table',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const ROWS = [
  { id: 1, name: 'Alpha', owner: 'jane', count: 42 },
  { id: 2, name: 'Beta', owner: 'akira', count: 17 },
  { id: 3, name: 'Gamma', owner: 'priya', count: 88 },
  { id: 4, name: 'Delta', owner: 'remy', count: 5 },
  { id: 5, name: 'Epsilon', owner: 'tomas', count: 121 },
];

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Striped rows with hover. Each TR redeclares `--material`; rows recolor automatically and any child component (Button, Chip) reads the row\'s material — not the table\'s.',
      },
    },
  },
  render: () => (
    <Card height="auto" maxWidth="600px">
      <TTable height="fill">
        <THead>
          <TR>
            <TH>Name</TH>
            <TH>Owner</TH>
            <TH>Count</TH>
            <TH />
          </TR>
        </THead>
        <TBody>
          {ROWS.map((row) => (
            <TR key={row.id}>
              <TD>{row.name}</TD>
              <TD>{row.owner}</TD>
              <TD>{row.count}</TD>
              <TD>
                <Button hierarchy="tertiary">Open</Button>
              </TD>
            </TR>
          ))}
        </TBody>
      </TTable>
      </Card>
  ),
};

export const SelectableRows: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Click a row to select it. The selected row flips both `--material` and `--on-material` — the Button inside immediately re-renders against the accent material.',
      },
    },
  },
  render: function SelectableTable() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    return (
      <Card maxWidth="600px">
        <TTable>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Owner</TH>
              <TH>Count</TH>
              <TH />
            </TR>
          </THead>
          <TBody>
            {ROWS.map((row) => (
              <TR
                key={row.id}
                isSelected={selectedId === row.id}
                onClick={() =>
                  setSelectedId((prev) => (prev === row.id ? null : row.id))
                }
                style={{ cursor: 'pointer' }}
              >
                <TD>{row.name}</TD>
                <TD>{row.owner}</TD>
                <TD>{row.count}</TD>
                <TD>
                  <Button hierarchy="tertiary">Open</Button>
                </TD>
              </TR>
            ))}
          </TBody>
        </TTable>
      </Card>
    );
  },
};

export const WithFooter: Story = {
  render: () => (
    <Card maxWidth="600px">
      <TTable>
        <THead>
          <TR>
            <TH>Name</TH>
            <TH>Count</TH>
          </TR>
        </THead>
        <TBody>
          {ROWS.map((row) => (
            <TR key={row.id}>
              <TD>{row.name}</TD>
              <TD>{row.count}</TD>
            </TR>
          ))}
        </TBody>
        <TFoot>
          <TR>
            <TD>Total</TD>
            <TD>{ROWS.reduce((sum, r) => sum + r.count, 0)}</TD>
          </TR>
        </TFoot>
      </TTable>
    </Card>
  ),
};

export const InCardAndPanel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A table renders differently depending on context. Standalone on the page it gets a drop shadow (no raised neumorphic chrome). Inside a Card or Panel it switches to an inset shadow — the table reads as carved into the parent surface. The theme rule is pure cascade — no Table prop needed.',
      },
    },
  },
  render: () => {
    const data = (
      <>
        <THead>
          <TR>
            <TH>Name</TH>
            <TH>Owner</TH>
            <TH>Count</TH>
          </TR>
        </THead>
        <TBody>
          {ROWS.map((row) => (
            <TR key={row.id}>
              <TD>{row.name}</TD>
              <TD>{row.owner}</TD>
              <TD>{row.count}</TD>
            </TR>
          ))}
        </TBody>
      </>
    );
    return (
      <HStack gap="24px" hAlign="start" vAlign="start" allowFlow>
        <VStack gap="8px" width="auto">
          <Title size="sm">In a Card</Title>
          <Card width="320px">
            <TTable>{data}</TTable>
          </Card>
        </VStack>

        <VStack gap="8px" width="auto">
          <Title size="sm">In a Panel</Title>
          <Panel width="320px">
            <TTable>{data}</TTable>
          </Panel>
        </VStack>

        <VStack gap="8px" width="auto">
          <Title size="sm">Standalone (for reference)</Title>
          <div style={{ width: 320 }}>
            <TTable>{data}</TTable>
          </div>
        </VStack>
      </HStack>
    );
  },
};

export const HeaderAndPaddedBodyInPanel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A Panel composing Header + side-padded VBody + Footer. The VBody uses `paddingInline` only (theme.padding.lg) so children get horizontal breathing room while the top/bottom edges sit flush against the Header and Footer — no double-padding at the seams. Header and Footer are direct Panel children and use their own padding rules.',
      },
    },
  },
  render: () => (
    <Panel width="520px">
      <Header>
        <Title size="sm">Recent projects</Title>
      </Header>
      <VBody padding={theme.padding.md} gap={theme.gap.md}>
        <TTable>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Owner</TH>
              <TH>Count</TH>
            </TR>
          </THead>
          <TBody>
            {ROWS.map((row) => (
              <TR key={row.id}>
                <TD>{row.name}</TD>
                <TD>{row.owner}</TD>
                <TD>{row.count}</TD>
              </TR>
            ))}
          </TBody>
        </TTable>
      </VBody>
      <Footer>
        <Spacer />
        <Button hierarchy="tertiary">Cancel</Button>
        <Button hierarchy="primary">Save</Button>
      </Footer>
    </Panel>
  ),
};

export const StickyHeaderAndCols: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`sticky` pins the head, foot, and the first and last columns when the table scrolls. Long horizontal lists stay readable.',
      },
    },
  },
  render: () => {
    // Wide cells trigger horizontal overflow so the sticky-column behavior
    // has something to demo. Real apps usually get this from content size
    // alone; the inline `minWidth` here is for the story only.
    const wide = { minWidth: 140 };
    return (
      <Card style={{ resize: 'both', width: 520, height: 320 }}>
        <VBody>
        <TTable sticky height="fill">
          <THead>
            <TR>
              <TH style={wide}>Project name</TH>
              <TH style={wide}>Region</TH>
              <TH style={wide}>Status</TH>
              <TH style={wide}>Primary owner</TH>
              <TH style={wide}>Count</TH>
              <TH style={wide}>Last updated</TH>
              <TH style={wide}>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {Array.from({ length: 25 }).map((_, i) => (
              <TR key={i}>
                <TD style={wide}>Project {i + 1}</TD>
                <TD style={wide}>us-east-{(i % 3) + 1}</TD>
                <TD style={wide}>active</TD>
                <TD style={wide}>user-{i + 1}@example.com</TD>
                <TD style={wide}>{(i * 13) % 200}</TD>
                <TD style={wide}>
                  2026-05-{((i % 28) + 1).toString().padStart(2, '0')}
                </TD>
                <TD style={wide}>
                  <Button hierarchy="tertiary">Open</Button>
                </TD>
              </TR>
            ))}
          </TBody>
        </TTable>
        </VBody>
      </Card>
    );
  },
};
