import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '../../themes/theme.js';
import { midnightStyleSheet } from '../../themes/themes/midnight/index.js';
import { Spacer } from '../../stacks/spacer.js';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { Bar } from '../bar/bar.js';
import { Header } from '../header/header.js';
import { Footer } from '../footer/footer.js';
import { UtilityBar } from '../utility_bar/utility_bar.js';
import { Card } from '../card/card.js';
import { VBody } from '../../layouts/body/v_body.js';

const meta: Meta = {
  title: 'Surfaces/Bars',
  decorators: [
    (Story) => (
      <Theme styleSheets={[midnightStyleSheet]} style={{ padding: 32 }}>
        <Story />
      </Theme>
    ),
  ],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const BasicBar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A standalone Bar — generic horizontal strip. Inherits the surrounding surface vocabulary; the Bar itself doesn\'t paint a distinct material.',
      },
    },
  },
  render: () => (
    <Bar>
      <BodyText>Standalone Bar content</BodyText>
      <Spacer />
      <Button>Action</Button>
    </Bar>
  ),
};

export const HeaderInCard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Header on a Card — the theme redeclares `--material` on `.j13b-card > .j13b-header` so the chrome strip reads as separate from the body.',
      },
    },
  },
  render: () => (
    <Card maxWidth="420px">
      <Header>
        <Title>Header in a Card</Title>
        <Spacer />
        <Button hierarchy="primary">Action</Button>
      </Header>
      <VBody padding="16px">
        <BodyText>Body content sits below the Header.</BodyText>
      </VBody>
    </Card>
  ),
};

export const HeaderSizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Headers ship `sm` / `md` / `lg` via `data-size`. Themes pick the min-height.',
      },
    },
  },
  render: () => (
    <Card maxWidth="420px">
      <Header size="sm">
        <Title size="sm">sm Header</Title>
      </Header>
      <VBody padding="8px" />
      <Header size="md">
        <Title>md Header (default)</Title>
      </Header>
      <VBody padding="8px" />
      <Header size="lg">
        <Title size="lg">lg Header</Title>
      </Header>
    </Card>
  ),
};

export const FullChromeCard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Header + UtilityBar + VBody + Footer. Each is independently themed by its position in the cascade.',
      },
    },
  },
  render: () => (
    <Card maxWidth="520px" maxHeight="420px">
      <Header>
        <Title>Settings</Title>
        <Spacer />
        <Button hierarchy="tertiary">Reset</Button>
      </Header>
      <UtilityBar>
        <BodyText size="sm">General · Privacy · Advanced</BodyText>
      </UtilityBar>
      <VBody padding="16px" gap="8px">
        {Array.from({ length: 6 }).map((_, i) => (
          <BodyText key={i}>Setting row {i + 1}.</BodyText>
        ))}
      </VBody>
      <Footer>
        <Spacer />
        <Button>Cancel</Button>
        <Button hierarchy="primary">Save</Button>
      </Footer>
    </Card>
  ),
};

export const UtilityBarStandalone: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'UtilityBar reads as a secondary strip — subtler divider, same baseline material as the body.',
      },
    },
  },
  render: () => (
    <Card maxWidth="420px">
      <UtilityBar>
        <BodyText size="sm">Filters</BodyText>
        <Spacer />
        <Button hierarchy="tertiary">Clear</Button>
      </UtilityBar>
      <VBody padding="16px">
        <BodyText>Body below the UtilityBar.</BodyText>
      </VBody>
    </Card>
  ),
};
