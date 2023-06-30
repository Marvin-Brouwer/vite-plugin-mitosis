import { defineConfig } from "vite";

import packageConfig from './package.json';
import path from 'path';

import ts from '@rollup/plugin-typescript';
import typescript from 'typescript';

const isDev = process.argv.join(' ').includes('--mode development');

const entry = path.resolve(__dirname, 'src/plugin.mts');
const packageNameDefinition = packageConfig.name.split('/');
const packageName = packageNameDefinition[1];
const outputDir = 'dist';

// TODO dts plugin

export default defineConfig({
	plugins: [
		ts({
			typescript
		})
	],
	build: {
		sourcemap: true,
		outDir: outputDir,
		minify: !isDev,
		rollupOptions: {
			external: [
				'@builder.io/mitosis',
				'vite',
				'path',
			],
			output: {
				compact: !isDev,
				indent: isDev,
				sourcemap: isDev,
				preserveModules: false,
				entryFileNames: `[name].mjs`,
				chunkFileNames: `[name].[hash].mjs`,
			}
		},
		lib: {
			entry,
			name: packageName,
			formats: ["es"],
			fileName: (format) => `${packageName}.${format}.js`,
		}
	}
});