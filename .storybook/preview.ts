import type { Preview } from '@storybook/react';
import '../src/css/layers.css';
import './preview.css';

const preview: Preview = {
  // Generate a "Docs" tab for every story file with embedded source-code
  // ("Show code") toggles per story.
  tags: ['autodocs'],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'padded',
    docs: {
      // Source panel collapsed by default; consumers click "Show code"
      // to expand the JSX.
      canvas: { sourceState: 'hidden' },
    },
  },
};

export default preview;
