<script lang="ts">
	import { fly } from 'svelte/transition'
	import { signerAddress } from 'svelte-ethers-store'
	import { activeChain, chains } from '$lib/stores/app'
	import ErrorIcon from 'virtual:icons/ri/error-warning-line'
</script>

<div
	class="col-start-1 row-start-1 w-full card bg-base-200 shadow-lg"
	in:fly={{ x: 500, duration: 500 }}
	out:fly={{ x: -500, duration: 500 }}
>
	<div class="card-body gap-6">
		<h2 class="card-title text-3xl">Choose Tokens</h2>
		<div>Now, please choose the two tokens of the liquidity pair.</div>
		{#if $signerAddress && chains[$activeChain]}
			Fields
		{:else}
			<div class="flex text-error text-lg justify-center items-center gap-2">
				<ErrorIcon /> Use the controls in the top-right to connect and set a valid network.
			</div>
		{/if}
	</div>
</div>
