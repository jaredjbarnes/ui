import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Card } from '../card/card.js';
import { VBody } from '../../layouts/body/v_body.js';
import { TabsBar } from '../tabs/tabs_bar.js';
import { TabsList } from '../tabs/tabs_list.js';
import { TabItem } from '../tabs/tab_item.js';
import { Tabs } from '../tabs/context.js';
import { Tab } from '../tabs/tab.js';
import { TabLink } from '../tabs/tab_link.js';
import { TabsNavbar } from '../tabs/tabs_navbar.js';
import { OverflowTabsNavbar } from '../tabs/overflow_tabs_navbar.js';

const meta: Meta = {
  title: 'Surfaces/Tabs',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const PrimitivesUncontrolled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'TabsBar + TabsList + TabItem composed directly, without the context. Consumers manage their own selected state. Arrow keys / Home / End navigate between tabs.',
      },
    },
  },
  render: function PrimitivesDemo() {
    const [selected, setSelected] = useState('overview');
    const items = [
      { value: 'overview', label: 'Overview' },
      { value: 'activity', label: 'Activity' },
      { value: 'settings', label: 'Settings' },
    ];
    return (
      <Card maxWidth="520px">
        <TabsBar>
          <TabsList>
            {items.map((item) => (
              <TabItem
                key={item.value}
                selected={selected === item.value}
                onClick={() => setSelected(item.value)}
              >
                {item.label}
              </TabItem>
            ))}
          </TabsList>
        </TabsBar>
        <VBody padding="16px" gap="8px">
          <BodyText>Selected: {selected}</BodyText>
        </VBody>
      </Card>
    );
  },
};

export const StatefulWithNavbar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `<Tabs>` context provider holds state. `<TabsNavbar>` is the chrome with an animated underline that follows the active TabLink. `<Tab>` renders the panel for whichever value is active.',
      },
    },
  },
  render: function StatefulDemo() {
    const [tab, setTab] = useState('overview');
    return (
      <Card maxWidth="520px" maxHeight="300px">
        <Tabs value={tab} onChange={setTab}>
          <TabsNavbar>
            <TabLink value="overview">Overview</TabLink>
            <TabLink value="activity">Activity</TabLink>
            <TabLink value="settings">Settings</TabLink>
          </TabsNavbar>
          <VBody padding="16px" gap="8px">
            <Tab value="overview">
              <Title size="sm">Overview</Title>
              <BodyText>Summary of project state.</BodyText>
            </Tab>
            <Tab value="activity">
              <Title size="sm">Activity</Title>
              <BodyText>Recent events on the project.</BodyText>
            </Tab>
            <Tab value="settings">
              <Title size="sm">Settings</Title>
              <BodyText>Knobs that configure the project.</BodyText>
            </Tab>
          </VBody>
        </Tabs>
      </Card>
    );
  },
};

export const OverflowResizable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`<OverflowTabsNavbar>` measures bar width + each tab\'s natural width via ResizeObserver. Tabs that don\'t fit are pulled out of layout (still in the DOM so we keep their widths) and surface in a More popover. The More trigger wears the active tab\'s label when an overflow tab is selected, so the current selection is always visible. Drag the card\'s bottom-right corner to watch tabs flow in and out.',
      },
    },
  },
  render: function OverflowDemo() {
    const [tab, setTab] = useState('overview');
    const items = [
      { value: 'overview', label: 'Overview' },
      { value: 'activity', label: 'Activity' },
      { value: 'settings', label: 'Settings' },
      { value: 'integrations', label: 'Integrations' },
      { value: 'permissions', label: 'Permissions' },
      { value: 'billing', label: 'Billing' },
      { value: 'audit', label: 'Audit log' },
    ];
    return (
      <Card style={{ resize: 'both', width: 520, height: 280 }}>
        <Tabs value={tab} onChange={setTab}>
          <OverflowTabsNavbar items={items} />
          <VBody padding="16px" gap="8px">
            <BodyText>Selected: {tab}</BodyText>
          </VBody>
        </Tabs>
      </Card>
    );
  },
};

export const InlineVariant: Story = {
  parameters: {
    docs: {
      description: {
        story: 'TabsBar with `variant="inline"` drops the bar chrome — tabs read as inline labels.',
      },
    },
  },
  render: function InlineDemo() {
    const [tab, setTab] = useState('all');
    return (
      <Tabs value={tab} onChange={setTab}>
        <TabsNavbar variant="inline">
          <TabLink value="all">All</TabLink>
          <TabLink value="open">Open</TabLink>
          <TabLink value="closed">Closed</TabLink>
        </TabsNavbar>
      </Tabs>
    );
  },
};
