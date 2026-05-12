import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '../../themes/theme.js';
import { midnightStyleSheet } from '../../themes/themes/midnight/index.js';
import { Spacer } from '../../stacks/spacer.js';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { Card } from '../../surfaces/card/card.js';
import { Header } from '../../surfaces/header/header.js';
import { Footer } from '../../surfaces/footer/footer.js';
import { VBody } from '../body/v_body.js';
import { HBody } from '../body/h_body.js';

const meta: Meta = {
  title: 'Layouts/Body',
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

export const VBodyBasic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'VBody — vertical content slot. Doesn\'t paint a material; just orchestrates content inside a surface.',
      },
    },
  },
  render: () => (
    <Card maxWidth="420px" maxHeight="320px">
      <Header>
        <Title>VBody example</Title>
      </Header>
      <VBody padding="16px" gap="8px">
        {Array.from({ length: 5 }).map((_, i) => (
          <BodyText key={i}>Row {i + 1}</BodyText>
        ))}
      </VBody>
    </Card>
  ),
};

export const HBodyBasic: Story = {
  parameters: {
    docs: {
      description: {
        story: 'HBody — horizontal content slot. Two-pane layouts, side-by-side content.',
      },
    },
  },
  render: () => (
    <Card maxWidth="520px" maxHeight="280px">
      <Header>
        <Title>HBody example</Title>
      </Header>
      <HBody padding="16px" gap="16px">
        <BodyText>Left pane</BodyText>
        <BodyText>Right pane</BodyText>
      </HBody>
    </Card>
  ),
};

export const NestedScrolling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A VBody inside another VBody scrolls vertically. The cascade rules in `body.module.css` handle the sizing so the outer body fills the surface and the inner body takes the remaining space.',
      },
    },
  },
  render: () => (
    <Card maxWidth="420px" maxHeight="320px">
      <Header>
        <Title>Nested VBody</Title>
      </Header>
      <VBody padding="12px" gap="8px">
        <BodyText>Heading area — stays at top.</BodyText>
        <VBody gap="6px">
          {Array.from({ length: 30 }).map((_, i) => (
            <BodyText key={i}>Scrollable row {i + 1}</BodyText>
          ))}
        </VBody>
      </VBody>
      <Footer>
        <Spacer />
        <Button hierarchy="primary">Done</Button>
      </Footer>
    </Card>
  ),
};

export const TwoPaneHBody: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An HBody splitting a surface into two side-by-side regions. Each region can hold its own VBody, Header, Footer — composition is unlimited.',
      },
    },
  },
  render: () => (
    <Card maxWidth="640px" maxHeight="360px">
      <Header>
        <Title>Two-pane layout</Title>
      </Header>
      <HBody gap="0px">
        <VBody
          padding="12px"
          gap="6px"
          style={{
            maxWidth: 180,
            borderInlineEnd: '1px solid var(--midnight-border-faint)',
          }}
        >
          <BodyText>Left nav</BodyText>
          {Array.from({ length: 5 }).map((_, i) => (
            <BodyText key={i}>Item {i + 1}</BodyText>
          ))}
        </VBody>
        <VBody padding="12px" gap="8px">
          <BodyText>Detail content fills the rest.</BodyText>
          {Array.from({ length: 12 }).map((_, i) => (
            <BodyText key={i}>Detail line {i + 1}</BodyText>
          ))}
        </VBody>
      </HBody>
    </Card>
  ),
};
