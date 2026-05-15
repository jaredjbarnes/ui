import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from '../../stacks/spacer.js';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { NavItem } from '../../actions/nav_item/nav_item.js';
import { HBody } from '../../layouts/body/h_body.js';
import { VBody } from '../../layouts/body/v_body.js';
import { Page } from '../page/page.js';
import { Panel } from '../panel/panel.js';
import { NavBar } from '../nav_bar/nav_bar.js';
import { SideNav } from '../side_nav/side_nav.js';

const meta: Meta = {
  title: 'Surfaces/Nav',
  parameters: { layout: 'fullscreen', themePadding: 0 },
};

export default meta;
type Story = StoryObj;

/* Stories drive selection with local state instead of href, so clicking a
 * NavItem doesn't navigate away. NavItem itself is flexible — pass href
 * for real routing, pass onClick + isActive for SPA-style or stateful
 * selection. The library doesn't pick a router. */

function NavBarBasicStory() {
  const [section, setSection] = useState('home');
  return (
    <Page>
      <NavBar>
        <Title>MyApp</Title>
        <Spacer />
        <NavItem isActive={section === 'home'} onClick={() => setSection('home')}>
          Home
        </NavItem>
        <NavItem isActive={section === 'projects'} onClick={() => setSection('projects')}>
          Projects
        </NavItem>
        <NavItem isActive={section === 'settings'} onClick={() => setSection('settings')}>
          Settings
        </NavItem>
        <Spacer />
        <Button hierarchy="tertiary">Sign out</Button>
      </NavBar>
      <VBody padding="24px" gap="8px">
        <BodyText>Current section: {section}</BodyText>
      </VBody>
    </Page>
  );
}

export const NavBarBasic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'NavBar — the app-level horizontal nav surface. Semantically `<nav>`. Shares chrome with Header (bottom engraved seam); the visual difference comes from NavItem children with their active state. Selection is local state here; pass `href` instead for real routing.',
      },
    },
  },
  render: () => <NavBarBasicStory />,
};

function SideNavBasicStory() {
  const [route, setRoute] = useState('dashboard');
  return (
    <Page>
      <HBody>
        <SideNav>
          <VBody padding="12px" gap="2px">
            <NavItem isActive={route === 'dashboard'} onClick={() => setRoute('dashboard')}>
              Dashboard
            </NavItem>
            <NavItem isActive={route === 'analytics'} onClick={() => setRoute('analytics')}>
              Analytics
            </NavItem>
            <NavItem isActive={route === 'reports'} onClick={() => setRoute('reports')}>
              Reports
            </NavItem>
            <NavItem isActive={route === 'settings'} onClick={() => setRoute('settings')}>
              Settings
            </NavItem>
          </VBody>
        </SideNav>
        <VBody padding="24px" gap="8px">
          <Title>{route.charAt(0).toUpperCase() + route.slice(1)}</Title>
          <BodyText>Main content fills the rest of the row.</BodyText>
        </VBody>
      </HBody>
    </Page>
  );
}

export const SideNavBasic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'SideNav — the app-level vertical nav rail. Semantically `<nav>`. Shares chrome with Sidebar (sunken slot inside Page or Panel); NavItems carry the active state with a leading-edge accent stripe. SideNav is meant for app-level navigation — Card is for inline content, so don\'t reach for SideNav-in-Card.',
      },
    },
  },
  render: () => <SideNavBasicStory />,
};

function AppShellStory() {
  const [route, setRoute] = useState('dashboard');
  const routes = ['dashboard', 'projects', 'team', 'billing', 'settings'] as const;
  return (
    <Page>
      <NavBar>
        <Title>MyApp</Title>
        <Spacer />
        <Button hierarchy="tertiary">Profile</Button>
        <Button>Sign out</Button>
      </NavBar>
      <HBody>
        <SideNav width="220px">
          <VBody padding="12px" gap="2px">
            {routes.map((r) => (
              <NavItem
                key={r}
                isActive={route === r}
                onClick={() => setRoute(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </NavItem>
            ))}
          </VBody>
        </SideNav>
        <VBody padding="24px" gap="8px">
          <Title>{route.charAt(0).toUpperCase() + route.slice(1)}</Title>
          <BodyText>Main content area.</BodyText>
          {Array.from({ length: 12 }).map((_, i) => (
            <BodyText key={i}>Row {i + 1}</BodyText>
          ))}
        </VBody>
      </HBody>
    </Page>
  );
}

export const AppShell: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The canonical app-shell composition: NavBar across the top, SideNav anchoring the inline-start of the body, main content filling the rest. Both are `<nav>` semantically — assistive tech sees two distinct nav landmarks.',
      },
    },
  },
  render: () => <AppShellStory />,
};

function NavInPanelStory() {
  const [outer, setOuter] = useState('a');
  const [innerTop, setInnerTop] = useState('overview');
  const [innerSide, setInnerSide] = useState('summary');
  return (
    <Page>
      <NavBar>
        <Title>MyApp</Title>
        <Spacer />
        <NavItem isActive={outer === 'a'} onClick={() => setOuter('a')}>
          Section A
        </NavItem>
        <NavItem isActive={outer === 'b'} onClick={() => setOuter('b')}>
          Section B
        </NavItem>
      </NavBar>
      <VBody padding="24px" gap="12px" height="fill">
        <Panel padding="0">
          <NavBar>
            <Title size="sm">Section A</Title>
            <Spacer />
            <NavItem isActive={innerTop === 'overview'} onClick={() => setInnerTop('overview')}>
              Overview
            </NavItem>
            <NavItem isActive={innerTop === 'activity'} onClick={() => setInnerTop('activity')}>
              Activity
            </NavItem>
            <NavItem isActive={innerTop === 'members'} onClick={() => setInnerTop('members')}>
              Members
            </NavItem>
          </NavBar>
          <HBody>
            <SideNav width="180px">
              <VBody padding="12px" gap="2px">
                <NavItem isActive={innerSide === 'summary'} onClick={() => setInnerSide('summary')}>
                  Summary
                </NavItem>
                <NavItem isActive={innerSide === 'details'} onClick={() => setInnerSide('details')}>
                  Details
                </NavItem>
                <NavItem isActive={innerSide === 'history'} onClick={() => setInnerSide('history')}>
                  History
                </NavItem>
              </VBody>
            </SideNav>
            <VBody padding="16px" gap="8px">
              <BodyText>
                The NavBar AND SideNav inside this Panel use the quieter
                active treatment — thinner, translucent. The outer
                NavBar (in the Page) keeps its full-strength underline.
              </BodyText>
            </VBody>
          </HBody>
        </Panel>
      </VBody>
    </Page>
  );
}

export const NavInPanel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A NavBar / SideNav nested inside a Panel pulls LESS than the page-level nav. The active underline thins to 1px and goes translucent; the SideNav stripe thins to 2px and drops its background tile. Composition decides the emphasis — no per-instance prop needed.',
      },
    },
  },
  render: () => <NavInPanelStory />,
};

