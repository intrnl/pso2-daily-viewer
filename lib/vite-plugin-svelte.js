import * as path from 'path';
import { createRequire } from 'module';

import * as compiler from 'svelte/compiler';
import { createMakeHot } from 'svelte-hmr';

import { typescriptPreprocessor } from './svelte-preprocessor-esbuild.js';

let require = createRequire(import.meta.url);
let runtimePath = path.dirname(require.resolve('svelte-hmr/runtime'));


let makeHot = (...args) => (
	(makeHot = createMakeHot({
		walk: compiler.walk,
		hotApi: '@@svelte-hmr/hot-api-esm.js',
		adapter: '@@svelte-hmr/proxy-adapter-dom.js',
	}))(...args)
);


export function svelte (opts = {}) {
	let {
		compileOptions = {},
		hmrOptions = {},
		preprocess = [],
		typescript = true,
	} = opts;

	if (typescript) {
		preprocess = [typescriptPreprocessor, preprocess].flat();
	}

	let cssMap = new Map();
	let isProduction = true;

	return {
		name: 'vite-plugin-svelte',

		config () {
			return {
				resolve: {
					dedupe: ['svelte'],
					alias: [
						{ find: '@@svelte-hmr', replacement: runtimePath },
					]
				},
				optimizeDeps: {
					exclude: ['svelte-hmr'],
				},
			};
		},

		configResolved (config) {
			isProduction = config.isProduction;
		},

		async resolveId (id) {
			if (!id.endsWith('.svelte.css')) return null;
			if (!cssMap.has(id.slice(0, -4))) return null;
			return id;
		},

		load (id) {
			if (!id.endsWith('.svelte.css')) return null;
			return cssMap.get(id.slice(0, -4)) || null;
		},

		async transform (source, filename, isSSR) {
			if (!filename.endsWith('.svelte')) return null;

			let dependencies = [];
			let options = {
				generate: isSSR ? 'ssr' : 'dom',
				dev: !isProduction,
				css: !isProduction,
				format: 'esm',
				...compileOptions,
				filename,
			};

			if (preprocess) {
				let processed = await compiler.preprocess(source, preprocess, { filename });

				if (processed.dependencies) dependencies = dependencies.concat(processed.dependencies);
				if (processed.map) options.sourcemap = processed.map;
				source = processed.code;
			}

			let compiled = compiler.compile(source, options);

			if (!options.css && compiled.css.code) {
				compiled.js.code += `import ${JSON.stringify(filename + '.css')};`;
				cssMap.set(filename, compiled.css);
			}

			if (!isProduction && !isSSR && hmrOptions) {
				compiled.js.code = makeHot({
					id: filename,
					compiled: compiled,
					compiledCode: compiled.js.code,
					originalCode: source,
					compileOptions: options,
					hotOptions: {
						preserveLocalState: true,
						injectCss: true,
						...(typeof hmrOptions == 'object' ? hmrOptions : {}),
					},
				});
			}

			for (let msg of compiled.warnings) {
				this.warn(msg);
			}

			compiled.js.dependencies = dependencies;
			return compiled.js;
		},
	};
}
