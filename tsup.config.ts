import {defineConfig} from 'tsup';
import packageJson from './package.json';

const dependencies = Object.keys(packageJson.dependencies || {});
const devDependencies = Object.keys(packageJson.devDependencies || {});
const peerDependencies = Object.keys(packageJson.peerDependencies || {});

export default defineConfig({
  entry: ['src/index.ts', 'src/index.node.ts', 'src/index.browser.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  external: [
    ...dependencies,
    ...devDependencies,
    ...peerDependencies,
  ],
});
