import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
import { readdirSync, statSync } from 'node:fs';

const SRC = resolve(__dirname, 'src');

function collectEntries(dir: string, base = ''): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const name of readdirSync(dir)) {
    if (name.startsWith('__') || name.startsWith('.')) continue;
    const full = resolve(dir, name);
    const rel = base ? `${base}/${name}` : name;
    if (statSync(full).isDirectory()) {
      Object.assign(entries, collectEntries(full, rel));
    } else if (name === 'index.ts' || name === 'index.tsx') {
      entries[base || 'index'] = full;
    }
  }
  return entries;
}

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
    lib: {
      entry: { index: resolve(SRC, 'index.ts'), ...collectEntries(SRC) },
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) =>
        id === 'react' ||
        id === 'react-dom' ||
        id.startsWith('react/') ||
        id.startsWith('react-dom/') ||
        id === 'clsx',
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
    cssCodeSplit: true,
  },
  plugins: [
    dts({
      entryRoot: 'src',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['**/*.stories.tsx', '**/__stories__/**'],
    }),
  ],
});
