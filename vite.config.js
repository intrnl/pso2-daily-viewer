import { defineConfig } from 'vite';
import { svelte } from './lib/vite-plugin-svelte.js';


export default defineConfig({
	root: 'src/',
	build: {
		outDir: '../dist/',
		emptyOutDir: true,
		polyfillDynamicImport: false,
	},
	plugins: [
		svelte(),
	],
});
