import path from 'node:path'
import { defineConfig } from 'vite'

declare const __dirname: string;

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	plugins: [
	],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/main.ts'),
			name: 'YupAPI',
			fileName: (format) => `yup-api-interact.${format}.js`,
		},
	},
})
