import path from 'path';
// TODO borrow stuff from: https://github.com/vitejs/vite-plugin-vue2-jsx/blob/main/src/index.ts
// or any of these: https://vitejs.dev/plugins/
import { createFilter} from 'vite';
import type { Plugin, ResolvedConfig } from 'vite';

type NamedPlugin = Plugin & {
	name: string
}

export type MitosisConfig = Omit<InnerConfig, 'files'> & {};

import { parseJsx, MitosisConfig as InnerConfig, componentToMitosis, componentToReact, componentToVue2, componentToVue3, componentToLit } from '@builder.io/mitosis';

export const mitosisPlugin = (config: Partial<MitosisConfig> = {}): NamedPlugin => {

    const pluginName = 'vite:mitosis';

	const { parserOptions }  = config;

    let _config : ResolvedConfig;

    return ({
        name: pluginName,

		enforce: 'pre',
		apply: 'build',

		config(_userConfig) {
			return {
				// only apply esbuild to ts files
				// since we are handling tsx now
				esbuild: {
					include: /\.ts$/,
					jsx: 'automatic'
				}
			}
		},

        configResolved(resolvedConfig) {
            _config = resolvedConfig
        },

        async transform(code, id) {

			console.log(id)
			if (id.includes('/node_modules/')) return

			const filter = createFilter(/\.tsx$/);
			const [filePath] = id.split('?')

			console.log(_config.build.outDir)
            if (!filter(id) && !filter(filePath))
                return null;

			// const presets = [
			// [jsx, {
			// 	compositionAPI: 'native',
			// 	...babelPresetOptions
			// }]
			// ]
			// plugins.push([
			// 	// @ts-ignore missing type
			// 	await import('@babel/plugin-transform-typescript').then(
			// 	(r) => r.default
			// 	),
			// 	// @ts-ignore
			// 	{ isTSX: true, allowExtensions: true, allowDeclareFields: true },
			// ])


			console.log('parseJsx', code)
			const jsonTree = parseJsx(code, { typescript: true });

			this.emitFile({
				fileName: path.basename(filePath)+'.tree.json',
				source: JSON.stringify(jsonTree, null, "	"),
				type: 'asset'
			})

			const mitosisComponent = componentToMitosis({ typescript: parserOptions.jsx.typescript, format: 'legacy' })({ component: jsonTree })
			const react = componentToReact({ typescript: parserOptions.jsx.typescript })({ component: jsonTree })
			const vue2 = componentToVue2({ typescript: parserOptions.jsx.typescript, api: 'composition', defineComponent: true })({ component: jsonTree, path: './src/**' })
			const vue3 = componentToVue3({ typescript: parserOptions.jsx.typescript, api: 'composition' })({ component: jsonTree })
			const lit = componentToLit({ typescript: parserOptions.jsx.typescript })({ component: jsonTree })


			this.emitFile({
				fileName: 'vue2-'+path.basename(filePath) + '.vue',
				source: vue2,
				type: 'asset'
			})
			this.emitFile({
				fileName: 'vue3-'+path.basename(filePath) + '.vue',
				source: vue3,
				type: 'asset'
			})
			this.emitFile({
				fileName: 'mitosisComponent-'+path.basename(filePath),
				source: mitosisComponent,
				type: 'asset'
			})
			this.emitFile({
				fileName: 'react-'+path.basename(filePath),
				source: react,
				type: 'asset'
			})
			this.emitFile({
				fileName: 'lit-'+path.basename(filePath),
				source: lit,
				type: 'asset'
			})


			return { code, moduleSideEffects: true };
        }
    });
};

export default mitosisPlugin;