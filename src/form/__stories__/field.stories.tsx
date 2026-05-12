import type { Meta, StoryObj } from '@storybook/react';
import { VStack } from '../../stacks/v_stack.js';
import { HStack } from '../../stacks/h_stack.js';
import { Input } from '../../inputs/input/input.js';
import { Textarea } from '../../inputs/textarea/textarea.js';
import { Select } from '../../inputs/select/select.js';
import { Option } from '../../inputs/select/option.js';
import { Field } from '../field/field.js';
import { FieldRow } from '../field/field_row/field_row.js';
import { FieldStack } from '../field/field_stack/field_stack.js';

const meta: Meta = {
  title: 'Form/Field',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const ResponsiveField: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Resize the container — `Field` switches between `FieldStack` (narrow) and `FieldRow` (wide) at `breakpointPixels` (default 500).',
      },
    },
  },
  render: () => (
    <VStack width="100%" gap="16px">
      <Field label="Email" description="Where we send the welcome message." required>
        <Input placeholder="you@example.com" width="fill" />
      </Field>
      <Field label="Bio" description="A short description.">
        <Textarea rows={3} placeholder="A few sentences…" width="fill" />
      </Field>
    </VStack>
  ),
};

export const RowBasic: Story = {
  render: () => (
    <FieldRow label="Email" description="We won't share it.">
      <Input placeholder="you@example.com" width="fill" />
    </FieldRow>
  ),
};

export const StackBasic: Story = {
  render: () => (
    <FieldStack label="Email" description="We won't share it.">
      <Input placeholder="you@example.com" width="fill" />
    </FieldStack>
  ),
};

export const RequiredAndError: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Required adds a `*` marker (theme paints it). Passing `errorMessage` sets `data-has-error="true"` and renders the message below the control.',
      },
    },
  },
  render: () => (
    <VStack gap="16px" width="100%">
      <FieldRow label="Email" required>
        <Input placeholder="you@example.com" width="fill" />
      </FieldRow>
      <FieldRow
        label="Email"
        required
        errorMessage="That doesn't look like a valid email."
      >
        <Input defaultValue="not-an-email" invalid width="fill" />
      </FieldRow>
    </VStack>
  ),
};

export const StatusStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`locked`, `loading`, and an `errorMessage` each flip the `data-state` of the inner `FieldStatusInput`. The library ships empty `<span>` placeholders for the adornment glyph — the theme paints them.',
      },
    },
  },
  render: () => (
    <VStack gap="16px" width="100%">
      <FieldRow label="Default">
        <Input placeholder="editable" width="fill" />
      </FieldRow>
      <FieldRow label="Locked" locked>
        <Input defaultValue="locked value" width="fill" />
      </FieldRow>
      <FieldRow label="Loading" loading>
        <Input defaultValue="…" width="fill" />
      </FieldRow>
      <FieldRow label="Error" errorMessage="Something went wrong.">
        <Input defaultValue="bad value" invalid width="fill" />
      </FieldRow>
    </VStack>
  ),
};

export const WithSelect: Story = {
  render: () => (
    <FieldRow label="Country" description="Used for shipping estimates." required>
      <Select width="fill" defaultValue="us">
        <Option value="us">United States</Option>
        <Option value="ca">Canada</Option>
        <Option value="mx">Mexico</Option>
      </Select>
    </FieldRow>
  ),
};

export const CustomLabelWidth: Story = {
  parameters: {
    docs: {
      description: {
        story: '`labelWidth` controls the width of the label column on `FieldRow`.',
      },
    },
  },
  render: () => (
    <VStack gap="12px" width="100%">
      <FieldRow label="Default 40%" description="Default label width.">
        <Input placeholder="…" width="fill" />
      </FieldRow>
      <FieldRow label="200px label" labelWidth="200px">
        <Input placeholder="…" width="fill" />
      </FieldRow>
      <FieldRow label="60% label" labelWidth="60%">
        <Input placeholder="…" width="fill" />
      </FieldRow>
    </VStack>
  ),
};

export const SideBySideRowAndStack: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Both layouts share the same `FieldInput` prop shape — drop in whichever fits the surrounding context.',
      },
    },
  },
  render: () => (
    <HStack gap="32px" vAlign="start" width="100%">
      <VStack gap="12px" width="fill">
        <strong>FieldRow</strong>
        <FieldRow label="Email" description="Inline label.">
          <Input placeholder="you@example.com" width="fill" />
        </FieldRow>
        <FieldRow label="Bio">
          <Textarea rows={3} width="fill" />
        </FieldRow>
      </VStack>
      <VStack gap="12px" width="fill">
        <strong>FieldStack</strong>
        <FieldStack label="Email" description="Stacked label.">
          <Input placeholder="you@example.com" width="fill" />
        </FieldStack>
        <FieldStack label="Bio">
          <Textarea rows={3} width="fill" />
        </FieldStack>
      </VStack>
    </HStack>
  ),
};
