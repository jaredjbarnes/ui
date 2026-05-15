import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from '../../stacks/spacer.js';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { HBody } from '../../layouts/body/h_body.js';
import { VBody } from '../../layouts/body/v_body.js';
import { Page } from '../page/page.js';
import { Panel } from '../panel/panel.js';
import { Card } from '../card/card.js';
import { Aside } from '../aside/aside.js';
import { SidebarStart } from '../sidebar/sidebar_start.js';
import { SidebarEnd } from '../sidebar/sidebar_end.js';
import { Header } from '../header/header.js';
import { Footer } from '../footer/footer.js';

const meta: Meta = {
  title: 'Surfaces/Structural',
  parameters: { layout: 'fullscreen', themePadding: 0 },
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
          'Panel is a structural region OF its parent — fills available space by default. Two stacked Panels split the parent\'s height proportionally (same pattern as TTable). Pass `height="auto"` to opt into content-sized.',
      },
    },
  },
  render: () => (
    <Page>
      <VBody padding="16px" gap="12px" height="fill">
        <Title>Settings</Title>
        <Panel padding="16px" gap="8px">
          <Title size="sm">General</Title>
          <BodyText>This Panel fills its share of the parent VBody.</BodyText>
          <BodyText>Two stacked Panels split the available height 50/50.</BodyText>
          <Button hierarchy="primary">Save</Button>
        </Panel>
        <Panel padding="16px" gap="8px">
          <Title size="sm">Privacy</Title>
          <BodyText>The sibling Panel splits the space.</BodyText>
        </Panel>
      </VBody>
    </Page>
  ),
};

export const SidebarInPanel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Sidebar inside a Panel reads the same as Sidebar inside a Page — a sunken slot in the canvas. Panel\'s role is "canvas of region," so anything that paints against the Page canvas paints the same against a Panel. One rule, two compositions. See `docs/composition-emphasis.md`.',
      },
    },
  },
  render: () => (
    <Page>
      <Header>
        <Title>SidebarInPanel</Title>
      </Header>
      <HBody>
        <VBody padding="16px" gap="12px" height="fill">
          <Panel padding="0">
            <HBody>
              <SidebarStart width="180px">
                <VBody padding="12px" gap="6px">
                  <BodyText>Panel-internal nav</BodyText>
                  <Button hierarchy="tertiary">Section A</Button>
                  <Button hierarchy="tertiary">Section B</Button>
                  <Button hierarchy="tertiary">Section C</Button>
                </VBody>
              </SidebarStart>
              <VBody padding="16px" gap="8px">
                <Title size="sm">Panel content</Title>
                <BodyText>
                  Sidebar inside Panel paints as a sunken slot — same recipe
                  the page-level rail uses. The Panel itself reads as a region
                  carved into the page via its faint engraved boundary.
                </BodyText>
              </VBody>
            </HBody>
          </Panel>
        </VBody>
      </HBody>
    </Page>
  ),
};

export const SidebarInCard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Sidebar inside a Card paints differently — Card is a self-contained widget that sits ON the surface, so the sidebar reads as engraved INTO the card\'s sheet rather than as a slot in the page canvas. Same component, different emphasis. The directional edge shadow doesn\'t apply here; the whole boundary is the well.',
      },
    },
  },
  render: () => (
    <Page>
      <Header>
        <Title>SidebarInCard</Title>
      </Header>
      <VBody padding="24px" gap="12px">
        <Card padding="0" width="default" height="360px">
          <HBody>
            <SidebarStart width="180px">
              <VBody padding="12px" gap="6px">
                <BodyText>Card-internal nav</BodyText>
                <Button hierarchy="tertiary">Overview</Button>
                <Button hierarchy="tertiary">Details</Button>
                <Button hierarchy="tertiary">Activity</Button>
              </VBody>
            </SidebarStart>
            <VBody padding="16px" gap="8px">
              <Title size="sm">Card content</Title>
              <BodyText>
                The sidebar reads as engraved into the card's sheet — same
                shadow recipe a nested Card uses against an outer Card. The
                Card itself keeps its raised paper chrome; the sidebar is the
                slot cut into it.
              </BodyText>
            </VBody>
          </HBody>
        </Card>
      </VBody>
    </Page>
  ),
};

export const AsideAsCallout: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Aside in its new role — inline tangential content. Use for pull quotes, callouts, related-link blocks that sit between paragraphs in an article-style layout. Distinct from Sidebar (the persistent app-shell rail). Semantic `<aside>` element.',
      },
    },
  },
  render: () => (
    <Page>
      <Header>
        <Title>Article</Title>
      </Header>
      <VBody padding="24px" gap="12px" width="default" maxWidth="720px">
        <Title>Main article</Title>
        <BodyText>
          Aside is a marginal note in the body flow. It reads as engraved with
          a leading accent stripe so it doesn't compete with structural
          surfaces like Card or Panel.
        </BodyText>
        <BodyText>
          A second paragraph of body text. The aside below interrupts the flow
          to call out something tangential.
        </BodyText>
        <Aside>
          <Title size="sm">Related</Title>
          <BodyText>
            Tangentially related notes go here. This is content, not chrome —
            no app-shell role, no positional variants.
          </BodyText>
        </Aside>
        <BodyText>
          Body continues. For the persistent side-rail role (filters, nav),
          use `SidebarStart` or `SidebarEnd` instead.
        </BodyText>
      </VBody>
    </Page>
  ),
};

export const AsideSeverities: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Aside supports the same five severities as Alert (neutral / suggested / encouraged / cautious / dangerous). The leading-edge stripe tints to the severity color so the tone is signaled quietly — the material stays untinted, keeping Aside calmer than Alert.',
      },
    },
  },
  render: () => (
    <Page>
      <Header>
        <Title>Aside severities</Title>
      </Header>
      <VBody padding="24px" gap="12px" width="default" maxWidth="720px">
        <Aside severity="neutral">
          <Title size="sm">Neutral</Title>
          <BodyText>Default tone. Used when no specific signal is needed.</BodyText>
        </Aside>
        <Aside severity="suggested">
          <Title size="sm">Suggested</Title>
          <BodyText>Informational — a tip, a related link, a "by the way."</BodyText>
        </Aside>
        <Aside severity="encouraged">
          <Title size="sm">Encouraged</Title>
          <BodyText>Positive guidance — a recommendation, a success-tinged note.</BodyText>
        </Aside>
        <Aside severity="cautious">
          <Title size="sm">Cautious</Title>
          <BodyText>Heads-up — something to be aware of without being urgent.</BodyText>
        </Aside>
        <Aside severity="dangerous">
          <Title size="sm">Dangerous</Title>
          <BodyText>Important warning — proceed carefully. Even so, this stays inline; if it's a system alert, prefer `Alert`.</BodyText>
        </Aside>
      </VBody>
    </Page>
  ),
};
