import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'
import Icons from 'unplugin-icons/vite'
import svg from '@poppanator/sveltekit-svg'

const config: UserConfig = {
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		}),
		svg({
			includePaths: ['./src/lib/assets/']
		})
	]
}

export default config
