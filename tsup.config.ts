import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/index.node.ts', 'src/index.browser.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: false,
  minify: false,
});
