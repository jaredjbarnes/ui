import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '../../themes/theme.js';
import { midnightStyleSheet } from '../../themes/themes/midnight/index.js';
import { Spacer } from '../../stacks/spacer.js';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { HBody } from '../../layouts/body/h_body.js';
import { VBody } from '../../layouts/body/v_body.js';
import { Page } from '../page/page.js';
import { Panel } from '../panel/panel.js';
import { Aside } from '../aside/aside.js';
import { SidebarStart } from '../sidebar/sidebar_start.js';
import { SidebarEnd } from '../sidebar/sidebar_end.js';
import { Header } from '../header/header.js';
import { Footer } from '../footer/footer.js';

const meta: Meta = {
  title: 'Surfaces/Structural',
  decorators: [
    (Story) => (
      <Theme
        styleSheets={[midnightStyleSheet]}
        style={{ width: '100%', height: '100vh' }}
      >
        <Story />
      </Theme>
    ),
  ],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const PageBasic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Page is the root surface. Fills its container; everything else cascades from its vocabulary.',
      },
    },
  },
  render: () => (
    <Page>
      <Header>
        <Title>My App</Title>
        <Spacer />
        <Button>Account</Button>
      </Header>
      <VBody padding="16px" gap="8px">
        <BodyText>This is page content inside a Page surface.</BodyText>
        <BodyText>Page provides the root --material; Header and Footer redeclare around it.</BodyText>
      </VBody>
    </Page>
  ),
};

export const AppShellPattern: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The "app shell" pattern — Page wraps Header + HBody { SidebarStart + VBody }. No `App` component required; the composition IS the App.',
      },
    },
  },
  render: () => (
    <Page>
      <Header>
        <Title>App</Title>
        <Spacer />
        <Button hierarchy="tertiary">Profile</Button>
        <Button>Sign out</Button>
      </Header>
      <HBody>
        <SidebarStart>
          <VBody padding="12px" gap="6px">
            <BodyText>Home</BodyText>
            <BodyText>Inbox</BodyText>
            <BodyText>Settings</BodyText>
          </VBody>
        </SidebarStart>
        <VBody padding="16px" gap="8px">
          <Title>Route content</Title>
          <BodyText>The main content slot fills the remaining space.</BodyText>
          {Array.from({ length: 18 }).map((_, i) => (
            <BodyText key={i}>Row {i + 1}</BodyText>
          ))}
        </VBody>
      </HBody>
    </Page>
  ),
};

export const TwoSidebarShell: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'SidebarStart on the inline-start edge, SidebarEnd on the inline-end edge. Buttons inside either sidebar automatically recolor against the sidebar\'s recessed material.',
      },
    },
  },
  render: () => (
    <Page>
      <Header>
        <Title>Document editor</Title>
      </Header>
      <HBody>
        <SidebarStart width="200px">
          <VBody padding="12px" gap="6px">
            <BodyText>Navigation</BodyText>
            <Button hierarchy="tertiary">Outline</Button>
            <Button hierarchy="tertiary">Pages</Button>
          </VBody>
        </SidebarStart>
        <VBody padding="16px" gap="8px">
          <Title>Editor</Title>
          <BodyText>Main document content goes here.</BodyText>
        </VBody>
        <SidebarEnd width="240px">
          <VBody padding="12px" gap="6px">
            <BodyText>Inspector</BodyText>
            <BodyText>Properties of the selected block appear here.</BodyText>
          </VBody>
        </SidebarEnd>
      </HBody>
      <Footer>
        <BodyText size="sm">Status: Ready</BodyText>
        <Spacer />
        <BodyText size="sm">Word count: 1,243</BodyText>
      </Footer>
    </Page>
  ),
};

export const NestedSidebarHierarchies: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A primary SidebarStart followed by a tertiary one inside the main content area. Tertiary sidebars get a quieter paint (no border, slightly different material).',
      },
    },
  },
  render: () => (
    <Page>
      <Header>
        <Title>App</Title>
      </Header>
      <HBody>
        <SidebarStart hierarchy="primary" width="200px">
          <VBody padding="12px" gap="6px">
            <BodyText>Primary nav</BodyText>
          </VBody>
        </SidebarStart>
        <HBody>
          <SidebarStart hierarchy="tertiary" width="180px">
            <VBody padding="12px" gap="6px">
              <BodyText>Sub-nav</BodyText>
            </VBody>
          </SidebarStart>
          <VBody padding="16px" gap="8px">
            <Title>Main</Title>
            <BodyText>Content fills the remaining space.</BodyText>
          </VBody>
        </HBody>
      </HBody>
    </Page>
  ),
};

export const PanelAsContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Panel as a structural sub-region within a page. Use when you want surface treatment but not Card\'s shadow + heavier border.',
      },
    },
  },
  render: () => (
    <Page>
      <VBody padding="16px" gap="12px">
        <Title>Settings</Title>
        <Panel padding="16px" gap="8px" width="default">
          <Title size="sm">General</Title>
          <BodyText>Panel reads as a flat sub-region — no shadow, hairline border.</BodyText>
          <Button hierarchy="primary">Save</Button>
        </Panel>
        <Panel padding="16px" gap="8px" width="default">
          <Title size="sm">Privacy</Title>
          <BodyText>Another Panel sibling.</BodyText>
        </Panel>
      </VBody>
    </Page>
  ),
};

export const AsideAlongsideMain: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Aside is for tangential content — supporting info, related links — that complements the main flow without being navigation. Semantic `<aside>` element.',
      },
    },
  },
  render: () => (
    <Page>
      <Header>
        <Title>Article</Title>
      </Header>
      <HBody>
        <VBody padding="16px" gap="8px">
          <Title>Main article</Title>
          {Array.from({ length: 8 }).map((_, i) => (
            <BodyText key={i}>Paragraph {i + 1} of the article body.</BodyText>
          ))}
        </VBody>
        <Aside width="280px">
          <VBody padding="16px" gap="8px">
            <Title size="sm">Related</Title>
            <BodyText>Tangentially related links go here.</BodyText>
            <BodyText>Aside reads as supporting content via a recessed material.</BodyText>
          </VBody>
        </Aside>
      </HBody>
    </Page>
  ),
};
