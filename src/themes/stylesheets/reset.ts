import css from './reset.css?raw';

export const reset = new CSSStyleSheet();
reset.replaceSync(css);
