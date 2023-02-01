<script lang="ts">
	import { onMount } from 'svelte'
	import { themeChange } from 'theme-change'
	import ChainSelect from './ChainSelect.svelte'
	import Wallet from './Wallet.svelte'
	import Logo from '$lib/assets/logo-halftone.svg?component'
	import SunIcon from 'virtual:icons/ri/sun-line'
	import MoonIcon from 'virtual:icons/ri/moon-line'
	import { dark } from '$lib/stores/app'

	onMount(() => {
		themeChange(false)
		dark.set(document.documentElement.getAttribute('data-theme') === 'dark')
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'data-theme') {
					dark.set(document.documentElement.getAttribute('data-theme') === 'dark')
				}
			})
		})
		observer.observe(document.documentElement, { attributes: true })
	})
</script>

<div class="navbar flex-wrap justify-end gap-2 px-6 md:gap-6">
	<a href="/" class="flex-1" title="Home page"><Logo class="h-10 md:h-20" /></a>
	<div class="tooltip tooltip-left flex-none" data-tip="Toggle dark theme">
		<button
			type="button"
			class="btn-outline btn-sm btn flex-nowrap gap-2 px-2"
			data-toggle-theme="light,dark"
			data-act-class="dark-enabled"
			aria-label="Toggle dark theme"
		>
			<span class:hidden={$dark} class:md:block={$dark} class:opacity-50={$dark}><SunIcon /></span>
			<span class:hidden={!$dark} class:md:block={!$dark} class:opacity-50={!$dark}><MoonIcon /></span>
		</button>
	</div>
	<div class="flex-none">
		<ChainSelect />
	</div>
	<div class="flex-none">
		<Wallet />
	</div>
</div>
