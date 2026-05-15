import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve, dirname, relative } from 'node:path';
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
      // Use `<dir>/index` as the entry name so vite outputs JS at
      // `dist/<dir>/index.js` — matching where the dts plugin writes
      // its type declarations AND what `package.json` exports expect.
      // Without this, JS lands at `dist/<dir>.js` (a file, not inside
      // the directory) and every subpath export is broken.
      entries[base ? `${base}/index` : 'index'] = full;
    }
  }
  return entries;
}

/**
 * Vite's lib mode strips side-effect CSS imports out of built JS,
 * leaving `/* empty css *​/` placeholders. The CSS files still get
 * emitted to dist, but nothing imports them — consumer bundlers see
 * no reference and skip the files. Components ship with hashed class
 * names but no stylesheet attached.
 *
 * This plugin uses the `viteMetadata.importedCss` set vite already
 * populates on each chunk to re-inject `import './foo.css';` lines
 * at the top of each emitted JS chunk. Consumer bundlers then see
 * the imports and bundle the CSS as side effects (which is what
 * `package.json`'s `"sideEffects": ["**​/*.css"]` already promises).
 */
function injectImportedCss() {
  return {
    name: 'inject-imported-css',
    apply: 'build' as const,
    generateBundle(_outputOptions: unknown, bundle: Record<string, unknown>) {
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName] as {
          type: string;
          code?: string;
          viteMetadata?: { importedCss?: Set<string> };
        };
        if (chunk.type !== 'chunk') continue;
        const importedCss = chunk.viteMetadata?.importedCss;
        if (!importedCss || importedCss.size === 0) continue;

        const chunkDir = dirname(fileName);
        const imports = [...importedCss]
          .map((cssFile) => {
            let rel = relative(chunkDir, cssFile).replace(/\\/g, '/');
            if (!rel.startsWith('.')) rel = `./${rel}`;
            return `import '${rel}';`;
          })
          .join('\n');

        chunk.code = `${imports}\n${chunk.code ?? ''}`;
      }
    },
  };
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
    injectImportedCss(),
  ],
});
