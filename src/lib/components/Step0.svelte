<script lang="ts">
	import { fly } from 'svelte/transition'
	import { signerAddress } from 'svelte-ethers-store'
	import { activeChain, chains } from '$lib/stores/app'
	import CheckIcon from 'virtual:icons/ri/check-line'
	import InfoIcon from 'virtual:icons/ri/information-line'
</script>

<div
	class="col-start-1 row-start-1 w-full card bg-base-200 shadow-lg"
	in:fly={{ x: 500, duration: 500 }}
	out:fly={{ x: -500, duration: 500 }}
>
	<div class="card-body gap-6">
		<h2 class="card-title text-3xl">Before we begin...</h2>
		<div>First off, your wallet needs to be connected and on the right network.</div>
		{#if $signerAddress && chains[$activeChain]}
			<div class="flex text-success text-lg justify-center items-center gap-2">
				<CheckIcon /> Everything seems correct
			</div>
		{:else}
			<div class="flex text-info text-lg justify-center items-center gap-2">
				<InfoIcon /> Use the controls in the top-right to connect and set the network.
			</div>
		{/if}
	</div>
</div>
