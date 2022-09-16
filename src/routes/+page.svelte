<script lang="ts">
	import { signerAddress, chainId } from 'svelte-ethers-store'
	import TitleBar from '$lib/components/TitleBar.svelte'
</script>

<TitleBar />

<div class="max-w-screen-xl mx-auto my-6">
	<h1 class="text-3xl mb-3">Welcome to Web3</h1>
	<p class="mb-3">{$signerAddress} {$chainId}</p>
</div>
