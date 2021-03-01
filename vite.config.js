import { defineConfig } from 'vite';
import { svelte } from './lib/vite-plugin-svelte.js';


export default defineConfig({
	root: 'src/',
	base: '/pso2-daily-viewer/',
	build: {
		outDir: '../dist/',
		emptyOutDir: true,
		polyfillDynamicImport: false,
	},
	plugins: [
		svelte(),
	],
});
