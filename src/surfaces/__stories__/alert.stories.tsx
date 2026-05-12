import type { Meta, StoryObj } from '@storybook/react';
import { VStack } from '../../stacks/v_stack.js';
import { HStack } from '../../stacks/h_stack.js';
import { Spacer } from '../../stacks/spacer.js';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { Alert } from '../alert/alert.js';

const meta: Meta = {
  title: 'Surfaces/Alert',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const AllSeverities: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Each severity redeclares `--material` toward its status color. The border and the action color follow. Text inside stays legible because the material is mixed against the elevated surface, not pure status color.',
      },
    },
  },
  render: () => (
    <VStack gap="12px" maxWidth="520px">
      <Alert severity="neutral">
        <Title size="sm">Neutral</Title>
        <BodyText>Informational notice — nothing urgent.</BodyText>
      </Alert>
      <Alert severity="suggested">
        <Title size="sm">Suggested</Title>
        <BodyText>Here\'s an option worth considering.</BodyText>
      </Alert>
      <Alert severity="encouraged">
        <Title size="sm">Encouraged</Title>
        <BodyText>Operation completed successfully.</BodyText>
      </Alert>
      <Alert severity="cautious">
        <Title size="sm">Cautious</Title>
        <BodyText>Heads up — this might cause issues.</BodyText>
      </Alert>
      <Alert severity="dangerous">
        <Title size="sm">Dangerous</Title>
        <BodyText>This action could result in data loss.</BodyText>
      </Alert>
    </VStack>
  ),
};

export const WithActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Buttons inside an Alert recolor against the alert\'s material — no per-context CSS. The hover/focus mix happens against the severity-tinted material, so a button on a dangerous Alert hovers in the danger tone naturally.',
      },
    },
  },
  render: () => (
    <VStack gap="12px" maxWidth="520px">
      <Alert severity="dangerous">
        <Title size="sm">Delete project?</Title>
        <BodyText>This cannot be undone.</BodyText>
        <HStack gap="8px">
          <Spacer />
          <Button>Cancel</Button>
          <Button hierarchy="primary" severity="dangerous">
            Delete
          </Button>
        </HStack>
      </Alert>
      <Alert severity="cautious">
        <Title size="sm">Unsaved changes</Title>
        <BodyText>You have 3 unsaved changes.</BodyText>
        <HStack gap="8px">
          <Spacer />
          <Button>Discard</Button>
          <Button hierarchy="primary">Save</Button>
        </HStack>
      </Alert>
    </VStack>
  ),
};

export const WithAdornment: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `adornment` slot accepts any node — typically an icon. The theme tints `.j13b-alert-adornment` to the status color automatically.',
      },
    },
  },
  render: () => (
    <VStack gap="12px" maxWidth="520px">
      <Alert severity="encouraged" adornment={<strong>✓</strong>}>
        <BodyText>Settings saved.</BodyText>
      </Alert>
      <Alert severity="cautious" adornment={<strong>!</strong>}>
        <BodyText>Your session expires soon.</BodyText>
      </Alert>
    </VStack>
  ),
};
