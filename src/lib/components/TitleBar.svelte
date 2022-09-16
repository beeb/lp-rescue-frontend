<script lang="ts">
	import { onMount } from 'svelte'
	import { themeChange } from 'theme-change'
	import Wallet from './Wallet.svelte'
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

<div class="navbar px-6 gap-6">
	<a href="/" class="flex-none" title="Home page">Logo</a>
	<a href="/" class="flex-1 text-2xl" title="Home page">LP+Rescue</a>
	<div class="flex-none tooltip tooltip-left" data-tip="Toggle dark theme">
		<button
			type="button"
			class="btn btn-circle btn-outline"
			data-toggle-theme="light,dark"
			data-act-class="dark-enabled"
			aria-label="Toggle dark theme"
		>
			{#if $dark}
				<SunIcon />
			{:else}
				<MoonIcon />
			{/if}
		</button>
	</div>
	<div class="flex-none">
		<Wallet />
	</div>
</div>
