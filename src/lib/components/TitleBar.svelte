<script lang="ts">
	import { onMount } from 'svelte'
	import { themeChange } from 'theme-change'
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

<div class="navbar px-6 gap-6 fixed">
	<a href="/" class="flex-1" title="Home page"><Logo height="5rem" /></a>
	<div class="flex-none tooltip tooltip-left" data-tip="Toggle dark theme">
		<button
			type="button"
			class="btn btn-sm btn-circle btn-outline gap-2 px-7 flex-nowrap"
			data-toggle-theme="light,dark"
			data-act-class="dark-enabled"
			aria-label="Toggle dark theme"
		>
			<span class:opacity-50={$dark}><SunIcon /></span>
			<span class:opacity-50={!$dark}><MoonIcon /></span>
		</button>
	</div>
	<div class="flex-none">
		<Wallet />
	</div>
</div>
