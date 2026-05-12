import type { Meta, StoryObj } from '@storybook/react';
import { HStack } from '../h_stack.js';
import { VStack } from '../v_stack.js';
import { ZStack } from '../z_stack.js';
import { Spacer } from '../spacer.js';
import { Button } from '../../actions/button/button/button.js';
import { BodyText } from '../../typography/body_text.js';

const meta: Meta = {
  title: 'Stacks',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

/* ==================================================================
   HStack
   ================================================================== */

export const HStackBasic: Story = {
  render: () => (
    <HStack gap="8px">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </HStack>
  ),
};

export const HStackVAlignStart: Story = {
  render: () => (
    <HStack vAlign="start" gap="8px">
      <Button size="sm">sm</Button>
      <Button size="md">md</Button>
      <Button size="lg">lg</Button>
    </HStack>
  ),
};

export const HStackVAlignCenter: Story = {
  render: () => (
    <HStack vAlign="center" gap="8px">
      <Button size="sm">sm</Button>
      <Button size="md">md</Button>
      <Button size="lg">lg</Button>
    </HStack>
  ),
};

export const HStackVAlignEnd: Story = {
  render: () => (
    <HStack vAlign="end" gap="8px">
      <Button size="sm">sm</Button>
      <Button size="md">md</Button>
      <Button size="lg">lg</Button>
    </HStack>
  ),
};

export const HStackHAlignCenter: Story = {
  render: () => (
    <HStack hAlign="center" gap="8px">
      <Button>One</Button>
      <Button>Two</Button>
    </HStack>
  ),
};

export const HStackHAlignEnd: Story = {
  render: () => (
    <HStack hAlign="end" gap="8px">
      <Button>One</Button>
      <Button>Two</Button>
    </HStack>
  ),
};

/* ==================================================================
   HStack — child sizing
   ================================================================== */

export const HStackChildWidthDefault: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Child HStacks default to width="default" inside an HStack parent — they share the row\'s available space (flex-grow: 1).',
      },
    },
  },
  render: () => (
    <HStack gap="8px">
      <HStack padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>one</BodyText>
      </HStack>
      <HStack padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>two</BodyText>
      </HStack>
      <HStack padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>three</BodyText>
      </HStack>
    </HStack>
  ),
};

export const HStackChildWidthAuto: Story = {
  parameters: {
    docs: {
      description: {
        story: 'width="auto" sizes the child to its content — does not grow.',
      },
    },
  },
  render: () => (
    <HStack gap="8px">
      <HStack width="auto" padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>auto</BodyText>
      </HStack>
      <HStack width="auto" padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>auto</BodyText>
      </HStack>
    </HStack>
  ),
};

export const HStackChildWidthFill: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'width="fill" explicitly grows. Mixed with auto siblings, fill takes the remaining space.',
      },
    },
  },
  render: () => (
    <HStack gap="8px">
      <HStack width="auto" padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>auto</BodyText>
      </HStack>
      <HStack width="fill" padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>fill</BodyText>
      </HStack>
      <HStack width="auto" padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>auto</BodyText>
      </HStack>
    </HStack>
  ),
};

export const HStackChildHeightFill: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'In an HStack, height="fill" on a child stretches it to 100% of the row height (cross-axis).',
      },
    },
  },
  render: () => (
    <HStack gap="8px" height="120px">
      <HStack width="auto" height="fill" padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>h=fill</BodyText>
      </HStack>
      <HStack width="auto" padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>h=default</BodyText>
      </HStack>
    </HStack>
  ),
};

/* ==================================================================
   VStack
   ================================================================== */

export const VStackBasic: Story = {
  render: () => (
    <VStack gap="8px">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </VStack>
  ),
};

export const VStackHAlignCenter: Story = {
  render: () => (
    <VStack hAlign="center" gap="8px">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </VStack>
  ),
};

export const VStackHAlignEnd: Story = {
  render: () => (
    <VStack hAlign="end" gap="8px">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </VStack>
  ),
};

export const VStackVAlignCenter: Story = {
  render: () => (
    <VStack vAlign="center" gap="8px" height="240px">
      <Button>One</Button>
      <Button>Two</Button>
    </VStack>
  ),
};

export const VStackChildHeightFill: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'In a VStack, height="fill" on a child grows it to take remaining vertical space (main axis).',
      },
    },
  },
  render: () => (
    <VStack gap="8px" height="320px">
      <HStack padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>top (default)</BodyText>
      </HStack>
      <HStack height="fill" padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>fill (grows)</BodyText>
      </HStack>
      <HStack padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>bottom (default)</BodyText>
      </HStack>
    </VStack>
  ),
};

/* ==================================================================
   Nesting
   ================================================================== */

export const VStackInsideHStack: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A VStack nested in an HStack — the VStack defaults to width="default" so it shares the row\'s width.',
      },
    },
  },
  render: () => (
    <HStack gap="16px">
      <VStack gap="4px" padding="12px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>title</BodyText>
        <BodyText>line one</BodyText>
        <BodyText>line two</BodyText>
      </VStack>
      <VStack gap="4px" padding="12px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText>title</BodyText>
        <BodyText>line one</BodyText>
      </VStack>
    </HStack>
  ),
};

export const HStackInsideVStack: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An HStack nested in a VStack — the HStack defaults to width="default" which fills the column horizontally.',
      },
    },
  },
  render: () => (
    <VStack gap="8px">
      <HStack gap="8px" padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <Button hierarchy="tertiary">edit</Button>
        <Button hierarchy="tertiary">delete</Button>
      </HStack>
      <HStack gap="8px" padding="8px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <Button hierarchy="tertiary">archive</Button>
        <Button hierarchy="tertiary">share</Button>
      </HStack>
    </VStack>
  ),
};

/* ==================================================================
   Spacer
   ================================================================== */

export const SpacerPushApart: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A Spacer with no width/height greedily takes remaining space, pushing siblings apart.',
      },
    },
  },
  render: () => (
    <HStack gap="8px">
      <Button>Cancel</Button>
      <Spacer />
      <Button hierarchy="primary">Save</Button>
    </HStack>
  ),
};

export const SpacerFixed: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A Spacer with a literal width becomes a fixed gap.',
      },
    },
  },
  render: () => (
    <HStack>
      <Button>Left</Button>
      <Spacer width="80px" />
      <Button>Right</Button>
    </HStack>
  ),
};

export const SpacerWeightedRatio: Story = {
  parameters: {
    docs: {
      description: {
        story: 'fillSpaceWeight gives a Spacer a relative ratio against other Spacers.',
      },
    },
  },
  render: () => (
    <HStack>
      <Button>A</Button>
      <Spacer fillSpaceWeight={1} />
      <Button>B</Button>
      <Spacer fillSpaceWeight={2} />
      <Button>C</Button>
    </HStack>
  ),
};

/* ==================================================================
   ZStack
   ================================================================== */

export const ZStackCentered: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ZStack overlays children. Default vAlign="center" hAlign="center" stacks them at the center.',
      },
    },
  },
  render: () => (
    <ZStack height="200px" style={{ background: '#1f2330', borderRadius: 8 }}>
      <ZStack width="320px" height="160px" style={{ background: '#2c3142', borderRadius: 4 }} />
      <Button hierarchy="primary">Centered overlay</Button>
    </ZStack>
  ),
};

export const ZStackCorner: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Per-child placement via vAlign × hAlign — useful for overlays anchored to a corner.',
      },
    },
  },
  render: () => (
    <ZStack height="200px" style={{ background: '#1f2330', borderRadius: 8 }}>
      <ZStack width="320px" height="160px" style={{ background: '#2c3142', borderRadius: 4 }} />
      <ZStack hAlign="end" vAlign="start" padding="8px">
        <Button size="sm" hierarchy="tertiary">×</Button>
      </ZStack>
    </ZStack>
  ),
};

/* ==================================================================
   Wrap, inline
   ================================================================== */

export const AllowFlowWrap: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'allowFlow toggles flex-wrap so children wrap onto multiple lines when they overflow.',
      },
    },
  },
  render: () => (
    <HStack allowFlow gap="8px" maxWidth="500px">
      <Button>chip-one</Button>
      <Button>chip-two</Button>
      <Button>chip-three</Button>
      <Button>chip-four</Button>
      <Button>chip-five</Button>
      <Button>chip-six</Button>
      <Button>chip-seven</Button>
    </HStack>
  ),
};

export const InlineHStack: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'inline switches the stack to inline-flex so it sits next to surrounding text instead of forming a block.',
      },
    },
  },
  render: () => (
    <BodyText>
      A paragraph with an{' '}
      <HStack inline gap="4px" padding="2px 6px" style={{ background: '#2c3142', borderRadius: 4 }}>
        <BodyText inline>inline</BodyText>
        <BodyText inline>HStack</BodyText>
      </HStack>{' '}
      embedded directly in the text flow.
    </BodyText>
  ),
};

/* ==================================================================
   Overflow
   ================================================================== */

export const HStackOverflowScroll: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'overflowX="auto" on an HStack scrolls its children horizontally when they overflow.',
      },
    },
  },
  render: () => (
    <HStack overflowX="auto" gap="8px" maxWidth="400px">
      <Button>one</Button>
      <Button>two</Button>
      <Button>three</Button>
      <Button>four</Button>
      <Button>five</Button>
      <Button>six</Button>
      <Button>seven</Button>
    </HStack>
  ),
};

export const VStackOverflowScroll: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'overflowY="auto" on a VStack with a fixed height scrolls vertically when content overflows.',
      },
    },
  },
  render: () => (
    <VStack overflowY="auto" gap="8px" height="200px" maxWidth="240px">
      {Array.from({ length: 20 }).map((_, i) => (
        <Button key={i}>row {i + 1}</Button>
      ))}
    </VStack>
  ),
};
