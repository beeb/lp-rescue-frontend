import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'
import Icons from 'unplugin-icons/vite'
import svg from '@poppanator/sveltekit-svg'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

const config: UserConfig = {
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		}),
		svg({
			includePaths: ['./src/lib/assets/']
		})
	],
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis'
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true
				})
			]
		}
	}
}

export default config
