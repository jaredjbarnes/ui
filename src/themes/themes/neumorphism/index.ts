import { buildStyleSheet } from '../../build_stylesheet.js';

import themeTokens from './tokens/theme_tokens.css?raw';
import systemTokens from './tokens/system_tokens.css?raw';
import base from './parts/base.css?raw';
import typography from './parts/typography.css?raw';
import inputs from './parts/inputs.css?raw';
import layouts from './parts/layouts.css?raw';
import actions from './parts/actions.css?raw';
import calendar from './parts/calendar.css?raw';
import form from './parts/form.css?raw';
import surfaces from './parts/surfaces.css?raw';

export const neumorphismStyleSheet = buildStyleSheet([
  themeTokens,
  systemTokens,
  base,
  typography,
  surfaces,
  inputs,
  layouts,
  actions,
  calendar,
  form,
]);
