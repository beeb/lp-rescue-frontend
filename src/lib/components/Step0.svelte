<script lang="ts">
	import { fly } from 'svelte/transition'
	import { signerAddress } from 'svelte-ethers-store'
	import { chains } from '$lib/constants'
	import { activeChain, step } from '$lib/stores/app'
	import CheckIcon from 'virtual:icons/ri/check-line'
	import InfoIcon from 'virtual:icons/ri/information-line'
	import ArrowRightIcon from 'virtual:icons/ri/arrow-right-s-line'

	$: valid = $signerAddress && chains[$activeChain]
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
			<div class="alert alert-success shadow-lg justify-center">
				<div>
					<CheckIcon /> Everything seems correct
				</div>
			</div>
		{:else}
			<div class="alert alert-info shadow-lg justify-center">
				<div>
					<InfoIcon /> Use the controls in the top-right to connect and set a valid network.
				</div>
			</div>
		{/if}
	</div>
</div>

<div class="flex gap-6 justify-center mt-6">
	<button
		type="button"
		class="btn btn-primary gap-1 pr-3"
		on:click={() => {
			$step++
		}}
		disabled={!valid}
	>
		Next <ArrowRightIcon />
	</button>
</div>
