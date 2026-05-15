#!/usr/bin/env node
/**
 * Build pipeline for @j13b/ui.
 *
 * Philosophy: `dist/` is a 1:1 transpiled mirror of `src/`. TS becomes
 * ESM JS (via `tsc`), and every other file referenced by imports (CSS,
 * CSS modules) is copied over verbatim. No bundling, no CSS module
 * hashing, no `?raw` resolution — the consumer's bundler handles all
 * of that.
 *
 * Steps:
 *   1. Clean `dist/`.
 *   2. Run `tsc -p tsconfig.build.json` to emit `.js` and `.d.ts`.
 *   3. Recursively copy `.css` files (modules and globals alike) from
 *      `src/` to `dist/`, mirroring directory structure.
 */
import { execSync } from 'node:child_process';
import {
  readdirSync,
  statSync,
  mkdirSync,
  copyFileSync,
  rmSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src');
const distDir = join(root, 'dist');

console.log('• Cleaning dist/');
rmSync(distDir, { recursive: true, force: true });

console.log('• Running tsc');
execSync('tsc -p tsconfig.build.json', { stdio: 'inherit', cwd: root });

console.log('• Copying CSS files');
function copyCssTree(fromDir, toDir) {
  for (const name of readdirSync(fromDir)) {
    if (name.startsWith('__') || name.startsWith('.')) continue;
    const fromPath = join(fromDir, name);
    const toPath = join(toDir, name);
    const stat = statSync(fromPath);
    if (stat.isDirectory()) {
      mkdirSync(toPath, { recursive: true });
      copyCssTree(fromPath, toPath);
    } else if (name.endsWith('.css')) {
      mkdirSync(dirname(toPath), { recursive: true });
      copyFileSync(fromPath, toPath);
    }
  }
}
copyCssTree(srcDir, distDir);

console.log('Build complete.');
