import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from '../../stacks/spacer.js';
import { Title } from '../../typography/title.js';
import { BodyText } from '../../typography/body_text.js';
import { Button } from '../../actions/button/button/button.js';
import { Card } from '../card/card.js';
import { Section } from '../section/section.js';
import { Heading } from '../section/heading.js';
import { Detail } from '../section/detail.js';
import { VBody } from '../../layouts/body/v_body.js';

const meta: Meta = {
  title: 'Surfaces/Section',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Card maxWidth="520px">
      <Section>
        <Heading>
          <Title size="sm">Section title</Title>
          <Spacer />
          <Button hierarchy="tertiary">Action</Button>
        </Heading>
        <Detail>
          <BodyText>Detail content sits under the heading.</BodyText>
          <BodyText>The Section paints its own material; Heading and Detail inherit it.</BodyText>
        </Detail>
      </Section>
    </Card>
  ),
};

export const NestedDepthRotation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Each nesting level redeclares `--material` with a different accent mix. No prop on Section — depth alone drives the palette step.',
      },
    },
  },
  render: () => (
    <Card maxWidth="600px" maxHeight="500px">
      <Section>
        <Heading>
          <Title size="sm">Level 1 — accent neutral</Title>
        </Heading>
        <Detail>
          <BodyText>Outer section content.</BodyText>

          <Section>
            <Heading>
              <Title size="sm">Level 2 — accent tinted</Title>
            </Heading>
            <Detail>
              <BodyText>Sub-section content.</BodyText>

              <Section>
                <Heading>
                  <Title size="sm">Level 3 — positive tinted</Title>
                </Heading>
                <Detail>
                  <BodyText>Sub-sub-section content.</BodyText>

                  <Section>
                    <Heading>
                      <Title size="sm">Level 4 — warning tinted</Title>
                    </Heading>
                    <Detail>
                      <BodyText>Deepest section in this story.</BodyText>
                    </Detail>
                  </Section>
                </Detail>
              </Section>
            </Detail>
          </Section>
        </Detail>
      </Section>
    </Card>
  ),
};

export const StickyHeadings: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Headings are sticky to the section\'s scroll context. Scroll the long detail content to see each level\'s heading pin at the top.',
      },
    },
  },
  render: () => (
    <Card maxWidth="520px" maxHeight="360px">
      <VBody>
        <Section>
          <Heading>
            <Title size="sm">Outer</Title>
          </Heading>
          <Detail>
            {Array.from({ length: 6 }).map((_, i) => (
              <BodyText key={i}>Outer row {i + 1}</BodyText>
            ))}
            <Section>
              <Heading>
                <Title size="sm">Inner</Title>
              </Heading>
              <Detail>
                {Array.from({ length: 30 }).map((_, i) => (
                  <BodyText key={i}>Inner row {i + 1}</BodyText>
                ))}
              </Detail>
            </Section>
          </Detail>
        </Section>
      </VBody>
    </Card>
  ),
};
