import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '../../themes/theme.js';
import { midnightStyleSheet } from '../../themes/themes/midnight/index.js';
import { HStack } from '../../stacks/h_stack.js';
import { Spacer } from '../../stacks/spacer.js';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { Input } from '../../inputs/input/input.js';
import { VBody } from '../../layouts/body/v_body.js';
import { Card } from '../card/card.js';
import { Header } from '../header/header.js';
import { Footer } from '../footer/footer.js';
import { UtilityBar } from '../utility_bar/utility_bar.js';

const meta: Meta = {
  title: 'Surfaces/Card',
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

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The simplest possible Card — a slab of `--material` with a border, radius, and soft shadow.',
      },
    },
  },
  render: () => (
    <Card maxWidth="400px" padding="16px" gap="8px">
      <Title>Card title</Title>
      <BodyText>
        A Card redeclares the four-variable vocabulary at its boundary. The body
        text and the title both consume `--on-material` from the cascade.
      </BodyText>
    </Card>
  ),
};

export const WithHeader: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Card with a real `Header`. The theme redeclares `--material` on `.j13b-card > .j13b-header`, so the Header reads as a distinct chrome strip — and the Button inside the Header automatically recolors against that material.',
      },
    },
  },
  render: () => (
    <Card maxWidth="420px">
      <Header>
        <Title>Account</Title>
        <Spacer />
        <Button hierarchy="primary">Save</Button>
      </Header>
      <VBody padding="16px" gap="8px">
        <BodyText>Email address.</BodyText>
        <Input width="fill" defaultValue="you@example.com" />
        <BodyText>Display name.</BodyText>
        <Input width="fill" defaultValue="Jane Smith" />
      </VBody>
    </Card>
  ),
};

export const FullChrome: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Header + UtilityBar + VBody + Footer. Each region is its own surface with its own role. Theme rules paint each one without the component needing to know about its container.',
      },
    },
  },
  render: () => (
    <Card maxWidth="520px" maxHeight="420px">
      <Header>
        <Title>Project settings</Title>
        <Spacer />
        <Button hierarchy="tertiary">Reset</Button>
      </Header>
      <UtilityBar>
        <BodyText size="sm">General</BodyText>
        <Spacer />
        <BodyText size="sm">3 unsaved changes</BodyText>
      </UtilityBar>
      <VBody padding="16px" gap="8px">
        <BodyText>Project name.</BodyText>
        <Input width="fill" defaultValue="midnight-ui" />
        <BodyText>Description.</BodyText>
        <Input width="fill" defaultValue="A theme exploration." />
      </VBody>
      <Footer>
        <Spacer />
        <Button>Cancel</Button>
        <Button hierarchy="primary">Save changes</Button>
      </Footer>
    </Card>
  ),
};

export const NestedCardsRecolor: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A Card inside a Card sits one elevation step further (`--midnight-bg-floating`). Each nested Card redeclares `--material`, so a Button inside a nested Card automatically picks up the new local context for its hover state.',
      },
    },
  },
  render: () => (
    <Card maxWidth="520px" padding="16px" gap="12px">
      <Title>Outer card</Title>
      <BodyText>Buttons here hover against the outer Card's material.</BodyText>
      <HStack gap="8px">
        <Button>Outer A</Button>
        <Button hierarchy="primary">Outer B</Button>
      </HStack>

      <Card padding="12px" gap="8px" width="default">
        <Title>Nested card</Title>
        <BodyText>
          This Card's `--material` shifts to `--midnight-bg-floating`. The
          buttons below hover against that material — no per-context CSS.
        </BodyText>
        <HStack gap="8px">
          <Button>Inner A</Button>
          <Button hierarchy="primary">Inner B</Button>
        </HStack>
      </Card>
    </Card>
  ),
};

export const SideBySide: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Two Cards side by side — each is its own surface boundary.',
      },
    },
  },
  render: () => (
    <HStack gap="16px" vAlign="start" width="100%">
      <Card padding="16px" gap="8px" maxWidth="280px">
        <Title>Left</Title>
        <BodyText>Independent surface.</BodyText>
        <Button hierarchy="primary">Action</Button>
      </Card>
      <Card padding="16px" gap="8px" maxWidth="280px">
        <Title>Right</Title>
        <BodyText>Independent surface.</BodyText>
        <Button hierarchy="primary">Action</Button>
      </Card>
    </HStack>
  ),
};

export const SizedAndScrollable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Card with a fixed `maxHeight`. The `VBody` inside is the part that scrolls — Header and Footer stay pinned. This is the `j13b-body` cascade behavior in action.',
      },
    },
  },
  render: () => (
    <Card maxWidth="360px" maxHeight="280px">
      <Header>
        <Title>Long content</Title>
      </Header>
      <VBody padding="12px" gap="8px">
        {Array.from({ length: 30 }).map((_, i) => (
          <BodyText key={i}>Line {i + 1} of a long Card body.</BodyText>
        ))}
      </VBody>
      <Footer>
        <Spacer />
        <Button hierarchy="primary">Done</Button>
      </Footer>
    </Card>
  ),
};
