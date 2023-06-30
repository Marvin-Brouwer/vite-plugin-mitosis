import { Plugin, defineConfig } from "vite";

import packageConfig from './package.json';
import path from 'path';

// Vue 2 because of dependent project
import mitosis from '@src/plugin';

const isDev = process.argv.join(' ').includes('--mode development');
const entry = path.resolve(__dirname, 'src/test.tsx');
const packageNameDefinition = packageConfig.name.split('/');
const packageName = packageNameDefinition[1];
const outputDir = 'dist';

export default defineConfig({
	plugins: [
		// ts(),
		mitosis(isDev, {
			files: './src/**',
			targets: ['vue3', 'vue2', 'solid', 'svelte', 'react']
		})
	] as unknown as Array<Plugin>,
	build: {
		outDir: outputDir,
		minify: !isDev,
		rollupOptions: {
			external: [
				'@builder.io/mitosis'
			],
			output: {
				compact: !isDev,
				indent: isDev,
				sourcemap: isDev,
				preserveModules: false
			}
		},
		lib: {
			entry,
			name: packageName
		}
	}
});