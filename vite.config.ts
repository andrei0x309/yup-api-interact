import path from 'node:path'
import { defineConfig } from 'vite'
import typescript from '@rollup/plugin-typescript'

declare const __dirname: string;


const resolvePath = (str: string) => path.resolve(__dirname, str)


export default defineConfig({
	resolve: {
		alias: {
			'@': resolvePath('src'),
		},
	},
	plugins: [
		typescript({'target': 'es2020',
			'rootDir': resolvePath('src'),
			'declaration': true,
			'declarationDir': resolvePath('dist'),
			exclude: resolvePath('node_modules/**'),
			allowSyntheticDefaultImports: true,
			sourceMap: false,
}),
	],
	build: {
		lib: {
			entry: resolvePath('src/main.ts'),
			name: 'YupAPI',
			fileName: (format) => `yup-api-interact.${format}.js`,
		},
	},
})
