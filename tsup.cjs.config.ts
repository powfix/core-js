import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  splitting: true,
  target: 'es5',
  format: 'cjs',
  dts: false,
  treeshake: true,
  bundle: false,
});
