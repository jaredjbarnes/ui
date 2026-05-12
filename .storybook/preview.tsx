// MUST be the first import — declares the layer order
// (j13b-reset, j13b-system, j13b-theme) before any other CSS gets a
// chance to declare its own @layer block. Layer order is fixed by
// FIRST APPEARANCE, so if Theme (which transitively loads reset.css
// + module.css system styles) imported first, those layers would
// register out of order and the theme cascade would break.
import '../src/css/layers.css';

import type { Preview } from '@storybook/react';
import { Theme } from '../src/themes/theme.js';
import { midnightStyleSheet } from '../src/themes/themes/midnight/index.js';
import { glassStyleSheet } from '../src/themes/themes/glass/index.js';
import './preview.css';

const stylesheets = {
  midnight: midnightStyleSheet,
  glass: glassStyleSheet,
} as const;

type ThemeName = keyof typeof stylesheets;

const preview: Preview = {
  // Generate a "Docs" tab for every story file with embedded source-code
  // ("Show code") toggles per story.
  tags: ['autodocs'],

  // Toolbar dropdown for switching themes. The decorator below reads
  // context.globals.theme and applies the matching stylesheet.
  globalTypes: {
    theme: {
      description: 'UI theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'midnight', title: 'Midnight' },
          { value: 'glass', title: 'Glass' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: { theme: 'midnight' satisfies ThemeName },

  // Single global Theme wrapper. Per-story padding is controlled by the
  // `themePadding` parameter (default 32). Stories that need to fill the
  // viewport edge-to-edge — Page/Sidebar/full-bleed layouts — opt out
  // with `parameters: { themePadding: 0 }`.
  decorators: [
    (Story, context) => {
      const themeName = (context.globals.theme as ThemeName) ?? 'midnight';
      const sheet = stylesheets[themeName] ?? stylesheets.midnight;
      const padding = (context.parameters.themePadding as number | undefined) ?? 32;
      return (
        <Theme styleSheets={[sheet]} style={{ padding, minHeight: '100vh' }}>
          <Story />
        </Theme>
      );
    },
  ],

  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // 'fullscreen' so Storybook's own padding doesn't stack on top of the
    // global Theme decorator's padding. Stories can still override.
    layout: 'fullscreen',
    docs: {
      // Source panel collapsed by default; consumers click "Show code"
      // to expand the JSX.
      canvas: { sourceState: 'hidden' },
    },
  },
};

export default preview;
